/**
 * Seed content.
 *
 * These JSON files are the published source of truth for the live site. The local
 * admin editor edits a copy in localStorage; publish by exporting a bundle and
 * committing the changed files back into this directory.
 */

import profile from './profile.json' with { type: 'json' }
import home from './home.json' with { type: 'json' }
import projects from './projects.json' with { type: 'json' }
import posts from './posts.json' with { type: 'json' }
import categories from './categories.json' with { type: 'json' }
import tags from './tags.json' with { type: 'json' }
import skills from './skills.json' with { type: 'json' }
import timeline from './timeline.json' with { type: 'json' }
import social from './social.json' with { type: 'json' }
import settings from './settings.json' with { type: 'json' }
import interests from './interests.json' with { type: 'json' }
import philosophy from './philosophy.json' with { type: 'json' }
import photography from './photography.json' with { type: 'json' }

/**
 * Bump when the SHAPE of the content document changes, and add a matching migration
 * in src/lib/store.js so existing local edits are carried forward rather than lost.
 */
export const SCHEMA_VERSION = 3

/**
 * Bump when the seed CONTENT changes. A visitor with older local edits is shown a
 * non-destructive notice in the admin panel; their edits are never overwritten.
 */
export const SEED_VERSION = 2

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
    philosophy,
    photography,
    activity: [],
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
