/**
 * Utility for optimizing images.
 */

/**
 * Returns optimized image properties including `src` and `srcSet`
 * based on pre-generated image variants stored alongside the original.
 * Falls back to just `src` if no variants exist (backward compatibility).
 *
 * @param {string} url - The original base image URL (e.g., https://.../image.jpg)
 * @param {number[]} variants - Array of widths available (e.g., [400, 800, 1600])
 * @returns {{ src: string, srcSet?: string }} Props to spread onto an <img> tag
 */
export function getOptimizedImageProps(url, variants = []) {
  if (!url) return { src: '' }

  if (variants && variants.length > 0) {
    const lastDotIdx = url.lastIndexOf('.')
    if (lastDotIdx !== -1) {
      const base = url.substring(0, lastDotIdx)
      const ext = url.substring(lastDotIdx)
      
      const srcSet = variants
        .map((w) => `${base}-${w}w${ext} ${w}w`)
        .join(', ')

      return {
        src: url, // Fallback original URL
        srcSet,
      }
    }
  }

  // Return as-is if no variants available
  return { src: url }
}
