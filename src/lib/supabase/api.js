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
  if (cleanEmail && cleanEmail !== 'reader@local') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address.')
    }
  }

  const { error } = await supabase.from('contact_submissions').insert({
    name: cleanName || 'Anonymous',
    email: cleanEmail || 'unspecified@local',
    topic: cleanTopic,
    message: cleanMessage,
  })

  if (error) throw error
  return true
}

export async function uploadImage(file, path) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Unable to upload images.')
  }

  const { data, error } = await supabase.storage.from('images').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(path)

  return { storagePath: data.path, publicUrl }
}

export async function removeImage(path) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Unable to remove image.')
  }

  const { error } = await supabase.storage.from('images').remove([path])
  if (error) throw error
  return true
}
