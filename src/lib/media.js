const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
])

export function safeAssetFilename(name, type = '') {
  const extension = IMAGE_TYPES.get(type) || String(name).split('.').pop()?.toLowerCase()
  const stem = String(name)
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return `${stem || 'image'}.${IMAGE_TYPES.has(type) ? IMAGE_TYPES.get(type) : extension || 'bin'}`
}

export function validateImageFile(file) {
  if (!file || !IMAGE_TYPES.has(file.type))
    return { ok: false, error: 'Choose a PNG, JPEG, WebP, GIF, or AVIF image.' }
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'Images must be 5 MB or smaller.' }
  return { ok: true, filename: safeAssetFilename(file.name, file.type), error: null }
}

export function assetPath(filename) {
  return `/assets/${filename}`
}
