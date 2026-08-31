import { supabase } from './client.js'

export async function submitContactForm({ name, email, topic, message }) {
  if (!supabase) throw new Error('Supabase client not initialized')

  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name,
      email,
      topic,
      message,
    })

  if (error) throw error
  return true
}

export async function uploadImage(file, path) {
  if (!supabase) throw new Error('Supabase client not initialized')

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
