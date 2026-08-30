import { supabase } from './client.js'

export async function submitContactForm({ name, email, topic, message }) {
  if (!supabase) throw new Error('Supabase client not initialized')
    
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({
      name,
      email,
      topic,
      message,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
