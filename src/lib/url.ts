/**
 * Safe URL validation and sanitization utilities.
 * Protects against Cross-Site Scripting (XSS), javascript: pseudo-protocols,
 * DOM text injection, and malicious URI schemes across links, images, and user input.
 */

const SAFE_LINK_SCHEMES = ['https:', 'http:', 'mailto:', 'tel:']
const SAFE_IMAGE_SCHEMES = ['https:', 'http:', 'blob:']

/**
 * Checks whether a given string is a safe link URL (http, https, relative root path, anchor, mailto, tel).
 */
export function isSafeUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false

  // Allow root-relative paths or same-page anchors
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    // Disallow protocol-relative URLs like '//evil.com'
    return !trimmed.startsWith('//')
  }

  try {
    const parsed = new URL(trimmed, 'https://localhost')
    return SAFE_LINK_SCHEMES.includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Checks whether a given string is a safe image URL (http, https, root-relative, blob:, data:image/...).
 */
export function isSafeImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false

  // Allow root-relative image paths
  if (trimmed.startsWith('/')) {
    return !trimmed.startsWith('//')
  }

  // Safe data URIs for images only
  if (trimmed.startsWith('data:image/')) {
    return true
  }

  // blob: URLs
  if (trimmed.startsWith('blob:')) {
    return true
  }

  try {
    const parsed = new URL(trimmed, 'https://localhost')
    return SAFE_IMAGE_SCHEMES.includes(parsed.protocol)
  } catch {
    return false
  }
}

/**
 * Sanitizes a URL for use in href attributes. Returns fallback if unsafe.
 */
export function sanitizeUrl(url?: string | null, fallback = '#'): string {
  if (!url || typeof url !== 'string') return fallback
  const trimmed = url.trim()
  return isSafeUrl(trimmed) ? trimmed : fallback
}

/**
 * Sanitizes an image URL for use in img src attributes. Returns fallback if unsafe.
 */
export function sanitizeImageUrl(url?: string | null, fallback = ''): string {
  if (!url || typeof url !== 'string') return fallback
  const trimmed = url.trim()
  if (!isSafeImageUrl(trimmed)) return fallback

  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return encodeURI(trimmed)
  }

  if (trimmed.startsWith('/')) {
    return encodeURI(trimmed)
  }

  try {
    const parsed = new URL(trimmed)
    if (SAFE_IMAGE_SCHEMES.includes(parsed.protocol)) {
      return parsed.href
    }
    return fallback
  } catch {
    return fallback
  }
}
