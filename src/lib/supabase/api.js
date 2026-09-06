import { supabase, isSupabaseConfigured } from './client.js'

export async function submitContactForm({ name, email, topic, message }) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Unable to submit contact form.')
  }

  const { error } = await supabase.from('contact_submissions').insert({
    name,
    email,
    topic,
    message,
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
