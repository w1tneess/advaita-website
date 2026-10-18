import { supabase, isSupabaseConfigured } from './client.js'

export async function submitContactForm({ name, email, topic, message }) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Unable to submit contact form.')
  }

  const cleanName = String(name || '').trim().slice(0, 100)
  const cleanEmail = String(email || '').trim().slice(0, 120)
  const cleanTopic = String(topic || 'General').trim().slice(0, 60)
  const cleanMessage = String(message || '').trim()

  if (!cleanMessage) {
    throw new Error('Message is required.')
  }
  if (cleanMessage.length > 3000) {
    throw new Error('Message exceeds the maximum allowed length of 3000 characters.')
  }
  if (cleanEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address.')
    }
  }

  const { error } = await supabase.from('contact_submissions').insert({
    name: cleanName || 'Anonymous',
    email: cleanEmail, // '' when the sender left it blank (allowed by the RLS policy)
    topic: cleanTopic,
    message: cleanMessage,
  })

  if (error) throw error
  return true
}

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
])

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024 // 15 MB

export async function uploadImage(file, path) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Unable to upload images.')
  }

  if (!file) {
    throw new Error('No file provided for upload.')
  }

  if (file.size && file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('File exceeds the maximum allowed size of 15MB.')
  }

  if (file.type && !ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())) {
    throw new Error(
      `Unsupported file type (${file.type}). Allowed formats: JPEG, PNG, WebP, AVIF, GIF, SVG.`
    )
  }

  // Sanitize path against directory traversal
  const cleanPath = String(path || '')
    .replace(/\.\.+/g, '') // remove ..
    .replace(/^\/+/, '') // remove leading slashes
    .trim()

  if (!cleanPath) {
    throw new Error('Invalid upload destination path.')
  }

  const { data, error } = await supabase.storage.from('images').upload(cleanPath, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(cleanPath)

  return { storagePath: data.path, publicUrl }
}

export async function removeImage(path) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Unable to remove image.')
  }

  const cleanPath = String(path || '')
    .replace(/\.\.+/g, '')
    .replace(/^\/+/, '')
    .trim()

  if (!cleanPath) {
    throw new Error('Invalid image path for deletion.')
  }

  const { error } = await supabase.storage.from('images').remove([cleanPath])
  if (error) throw error
  return true
}
