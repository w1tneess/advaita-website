/**
 * Formatting helpers: dates, reading time, and small text utilities.
 */

const WORDS_PER_MINUTE = 200

/** "2026-08-23" -> "23 August 2026". Returns '' for missing or unparseable input. */
export function formatDate(iso) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** "2026-08-23" -> "23 Aug 2026". */
export function formatDateShort(iso) {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Machine-readable value for <time dateTime>. */
export function isoDateAttr(iso) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(iso || '')) ? iso : undefined
}

/** Extract the readable text from one article body block. */
export function blockPlainText(block = {}) {
  switch (block.type) {
    case 'list':
      return (block.items || []).join(' ')
    case 'quote':
      return [block.text, block.attribution].filter(Boolean).join(' ')
    case 'callout':
      return [block.title, block.text].filter(Boolean).join(' ')
    case 'image':
      return block.caption || ''
    case 'code':
      return '' // Code is skipped: it is not read at prose speed.
    default:
      return block.text || ''
  }
}

export function wordCount(text = '') {
  const trimmed = String(text).trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

/**
 * Estimated reading time in whole minutes, minimum 1.
 * Deliberately an estimate — labelled as such wherever it is displayed.
 */
export function readingMinutes(post = {}) {
  const words = (post.body || []).reduce(
    (total, block) => total + wordCount(blockPlainText(block)),
    wordCount(post.excerpt),
  )
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}

/** Sort a copy of a collection by its `order` field, falling back to array position. */
export function byOrder(collection = []) {
  return [...collection].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

/** Newest first, by updatedAt then publishedAt. */
export function byNewest(posts = []) {
  return [...posts].sort((a, b) => {
    const left = a.publishedAt || ''
    const right = b.publishedAt || ''
    return right.localeCompare(left)
  })
}

/** Case-insensitive "does this record match the search text" across given fields. */
export function matchesQuery(record, query, fields = []) {
  const needle = String(query || '').trim().toLowerCase()
  if (!needle) return true
  return fields.some((field) => {
    const value = field.split('.').reduce((acc, key) => acc?.[key], record)
    if (Array.isArray(value)) return value.join(' ').toLowerCase().includes(needle)
    return String(value ?? '').toLowerCase().includes(needle)
  })
}

/** Truncate on a word boundary, adding an ellipsis only when text was removed. */
export function truncate(text = '', max = 160) {
  const value = String(text).trim()
  if (value.length <= max) return value
  return `${value.slice(0, value.lastIndexOf(' ', max)).trimEnd()}…`
}
