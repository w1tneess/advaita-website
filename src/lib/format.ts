/**
 * Formatting helpers: dates, reading time, and text utilities.
 * Strictly typed with TypeScript.
 */

const WORDS_PER_MINUTE = 200

export interface ArticleBlock {
  type?: 'list' | 'quote' | 'callout' | 'image' | 'code' | string
  text?: string
  title?: string
  attribution?: string
  caption?: string
  items?: string[]
}

export interface ReadablePost {
  excerpt?: string
  content?: string
  body?: ArticleBlock[]
}

/** "2026-08-23" -> "23 August 2026". Handles both date strings and full ISO timestamps. */
export function formatDate(iso?: string | null): string {
  if (!iso) return ''
  const str = String(iso).includes('T') ? String(iso) : `${iso}T00:00:00`
  const date = new Date(str)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** "2026-08-23" -> "23 Aug 2026". */
export function formatDateShort(iso?: string | null): string {
  if (!iso) return ''
  const str = String(iso).includes('T') ? String(iso) : `${iso}T00:00:00`
  const date = new Date(str)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Machine-readable value for <time dateTime>. */
export function isoDateAttr(iso?: string | null): string | undefined {
  return /^\d{4}-\d{2}-\d{2}/.test(String(iso || '')) ? String(iso).slice(0, 10) : undefined
}

/** Extract the readable text from one article body block. */
export function blockPlainText(block: ArticleBlock = {}): string {
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

export function wordCount(text: string = ''): number {
  const trimmed = String(text).trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

/**
 * Estimated reading time in whole minutes, minimum 1.
 * Deliberately an estimate — supports markdown content string, body blocks, and excerpt.
 */
export function readingMinutes(post: ReadablePost = {}): number {
  let count = wordCount(post.excerpt)
  if (typeof post.content === 'string') {
    count += wordCount(post.content)
  }
  if (Array.isArray(post.body)) {
    count += post.body.reduce((total, block) => total + wordCount(blockPlainText(block)), 0)
  }
  return Math.max(1, Math.round(count / WORDS_PER_MINUTE))
}

export function pluralize(count: number, singular: string, plural: string = `${singular}s`): string {
  return count === 1 ? singular : plural
}

/** Sort a copy of a collection by its `order` field, falling back to array position. */
export function byOrder<T extends { order?: number }>(collection: T[] = []): T[] {
  return [...collection].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

/**
 * Newest first comparator and array sorter.
 */
export function byNewest<T extends Record<string, any>>(
  itemsOrField: T[] | string = [],
  maybeField: string | T = 'published_at',
): any {
  // Comparator factory: byNewest('published_at')
  if (typeof itemsOrField === 'string') {
    const field = itemsOrField
    return (a: T, b: T) => {
      const left = a?.[field] || a?.published_at || a?.publishedAt || a?.date || ''
      const right = b?.[field] || b?.published_at || b?.publishedAt || b?.date || ''
      return String(right).localeCompare(String(left))
    }
  }

  // Direct comparator: items.sort(byNewest)
  if (
    itemsOrField &&
    typeof itemsOrField === 'object' &&
    !Array.isArray(itemsOrField) &&
    maybeField &&
    typeof maybeField === 'object' &&
    !Array.isArray(maybeField)
  ) {
    const a = itemsOrField as T
    const b = maybeField as T
    const left = a.published_at || a.publishedAt || a.date || ''
    const right = b.published_at || b.publishedAt || b.date || ''
    return String(right).localeCompare(String(left))
  }

  // Array transform: byNewest(items, field)
  const items = Array.isArray(itemsOrField) ? itemsOrField : []
  const field = typeof maybeField === 'string' ? maybeField : 'published_at'
  return [...items].sort((a, b) => {
    const left = a?.[field] || a?.published_at || a?.publishedAt || a?.date || ''
    const right = b?.[field] || b?.published_at || b?.publishedAt || b?.date || ''
    return String(right).localeCompare(String(left))
  })
}

/** Case-insensitive "does this record match the search text" across given fields. */
export function matchesQuery(record: Record<string, any>, query?: string, fields: string[] = []): boolean {
  const needle = String(query || '')
    .trim()
    .toLowerCase()
  if (!needle) return true
  return fields.some((field) => {
    const value = field.split('.').reduce((acc, key) => acc?.[key], record)
    if (Array.isArray(value)) return value.join(' ').toLowerCase().includes(needle)
    return String(value ?? '')
      .toLowerCase()
      .includes(needle)
  })
}

/** Truncate on a word boundary, adding an ellipsis only when text was removed. */
export function truncate(text: string = '', max: number = 160): string {
  const value = String(text).trim()
  if (value.length <= max) return value
  const lastSpace = value.lastIndexOf(' ', max)
  const cutIndex = lastSpace > 0 ? lastSpace : max
  return `${value.slice(0, cutIndex).trimEnd()}…`
}
