import imageCompression from 'browser-image-compression'

export const IMAGE_VARIANTS = [400, 800, 1600]

/**
 * Resizes and compresses an uploaded image file into multiple variants.
 * @param {File} file 
 * @returns {Promise<{ original: File|Blob, variants: Record<number, File|Blob> }>}
 */
export async function generateImageVariants(file) {
  const optionsBase = {
    useWebWorker: true,
    alwaysKeepResolution: false,
  }

  // Compress original lightly (max 3000px width/height, max 5MB)
  const original = await imageCompression(file, {
    ...optionsBase,
    maxSizeMB: 5,
    maxWidthOrHeight: 3000, 
  })

  const variants = {}
  
  // Generate each responsive variant
  await Promise.all(IMAGE_VARIANTS.map(async (width) => {
    try {
      const variant = await imageCompression(file, {
        ...optionsBase,
        // Proportional max file size limits based on dimensions
        maxSizeMB: width < 800 ? 0.3 : (width <= 1200 ? 0.8 : 1.5),
        maxWidthOrHeight: width,
      })
      variants[width] = variant
    } catch (e) {
      console.warn(`Failed to generate variant for width ${width}`, e)
    }
  }))

  return {
    original,
    variants
  }
}
