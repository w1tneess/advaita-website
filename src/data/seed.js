/**
 * Seed content.
 *
 * These JSON files are the published source of truth for the live site. The demo
 * admin panel edits a copy in localStorage; to actually publish a change you export
 * the JSON and commit it back into this directory (see README).
 */

import profile from './profile.json'
import home from './home.json'
import projects from './projects.json'
import posts from './posts.json'
import categories from './categories.json'
import tags from './tags.json'
import skills from './skills.json'
import timeline from './timeline.json'
import social from './social.json'
import settings from './settings.json'
import interests from './interests.json'

/**
 * Bump when the SHAPE of the content document changes, and add a matching migration
 * in src/lib/store.js so existing local edits are carried forward rather than lost.
 */
export const SCHEMA_VERSION = 1

/**
 * Bump when the seed CONTENT changes. A visitor with older local edits is shown a
 * non-destructive notice in the admin panel; their edits are never overwritten.
 */
export const SEED_VERSION = 1

/**
 * A fresh, deeply-cloned content document.
 * Cloning matters: without it, admin mutations would edit the imported JSON modules
 * in place and leak across a "reset to demo data".
 */
export function createSeedDocument() {
  const doc = {
    schemaVersion: SCHEMA_VERSION,
    seedVersion: SEED_VERSION,
    profile,
    home,
    projects,
    posts,
    categories,
    tags,
    skills,
    timeline,
    social,
    settings,
    interests,
  }

  return typeof structuredClone === 'function'
    ? structuredClone(doc)
    : JSON.parse(JSON.stringify(doc))
}

/** Keys of the document that hold ordered, reorderable collections. */
export const COLLECTION_KEYS = [
  'projects',
  'posts',
  'tags',
  'skills',
  'timeline',
  'social',
  'interests',
]
