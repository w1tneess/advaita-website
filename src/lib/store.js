/**
 * Content persistence.
 *
 * The model, and why it is this way:
 *
 *   localStorage holds the COMPLETE content document, never a patch.
 *
 * The obvious alternative — store only the admin's changes and deep-merge them over
 * the seed — has a real bug: deleting a seeded project cannot be represented by a
 * merge, so the deleted item reappears on the next reload. Storing the whole
 * document makes deletion mean deletion.
 *
 * Supabase is the source of truth. Each successful load mirrors the remote document into
 * localStorage so the next visit renders instantly; the bundled seed is used only when
 * there is neither a remote nor a cached copy. Visitors cache the draft-free public copy.
 *
 * Nothing here is secure and nothing here is private. localStorage is plain text,
 * readable by any script on this origin. Only public site content belongs in it.
 */

import { createSeedDocument, SCHEMA_VERSION, SEED_VERSION } from '../data/seed.js'
import { validateDocument } from './schema.js'

export const STORAGE_KEY = 'advaita-site.content.v1'

/* --------------------------------------------------------------------------
   Safe storage access — localStorage throws in some private-browsing modes,
   and is absent entirely during the Node pre-render build.
   -------------------------------------------------------------------------- */

export function getStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    // Probe: Safari private mode allows the property but throws on write.
    const probe = '__advaita_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}



/* --------------------------------------------------------------------------
   Schema migrations
   -------------------------------------------------------------------------- */

/**
 * Ordered migrations, keyed by the version being migrated FROM.
 * Each returns the document at version key + 1.
 *
 * When you change the document shape:
 *   1. bump SCHEMA_VERSION in src/data/seed.js
 *   2. add the migration here, so existing local edits survive instead of resetting
 *
 * Example:
 *   1: (doc) => ({ ...doc, awards: [], schemaVersion: 2 }),
 */
const MIGRATIONS = {
  1: (doc) => ({ ...doc, activity: Array.isArray(doc.activity) ? doc.activity : [] }),
  2: (doc) => ({
    ...doc,
    philosophy: doc.philosophy || {
      intro: '',
      description: '',
      thinkers: [],
      notesIntro: '',
      notesDescription: '',
      notes: [],
    },
    photography: doc.photography || {
      intro: '',
      description: '',
      note: '',
      categoriesNote: '',
      categories: [],
      photos: [],
    },
  }),
  3: (doc) => ({ ...doc, blog: doc.blog || [] }),
}

export function migrate(doc) {
  let current = doc
  let guard = 0

  while ((current.schemaVersion ?? 0) < SCHEMA_VERSION) {
    const from = current.schemaVersion ?? 0
    const migration = MIGRATIONS[from]
    if (!migration) return { doc: current, migrated: false, blockedAt: from }

    current = migration(current)
    current.schemaVersion = Math.max(from + 1, current.schemaVersion ?? from + 1)

    guard += 1
    if (guard > 50) return { doc: current, migrated: false, blockedAt: from }
  }

  return { doc: current, migrated: current !== doc, blockedAt: null }
}

/* --------------------------------------------------------------------------
   Load / save / clear
   -------------------------------------------------------------------------- */

// The supabase-js client (~55 KB gzip) is loaded only for admin reads and writes, never for visitors.
const loadSync = () => import('./supabase/sync.js')
import { isSupabaseConfigured } from './supabase/config.js'
import { fetchPublicContent, PUBLIC_COPY_SAVE_ERROR } from './supabase/public.js'

/**
 * Fills fields a loaded document is missing (note slugs/excerpts, project links) from the
 * deployed seed. It never replaces content: raising SEED_VERSION only shows the admin a
 * notice (seedIsNewerThan), because a reset here would overwrite live Supabase data on
 * the admin's next save.
 */
export function reconcileWithSeed(doc) {
  const seed = createSeedDocument()
  if (!doc) return seed

  // Ensure philosophy notes always have slugs, thinkers, and excerpts
  if (doc.philosophy && Array.isArray(doc.philosophy.notes)) {
    const updatedNotes = doc.philosophy.notes.map((note) => {
      const seedNote = seed.philosophy?.notes?.find(
        (sn) => sn.id === note.id || sn.title === note.title,
      )
      return {
        ...note,
        slug:
          note.slug ||
          seedNote?.slug ||
          (note.title
            ? note.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            : note.id),
        thinker: note.thinker || seedNote?.thinker || null,
        excerpt: note.excerpt || seedNote?.excerpt || '',
      }
    })
    doc = {
      ...doc,
      philosophy: {
        ...doc.philosophy,
        notes: updatedNotes,
      },
    }
  }

  // Backfill official project links from seed if missing or null in stored data
  if (Array.isArray(doc.projects)) {
    const updatedProjects = doc.projects.map((project) => {
      const seedProject = seed.projects.find(
        (sp) => sp.id === project.id || sp.slug === project.slug,
      )
      if (seedProject && seedProject.links) {
        return {
          ...project,
          links: {
            ...seedProject.links,
            ...(project.links || {}),
            live: project.links?.live || seedProject.links.live,
            repository: project.links?.repository || seedProject.links.repository,
            writeup: project.links?.writeup || seedProject.links.writeup,
          },
        }
      }
      return project
    })
    return { ...doc, projects: updatedProjects }
  }

  return doc
}

/**
 * Load the active content document asynchronously.
 * Tries Supabase first; falls back gracefully to localStorage or seed.
 * Visitors get the draft-free public copy; `full` (admin only, enforced by RLS) reads the real row.
 *
 * @returns {Promise<{doc: object, source: 'seed'|'local'|'remote', warning: string|null}>}
 */
export async function loadDocument({ full = false } = {}) {
  const storage = getStorage()

  // 1. If Supabase is configured, attempt remote fetch
  if (isSupabaseConfigured()) {
    try {
      const { data: raw, error } = full
        ? await (await loadSync()).fetchContentFromSupabase(2)
        : await fetchPublicContent()

      if (!error && raw) {
        const { doc: migrated, blockedAt } = migrate(raw)
        if (blockedAt === null) {
          const { ok } = validateDocument(migrated)
          if (ok) {
            const finalDoc = reconcileWithSeed(migrated)
            // Mirror reconciled document to localStorage for offline resilience
            if (storage) {
              try {
                storage.setItem(STORAGE_KEY, JSON.stringify(finalDoc))
              } catch (_) {
                // Ignore storage quota error
              }
            }
            return {
              doc: finalDoc,
              source: 'remote',
              warning: null,
            }
          }
        }
      }
    } catch (err) {
      console.warn('Supabase remote load failed, checking local backup:', err)
    }
  }

  // 2. Check localStorage for previous edits
  if (storage) {
    try {
      const localRaw = storage.getItem(STORAGE_KEY)
      if (localRaw) {
        const parsed = JSON.parse(localRaw)
        const { doc: migrated, blockedAt } = migrate(parsed)
        if (blockedAt === null) {
          const { ok } = validateDocument(migrated)
          if (ok) {
            const finalDoc = reconcileWithSeed(migrated)
            if (storage && finalDoc !== migrated) {
              try {
                storage.setItem(STORAGE_KEY, JSON.stringify(finalDoc))
              } catch (_) {
                // Ignore storage quota error
              }
            }
            return {
              doc: finalDoc,
              source: 'local',
              // Visitors just see the cached copy; only the admin needs to know it is not live.
              warning: full && isSupabaseConfigured() ? 'Using cached local edits (offline mode).' : null,
            }
          }
        }
      }
    } catch (err) {
      console.warn('LocalStorage load error:', err)
    }
  }

  // 3. Fallback to freshly generated seed document
  return { doc: createSeedDocument(), source: 'seed', warning: null }
}

/**
 * Persist the whole document with hybrid resilience:
 * - Always saves to local storage to prevent data loss.
 * - Attempts to sync to Supabase if configured.
 *
 * @returns {Promise<{ok: boolean, synced: boolean, source: 'remote'|'local', error: string|null, warning?: string}>}
 */
export async function saveDocument(doc) {
  if (doc?.publicCopy) {
    return { ok: false, synced: false, source: 'local', error: PUBLIC_COPY_SAVE_ERROR }
  }

  const storage = getStorage()
  let localSaved = false

  // 1. Always save to local browser storage
  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(doc))
      localSaved = true
    } catch (e) {
      console.warn('Could not cache to localStorage:', e)
    }
  }

  // 2. If Supabase is configured, attempt remote sync
  if (isSupabaseConfigured()) {
    try {
      const remoteRes = await (await loadSync()).saveContentToSupabase(doc)
      if (remoteRes && remoteRes.ok) {
        return { ok: true, synced: true, source: 'remote', error: null }
      }
      return {
        ok: localSaved,
        synced: false,
        source: 'local',
        error: localSaved ? null : (remoteRes?.error || 'Failed to save to Supabase.'),
        warning: localSaved ? 'Saved locally. Supabase sync pending.' : null,
      }
    } catch (err) {
      return {
        ok: localSaved,
        synced: false,
        source: 'local',
        error: localSaved ? null : err.message,
        warning: localSaved ? 'Saved locally. Supabase connection offline.' : null,
      }
    }
  }

  // 3. Unconfigured Supabase: safe local save
  return {
    ok: localSaved,
    synced: false,
    source: 'local',
    error: localSaved ? null : 'Storage is full or unavailable.',
    warning: 'Saved locally in browser. Supabase not connected.',
  }
}

/**
 * Push local changes to Supabase manually
 */
export async function syncLocalToSupabase(doc) {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: 'Supabase is not configured in .env.local.' }
  }
  return await (await loadSync()).saveContentToSupabase(doc)
}

/** Discard both local and remote edits so the deployed seed is used again. */
export async function clearDocument() {
  const storage = getStorage()
  if (storage) {
    try {
      storage.removeItem(STORAGE_KEY)
    } catch (_) {
      // Ignore storage removal error
    }
  }

  if (isSupabaseConfigured()) {
    return await (await loadSync()).clearContentInSupabase()
  }
  return { ok: true, error: null }
}



/**
 * True when the deployed seed content is newer than the local copy.
 *
 * Used only to show a non-destructive notice in the admin panel. Local edits are
 * never overwritten automatically — adopting new defaults is an explicit reset.
 */
export function seedIsNewerThan(doc) {
  return (doc?.seedVersion ?? 0) < SEED_VERSION
}

/* --------------------------------------------------------------------------
   Import / export
   -------------------------------------------------------------------------- */

export function documentToJson(doc) {
  return JSON.stringify(doc, null, 2)
}

export function parseImportedJson(text) {
  if (typeof text !== 'string' || text.length > 20 * 1024 * 1024) {
    return { ok: false, doc: null, problems: ['Import content exceeds maximum allowed size of 20MB.'] }
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    return { ok: false, doc: null, problems: [`The file is not valid JSON: ${error.message}`] }
  }

  const { doc: migrated, blockedAt } = migrate(parsed)
  if (blockedAt !== null) {
    return {
      ok: false,
      doc: null,
      problems: [`This export uses format v${blockedAt}, which cannot be upgraded automatically.`],
    }
  }

  const { ok, problems } = validateDocument(migrated)
  if (!ok) return { ok: false, doc: null, problems }

  return { ok: true, doc: migrated, problems: [] }
}

/** A filename that sorts chronologically and is safe on every OS. */
export function exportFilename() {
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
  return `advaita-site-${stamp}.content-export.json`
}
