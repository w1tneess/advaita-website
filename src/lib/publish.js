import { createSeedDocument } from '../data/seed.js'
import {
  validateCategory,
  validateDocument,
  validateInterest,
  validatePost,
  validateProfile,
  validateProject,
  validateSettings,
  validateSkill,
  validateSocialLink,
  validateTag,
  validateTimelineItem,
} from './schema.js'
import { assetPath } from './media.js'

const FILE_SECTIONS = [
  ['profile', 'src/data/profile.json'],
  ['home', 'src/data/home.json'],
  ['projects', 'src/data/projects.json'],
  ['posts', 'src/data/posts.json'],
  ['categories', 'src/data/categories.json'],
  ['tags', 'src/data/tags.json'],
  ['skills', 'src/data/skills.json'],
  ['timeline', 'src/data/timeline.json'],
  ['social', 'src/data/social.json'],
  ['settings', 'src/data/settings.json'],
  ['interests', 'src/data/interests.json'],
]

const validators = {
  projects: validateProject,
  posts: validatePost,
  tags: validateTag,
  skills: validateSkill,
  timeline: validateTimelineItem,
  social: validateSocialLink,
  interests: validateInterest,
}

function pretty(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function collectErrors(document) {
  const errors = [...validateDocument(document).problems]
  const projectSlugs = document.projects || []
  const postSlugs = document.posts || []

  if (document.profile) for (const [key, message] of Object.entries(validateProfile(document.profile))) errors.push(`profile.${key}: ${message}`)
  if (document.settings) for (const [key, message] of Object.entries(validateSettings(document.settings))) errors.push(`settings.${key}: ${message}`)

  for (const [key, items] of Object.entries(document.categories || {})) {
    for (const [index, item] of items.entries()) for (const [field, message] of Object.entries(validateCategory(item, items))) errors.push(`categories.${key}[${index}].${field}: ${message}`)
  }
  for (const [key, items] of Object.entries(validators)) {
    for (const [index, item] of (document[key] || []).entries()) {
      const siblings = key === 'projects' ? projectSlugs : key === 'posts' ? postSlugs : document[key]
      for (const [field, message] of Object.entries(items(item, siblings))) errors.push(`${key}[${index}].${field}: ${message}`)
    }
  }
  return errors
}

export function buildPublishBundle(document, assets = []) {
  const errors = collectErrors(document)
  if (errors.length) return { ok: false, errors, bundle: null }

  const baseline = createSeedDocument()
  const files = []
  for (const [key, path] of FILE_SECTIONS) {
    if (JSON.stringify(document[key]) !== JSON.stringify(baseline[key])) {
      files.push({ path, content: pretty(document[key]) })
    }
  }

  return {
    ok: true,
    errors: [],
    bundle: {
      format: 1,
      generatedAt: new Date().toISOString(),
      instructions: 'Copy these files into the repository, review git diff, then commit and push.',
      modified: files.map((file) => file.path),
      added: [],
      deleted: [],
      files,
      assets: assets.map((asset) => ({ path: assetPath(asset.filename), content: asset.dataUrl })),
    },
  }
}

export function publishBundleFilename() {
  return `advaita-publish-${new Date().toISOString().slice(0, 10)}.json`
}