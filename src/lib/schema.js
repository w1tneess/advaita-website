/**
 * Content schema: controlled vocabularies, entity factories and validation.
 *
 * Validation lives here rather than in each form so that the admin panel and the
 * JSON import path enforce exactly the same rules.
 */

import { COLLECTION_KEYS } from '../data/seed.js'

/* --------------------------------------------------------------------------
   Controlled vocabularies
   -------------------------------------------------------------------------- */

export const SOCIAL_KINDS = [
  {
    value: 'link',
    label: 'Link',
    description: 'A regular hyperlink to an external profile or site.',
  },
  { value: 'email', label: 'Email', description: 'A mailto: link to an email address.' },
]

export const PROJECT_STATUSES = [
  {
    value: 'concept',
    label: 'Concept stage',
    description: 'Designed but not built. No prototype or code exists.',
  },
  {
    value: 'in-progress',
    label: 'In progress',
    description: 'Actively being worked on.',
  },
  {
    value: 'completed',
    label: 'Completed',
    description: 'The work is finished, whether or not it was released.',
  },
]

export const POST_STATUSES = [
  { value: 'draft', label: 'Draft', description: 'Hidden from the public site.' },
  { value: 'published', label: 'Published', description: 'Visible to everyone.' },
]

export const SKILL_LEVELS = [
  {
    value: 'learning',
    label: 'Learning',
    description: 'Currently being learned. Not a claim of competence.',
  },
  {
    value: 'working-knowledge',
    label: 'Working knowledge',
    description: 'Used in at least one real project.',
  },
]

/**
 * The four-way separation the site is built around, plus a neutral note variant.
 * Used by <Callout> and by the article body editor.
 */
export const CALLOUT_VARIANTS = [
  {
    value: 'fact',
    label: 'Sourced fact',
    description: 'A claim that comes from a cited source.',
  },
  {
    value: 'analysis',
    label: 'Analysis',
    description: 'My inference from the evidence — reasoning, not reporting.',
  },
  {
    value: 'opinion',
    label: 'Opinion',
    description: 'What I think. Not evidence, and not presented as such.',
  },
  {
    value: 'limitation',
    label: 'Limitation',
    description: 'Something unknown, unresolved, or outside what this can show.',
  },
  { value: 'note', label: 'Note', description: 'Neutral aside or clarification.' },
]

export const BLOCK_TYPES = [
  { value: 'heading', label: 'Heading' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'list', label: 'List' },
  { value: 'quote', label: 'Quote' },
  { value: 'callout', label: 'Labelled callout' },
  { value: 'code', label: 'Code' },
  { value: 'image', label: 'Image' },
]

export const PROJECT_CATEGORY_SLUGS = [
  'research',
  'writing',
  'data',
  'technology',
  'education',
  'concepts',
]

export function statusLabel(list, value) {
  return list.find((item) => item.value === value)?.label ?? value
}

/* --------------------------------------------------------------------------
   Small utilities
   -------------------------------------------------------------------------- */

/** URL-safe slug. Collapses anything non-alphanumeric into single hyphens. */
export function slugify(input = '') {
  return String(input)
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

let idCounter = 0

/**
 * Collision-resistant local id. Not a UUID and not security-relevant — these ids
 * only ever identify rows inside one JSON document.
 */
export function uid(prefix = 'id') {
  idCounter += 1
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}${random}`
}

/** Today's date as YYYY-MM-DD, for date inputs. */
export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

/* --------------------------------------------------------------------------
   Entity factories
   -------------------------------------------------------------------------- */

export function createProject(overrides = {}) {
  return {
    id: uid('prj'),
    slug: '',
    title: '',
    categories: [],
    summary: '',
    description: '',
    projectDate: '',
    coverImage: '',
    gallery: [],
    role: '',
    tools: [],
    status: 'concept',
    visibility: '',
    published: false,
    methodology: [],
    limitations: [],
    links: { repository: null, live: null, writeup: null },
    featured: false,
    order: 999,
    ...overrides,
  }
}

export function createBlock(type = 'paragraph') {
  const base = { id: uid('blk'), type }
  switch (type) {
    case 'heading':
      return { ...base, level: 2, text: '' }
    case 'list':
      return { ...base, style: 'unordered', items: [''] }
    case 'quote':
      return { ...base, text: '', attribution: '' }
    case 'callout':
      return { ...base, variant: 'note', title: '', text: '' }
    case 'code':
      return { ...base, language: '', code: '' }
    case 'image':
      return { ...base, src: '', alt: '', caption: '' }
    case 'paragraph':
    default:
      return { ...base, text: '' }
  }
}

export function createSource(overrides = {}) {
  return {
    id: uid('src'),
    title: '',
    publisher: '',
    url: '',
    accessedAt: '',
    note: '',
    ...overrides,
  }
}

export function createCategory(overrides = {}) {
  return { id: uid('cat'), slug: '', name: '', description: '', ...overrides }
}

export function createSkill(overrides = {}) {
  return {
    id: uid('skl'),
    group: '',
    name: '',
    level: 'learning',
    evidence: null,
    note: '',
    order: 999,
    ...overrides,
  }
}

export function createTimelineItem(overrides = {}) {
  return { id: uid('tl'), period: '', title: '', detail: '', order: 999, ...overrides }
}

export function createSocialLink(overrides = {}) {
  return {
    id: uid('soc'),
    platform: '',
    label: '',
    icon: 'Globe',
    url: null,
    handle: null,
    placeholder: '',
    kind: 'link',
    visible: true,
    order: 999,
    ...overrides,
  }
}

export function createInterest(overrides = {}) {
  return { id: uid('int'), name: '', icon: 'BookOpen', note: '', order: 999, ...overrides }
}

export function createBlogPost(overrides = {}) {
  return {
    id: uid('post'),
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    category: '',
    published_at: '',
    status: 'draft',
    ...overrides,
  }
}

export function createPhotography(overrides = {}) {
  return {
    id: uid('pht'),
    title: '',
    category: '',
    caption: '',
    alt_text: '',
    featured: false,
    image_url: '',
    storage_path: '',
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

/* --------------------------------------------------------------------------
   Validation primitives
   -------------------------------------------------------------------------- */

const isBlank = (value) => value == null || String(value).trim() === ''

export const rules = {
  required: (label) => (value) => (isBlank(value) ? `${label} is required.` : null),

  maxLength: (max, label) => (value) =>
    !isBlank(value) && String(value).trim().length > max
      ? `${label} must be ${max} characters or fewer.`
      : null,

  minLength: (min, label) => (value) =>
    !isBlank(value) && String(value).trim().length < min
      ? `${label} must be at least ${min} characters.`
      : null,

  slug: (value) =>
    isBlank(value) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value))
      ? null
      : 'Use lowercase letters, numbers and single hyphens only.',

  oneOf: (allowed, label) => (value) =>
    allowed.includes(value) ? null : `${label} must be one of: ${allowed.join(', ')}.`,

  url: (value) =>
    isBlank(value) || /^https?:\/\/\S+$/i.test(String(value).trim())
      ? null
      : 'Enter a full URL starting with http:// or https://',

  email: (value) =>
    isBlank(value) || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim())
      ? null
      : 'Enter a valid email address.',

  isoDate: (value) =>
    isBlank(value) || /^\d{4}-\d{2}-\d{2}$/.test(String(value).trim())
      ? null
      : 'Use the date picker (YYYY-MM-DD).',

  nonEmptyArray: (label) => (value) =>
    Array.isArray(value) && value.length > 0 ? null : `Select at least one ${label}.`,

  unique: (existing, label) => (value) =>
    isBlank(value) || !existing.includes(String(value).trim())
      ? null
      : `That ${label} is already used. Choose another.`,
}

/** Run a field's rules and return the first failure, or null. */
function firstError(value, fieldRules = []) {
  for (const rule of fieldRules) {
    const error = rule(value)
    if (error) return error
  }
  return null
}

/**
 * Apply a {field: [rules]} map to an object.
 * @returns {Record<string, string>} errors keyed by field name; empty when valid.
 */
export function validate(entity = {}, ruleMap = {}) {
  const errors = {}
  for (const [field, fieldRules] of Object.entries(ruleMap)) {
    const error = firstError(entity[field], fieldRules)
    if (error) errors[field] = error
  }
  return errors
}

export const hasErrors = (errors) => Object.keys(errors).length > 0

/* --------------------------------------------------------------------------
   Entity validators
   -------------------------------------------------------------------------- */

const otherSlugs = (collection, currentId) =>
  collection.filter((item) => item.id !== currentId).map((item) => item.slug)

export function validateProject(project, allProjects = []) {
  const errors = validate(project, {
    title: [rules.required('Title'), rules.maxLength(120, 'Title')],
    slug: [
      rules.required('Slug'),
      rules.slug,
      rules.unique(otherSlugs(allProjects, project.id), 'slug'),
    ],
    summary: [rules.required('Summary'), rules.maxLength(260, 'Summary')],
    description: [rules.required('Description'), rules.minLength(40, 'Description')],
    role: [rules.required('Role')],
    status: [
      rules.oneOf(
        PROJECT_STATUSES.map((s) => s.value),
        'Status',
      ),
    ],
    categories: [rules.nonEmptyArray('category')],
    projectDate: [rules.isoDate],
  })

  const links = project.links || {}
  for (const key of ['repository', 'live', 'writeup']) {
    const error = rules.url(links[key])
    if (error) errors[`links.${key}`] = error
  }

  const coverError = rules.url(project.coverImage)
  if (coverError) errors.coverImage = coverError
  ;(project.gallery || []).forEach((image, index) => {
    const error = rules.url(image)
    if (error) errors[`gallery.${index}`] = error
  })

  return errors
}

export function validateCategory(category, siblings = []) {
  return validate(category, {
    name: [rules.required('Name'), rules.maxLength(60, 'Name')],
    slug: [
      rules.required('Slug'),
      rules.slug,
      rules.unique(otherSlugs(siblings, category.id), 'slug'),
    ],
    description: [rules.maxLength(200, 'Description')],
  })
}

export function validateSkill(skill) {
  return validate(skill, {
    name: [rules.required('Name'), rules.maxLength(80, 'Name')],
    group: [rules.required('Group')],
    level: [
      rules.oneOf(
        SKILL_LEVELS.map((l) => l.value),
        'Level',
      ),
    ],
    note: [rules.maxLength(200, 'Note')],
  })
}

export function validateTimelineItem(item) {
  return validate(item, {
    period: [rules.required('Period label'), rules.maxLength(40, 'Period label')],
    title: [rules.required('Title'), rules.maxLength(120, 'Title')],
    detail: [rules.required('Detail'), rules.maxLength(400, 'Detail')],
  })
}

export function validateSocialLink(link) {
  const errors = validate(link, {
    label: [rules.required('Label'), rules.maxLength(40, 'Label')],
    platform: [rules.required('Platform')],
  })

  if (link.kind === 'email') {
    const error = rules.email(link.url)
    if (error) errors.url = error
  } else {
    const error = rules.url(link.url)
    if (error) errors.url = error
  }

  return errors
}

export function validateInterest(interest) {
  return validate(interest, {
    name: [rules.required('Name'), rules.maxLength(60, 'Name')],
    note: [rules.maxLength(220, 'Note')],
  })
}

export function validateProfile(profile) {
  return validate(profile, {
    name: [rules.required('Display name'), rules.maxLength(80, 'Display name')],
    shortName: [rules.required('Short name'), rules.maxLength(40, 'Short name')],
    tagline: [rules.required('Tagline'), rules.maxLength(120, 'Tagline')],
    location: [rules.required('Location'), rules.maxLength(60, 'Location')],
    bio: [rules.required('Biography'), rules.minLength(40, 'Biography')],
  })
}

export function validateBlogPost(post, allPosts = []) {
  return validate(post, {
    title: [rules.required('Title'), rules.maxLength(120, 'Title')],
    slug: [rules.required('Slug'), rules.slug, rules.unique(otherSlugs(allPosts, post.id), 'slug')],
    excerpt: [rules.required('Excerpt'), rules.maxLength(300, 'Excerpt')],
    content: [rules.required('Content')],
    category: [rules.required('Category')],
    status: [
      rules.oneOf(
        POST_STATUSES.map((s) => s.value),
        'Status',
      ),
    ],
    published_at: [rules.isoDate],
  })
}

export function validateHome(home) {
  return validate(home, {
    heroHeading: [rules.required('Hero heading'), rules.maxLength(120, 'Hero heading')],
    heroIntro: [rules.required('Hero introduction'), rules.maxLength(700, 'Hero introduction')],
    credibilityStatement: [
      rules.required('Credibility statement'),
      rules.maxLength(900, 'Credibility statement'),
    ],
  })
}

export function validatePhotography(photo) {
  return validate(photo, {
    title: [rules.required('Title'), rules.maxLength(140, 'Title')],
    category: [rules.maxLength(60, 'Category')],
    alt_text: [rules.required('Alt text')],
    caption: [rules.maxLength(300, 'Caption')],
  })
}

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i

export function validateSettings(settings) {
  const errors = validate(settings, {
    defaultTheme: [rules.oneOf(['system', 'light', 'dark'], 'Default theme')],
  })

  const accent = settings.accent || {}
  for (const key of ['light', 'dark']) {
    if (!isBlank(accent[key]) && !HEX_COLOR.test(String(accent[key]).trim())) {
      errors[`accent.${key}`] =
        'Enter a hex colour such as #0f6b73, or leave blank for the default.'
    }
  }

  for (const key of ['featuredProjectLimit']) {
    const value = Number(settings[key])
    if (!Number.isInteger(value) || value < 1 || value > 50) {
      errors[key] = 'Enter a whole number between 1 and 50.'
    }
  }

  return errors
}

/* --------------------------------------------------------------------------
   Document-level validation (used by JSON import)
   -------------------------------------------------------------------------- */

const REQUIRED_OBJECT_KEYS = ['profile', 'home', 'settings', 'categories']

/**
 * Structurally validate an imported document.
 * Deliberately shape-only: it rejects files that would crash the app, and reports
 * every problem at once rather than failing on the first.
 *
 * @returns {{ok: boolean, problems: string[]}}
 */
export function validateDocument(doc) {
  const problems = []

  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
    return { ok: false, problems: ['The file must contain a single JSON object.'] }
  }

  if (typeof doc.schemaVersion !== 'number') {
    problems.push('Missing "schemaVersion" — this may not be an export from this site.')
  }

  for (const key of REQUIRED_OBJECT_KEYS) {
    if (!doc[key] || typeof doc[key] !== 'object') {
      problems.push(`Missing or invalid "${key}" object.`)
    }
  }

  for (const key of COLLECTION_KEYS) {
    if (!Array.isArray(doc[key])) {
      problems.push(`"${key}" must be an array.`)
    }
  }

  if (doc.categories && typeof doc.categories === 'object') {
    for (const key of ['project']) {
      if (!Array.isArray(doc.categories[key])) {
        problems.push(`"categories.${key}" must be an array.`)
      }
    }
  }

  // Duplicate ids silently break React keys and every lookup-by-id.
  for (const key of COLLECTION_KEYS) {
    if (!Array.isArray(doc[key])) continue
    const ids = doc[key].map((item) => item?.id).filter(Boolean)
    if (new Set(ids).size !== ids.length) {
      problems.push(`"${key}" contains duplicate ids.`)
    }
  }

  return { ok: problems.length === 0, problems }
}
