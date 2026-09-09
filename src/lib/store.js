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
 * The read path NEVER writes. A local document is created only by the first admin
 * mutation. So an ordinary visitor, who never opens /admin, always sees the freshly
 * deployed seed — which is what keeps the public site correct after every deploy.
 *
 * Nothing here is secure and nothing here is private. localStorage is plain text,
 * readable by any script on this origin. Only public site content belongs in it.
 */

import { createSeedDocument, SCHEMA_VERSION, SEED_VERSION } from '../data/seed.js'
import { validateDocument } from './schema.js'

export const STORAGE_KEY = 'advaita-site.content.v1'
export const THEME_STORAGE_KEY = 'advaita-site.theme'

/* --------------------------------------------------------------------------
   Safe storage access — localStorage throws in some private-browsing modes,
   and is absent entirely during the Node pre-render build.
   -------------------------------------------------------------------------- */

function getStorage() {
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

export function storageAvailable() {
  return getStorage() !== null
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

function migrate(doc) {
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

import {
  fetchContentFromSupabase,
  saveContentToSupabase,
  clearContentInSupabase,
} from './supabase/sync.js'
import { isSupabaseConfigured } from './supabase/client.js'

/**
 * Load the active content document asynchronously.
 * Tries Supabase first; falls back gracefully to localStorage or seed.
 *
 * @returns {Promise<{doc: object, source: 'seed'|'local'|'remote', warning: string|null}>}
 */
export async function loadDocument() {
  const storage = getStorage()

  // 1. If Supabase is configured, attempt remote fetch
  if (isSupabaseConfigured()) {
    try {
      const { data: raw, error } = await fetchContentFromSupabase(2)

      if (!error && raw) {
        const { doc: migrated, blockedAt } = migrate(raw)
        if (blockedAt === null) {
          const { ok } = validateDocument(migrated)
          if (ok) {
            // Mirror to localStorage for offline resilience
            if (storage) {
              try {
                storage.setItem(STORAGE_KEY, JSON.stringify(migrated))
              } catch (_) {
                // Ignore storage quota error
              }
            }
            return { doc: migrated, source: 'remote', warning: null }
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
            return {
              doc: migrated,
              source: 'local',
              warning: isSupabaseConfigured()
                ? 'Using cached local edits (offline mode).'
                : null,
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
      const remoteRes = await saveContentToSupabase(doc)
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
  return await saveContentToSupabase(doc)
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
    return await clearContentInSupabase()
  }
  return { ok: true, error: null }
}

export async function hasLocalDocument() {
  const storage = getStorage()
  if (storage && storage.getItem(STORAGE_KEY)) return true
  if (isSupabaseConfigured()) {
    const { data } = await fetchContentFromSupabase()
    return data !== null
  }
  return false
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

/**
 * Parse and validate an uploaded export file.
 * @returns {{ok: boolean, doc: object|null, problems: string[]}}
 */
export function parseImportedJson(text) {
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
