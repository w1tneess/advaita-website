/**
 * Utility for optimizing and sanitizing images.
 */

/**
 * Sanitize an image URL to prevent script injection or invalid protocols.
 * @param {string} url
 * @returns {string}
 */
export function sanitizeImageUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (/^javascript:/i.test(trimmed)) return ''
  if (/^data:(?!image\/)/i.test(trimmed)) return ''
  return trimmed
}

/**
 * Returns optimized image properties including `src` and `srcSet`
 * based on pre-generated image variants stored alongside the original.
 * Falls back to just `src` if no variants exist (backward compatibility).
 * Correctly preserves URL queries and hashes.
 *
 * @param {string} url - The original base image URL (e.g., https://.../image.jpg)
 * @param {number[]} variants - Array of widths available (e.g., [400, 800, 1600])
 * @returns {{ src: string, srcSet?: string }} Props to spread onto an <img> tag
 */
export function getOptimizedImageProps(url, variants = []) {
  const safeUrl = sanitizeImageUrl(url)
  if (!safeUrl) return { src: '' }

  if (variants && Array.isArray(variants) && variants.length > 0) {
    try {
      const [withoutQuery, queryString] = safeUrl.split('?')
      const [path, hash] = withoutQuery.split('#')
      const queryPart = queryString ? `?${queryString}` : ''
      const hashPart = hash ? `#${hash}` : ''

      const lastDotIdx = path.lastIndexOf('.')
      if (lastDotIdx !== -1 && lastDotIdx > path.lastIndexOf('/')) {
        const base = path.substring(0, lastDotIdx)
        const ext = path.substring(lastDotIdx)

        const srcSet = variants
          .map((w) => `${base}-${w}w${ext}${queryPart}${hashPart} ${w}w`)
          .join(', ')

        return {
          src: safeUrl,
          srcSet,
        }
      }
    } catch {
      // Fallback to safeUrl on parsing anomaly
    }
  }

  // Return as-is if no variants available
  return { src: safeUrl }
}

