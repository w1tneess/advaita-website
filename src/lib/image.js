/**
 * Utility for optimizing images.
 */

/**
 * Returns optimized image properties including `src` and `srcSet`
 * if the provided URL is a standard Supabase public storage URL.
 * Falls back to just `src` if it's not recognizable.
 *
 * @param {string} url - The original image URL
 * @returns {{ src: string, srcSet?: string }} Props to spread onto an <img> tag
 */
export function getOptimizedImageProps(url) {
  if (!url) return { src: '' }

  // Check if it's a Supabase storage URL:
  // e.g. https://[project].supabase.co/storage/v1/object/public/[bucket]/[file]
  if (url.includes('/storage/v1/object/public/')) {
    // Convert to the image transformation endpoint
    const baseUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')

    // Generate standard widths for responsive design
    const widths = [400, 800, 1200, 1600, 2000]
    const srcSet = widths.map((w) => `${baseUrl}?width=${w} ${w}w`).join(', ')

    return {
      src: url, // Fallback original URL
      srcSet,
    }
  }

  // Return as-is if not a Supabase URL
  return { src: url }
}
