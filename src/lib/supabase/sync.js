import { supabase, isSupabaseConfigured } from './client.js'

/**
 * Fetch the entire site content document from Supabase.
 * We store everything in a single row with id = 'main'.
 * Includes a timeout safeguard to prevent hanging the app on slow/failed network calls.
 */
export async function fetchContentFromSupabase() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error('Supabase client not initialized') }
  }

  try {
    // 3.5-second timeout safeguard
    const fetchPromise = supabase
      .from('site_content')
      .select('data')
      .eq('id', 'main')
      .single()

    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve({ timeout: true }), 3500),
    )

    const response = await Promise.race([fetchPromise, timeoutPromise])

    if (response?.timeout) {
      return { data: null, error: new Error('Supabase fetch timed out') }
    }

    const { data, error } = response

    if (error) {
      // PGRST116 means no rows returned, which is fine if we haven't saved anything yet.
      if (error.code === 'PGRST116') {
        return { data: null, error: null }
      }
      return { data: null, error }
    }

    return { data: data?.data || null, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

/**
 * Save the entire site content document to Supabase.
 * Replaces the 'main' row.
 */
export async function saveContentToSupabase(contentDocument) {
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false, error: 'Supabase client not initialized or unconfigured.' }
  }

  try {
    const { error } = await supabase.from('site_content').upsert({
      id: 'main',
      data: contentDocument,
      updated_at: new Date().toISOString(),
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
  if (!isSupabaseConfigured() || !supabase) {
    return { ok: false, error: 'Supabase client not initialized or unconfigured.' }
  }

  try {
    const { error } = await supabase.from('site_content').delete().eq('id', 'main')

    if (error) throw error
    return { ok: true, error: null }
  } catch (error) {
    console.error('Error clearing content in Supabase:', error)
    return { ok: false, error: 'Failed to clear content in Supabase: ' + error.message }
  }
}
