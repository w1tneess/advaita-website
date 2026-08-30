import { supabase } from './client.js'

/**
 * Fetch the entire site content document from Supabase.
 * We store everything in a single row with id = 'main'.
 */
export async function fetchContentFromSupabase() {
  if (!supabase) return null

  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('data')
      .eq('id', 'main')
      .single()

    if (error) {
      // PGRST116 means no rows returned, which is fine if we haven't saved anything yet.
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Supabase fetch error:', error)
      throw error
    }

    return data.data
  } catch (error) {
    console.error('Error fetching content from Supabase:', error)
    return null
  }
}

/**
 * Save the entire site content document to Supabase.
 * Replaces the 'main' row.
 */
export async function saveContentToSupabase(contentDocument) {
  if (!supabase) return { ok: false, error: 'Supabase client not initialized.' }

  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({
        id: 'main',
        data: contentDocument,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    return { ok: true, error: null }
  } catch (error) {
    console.error('Error saving content to Supabase:', error)
    return { ok: false, error: 'Failed to save to Supabase: ' + error.message }
  }
}

/**
 * Discard Supabase content (used by the 'Reset' feature).
 */
export async function clearContentInSupabase() {
  if (!supabase) return { ok: false, error: 'Supabase client not initialized.' }

  try {
    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', 'main')

    if (error) throw error
    return { ok: true, error: null }
  } catch (error) {
    console.error('Error clearing content in Supabase:', error)
    return { ok: false, error: 'Failed to clear content in Supabase: ' + error.message }
  }
}
