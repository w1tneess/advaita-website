import { supabase, isSupabaseConfigured } from './client.js'

/**
 * Fetch the entire site content document from Supabase.
 * We store everything in a single row with id = 'main'.
 * Includes a timeout safeguard to prevent hanging the app on slow/failed network calls.
 */
export async function fetchContentFromSupabase(retries = 3) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, error: new Error('Supabase client not configured. Check your environment variables.') }
  }

  let attempt = 0
  while (attempt < retries) {
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
        throw new Error('Supabase fetch timed out')
      }

      const { data, error } = response

      if (error) {
        // PGRST116 means no rows returned, which is fine if we haven't saved anything yet.
        if (error.code === 'PGRST116') {
          return { data: null, error: null }
        }
        throw error
      }

      return { data: data?.data || null, error: null }
    } catch (error) {
      attempt++
      if (attempt >= retries) {
        // Pass back whether it was a timeout or auth/network issue
        const isTimeout = error.message === 'Supabase fetch timed out'
        const isAuth = error.code === '401' || error.code === '403' || error.message?.includes('JWT')
        error.isTimeout = isTimeout
        error.isAuth = isAuth
        return { data: null, error }
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
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
