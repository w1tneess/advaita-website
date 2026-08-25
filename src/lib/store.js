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

/**
 * Load the active content document.
 *
 * @returns {{doc: object, source: 'seed'|'local', warning: string|null}}
 */
export function loadDocument() {
  const storage = getStorage()
  if (!storage) {
    return { doc: createSeedDocument(), source: 'seed', warning: null }
  }

  const raw = storage.getItem(STORAGE_KEY)
  if (!raw) {
    // No local edits: use the deployed seed and write nothing.
    return { doc: createSeedDocument(), source: 'seed', warning: null }
  }

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return {
      doc: createSeedDocument(),
      source: 'seed',
      warning:
        'Saved local content could not be read and was ignored. The site is showing its published content instead.',
    }
  }

  const { doc: migrated, blockedAt } = migrate(parsed)

  if (blockedAt !== null) {
    return {
      doc: createSeedDocument(),
      source: 'seed',
      warning: `Saved local content uses an older format (v${blockedAt}) that cannot be upgraded automatically, so it was ignored. Export it from another browser if you need it, or reset the demo data.`,
    }
  }

  const { ok, problems } = validateDocument(migrated)
  if (!ok) {
    return {
      doc: createSeedDocument(),
      source: 'seed',
      warning: `Saved local content is not valid (${problems[0]}) and was ignored. The site is showing its published content instead.`,
    }
  }

  return { doc: migrated, source: 'local', warning: null }
}

/**
 * Persist the whole document.
 * @returns {{ok: boolean, error: string|null}}
 */
export function saveDocument(doc) {
  const storage = getStorage()
  if (!storage) {
    return {
      ok: false,
      error:
        'This browser is blocking local storage, so the change could not be saved. Private browsing mode is the usual cause.',
    }
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(doc))
    return { ok: true, error: null }
  } catch (error) {
    const quotaExceeded =
      error?.name === 'QuotaExceededError' || error?.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    return {
      ok: false,
      error: quotaExceeded
        ? 'Local storage is full. Export your content, then reset the demo data to free up space.'
        : 'The change could not be saved to local storage.',
    }
  }
}

/** Discard local edits so the deployed seed is used again. */
export function clearDocument() {
  const storage = getStorage()
  if (!storage) return { ok: false, error: 'Local storage is unavailable.' }
  try {
    storage.removeItem(STORAGE_KEY)
    return { ok: true, error: null }
  } catch {
    return { ok: false, error: 'Local edits could not be cleared.' }
  }
}

export function hasLocalDocument() {
  const storage = getStorage()
  if (!storage) return false
  try {
    return storage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
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
