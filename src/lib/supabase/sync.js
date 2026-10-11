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
    let timerId = null
    try {
      // 3.5-second timeout safeguard
      const fetchPromise = supabase
        .from('site_content')
        .select('data')
        .eq('id', 'main')
        .single()

      const timeoutPromise = new Promise((resolve) => {
        timerId = setTimeout(() => resolve({ timeout: true }), 3500)
      })

      const response = await Promise.race([fetchPromise, timeoutPromise])
      if (timerId) clearTimeout(timerId)

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
      if (timerId) clearTimeout(timerId)
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

  if (!contentDocument || typeof contentDocument !== 'object' || Array.isArray(contentDocument)) {
    return { ok: false, error: 'Cannot save invalid or empty content document.' }
  }

  // Pre-validate authenticated session to prevent sending unauthenticated mutations
  let currentEmail = ''
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        ok: false,
        isAuthError: true,
        error:
          'Admin session is inactive or expired. Please sign in to the studio to save changes to Supabase.',
      }
    }
    currentEmail = session.user?.email || ''
  } catch (authErr) {
    console.warn('Could not verify session prior to save:', authErr)
  }

  try {
    const { data, error } = await supabase
      .from('site_content')
      .upsert({
        id: 'main',
        data: contentDocument,
        updated_at: new Date().toISOString(),
      })
      .select('id, updated_at')

    if (error) {
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        return {
          ok: false,
          isAuthError: true,
          error: `Supabase RLS Policy check failed${currentEmail ? ` for ${currentEmail}` : ''}. Please apply the updated RLS policy from Database & Sync in your Supabase SQL Editor.`,
        }
      }
      throw error
    }

    // Guard against silent RLS authorization filtering
    if (!data || data.length === 0) {
      return {
        ok: false,
        error:
          'Supabase permission check: 0 rows modified. Please verify you are logged in to the admin studio with an authorized administrator account.',
      }
    }

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
    const { data, error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', 'main')
      .select('id')

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        ok: false,
        error:
          'Supabase permission check: 0 rows deleted. Please verify you are logged in to the admin studio with an authorized administrator account.',
      }
    }

    return { ok: true, error: null }
  } catch (error) {
    console.error('Error clearing content in Supabase:', error)
    return { ok: false, error: 'Failed to clear content in Supabase: ' + error.message }
  }
}

/**
 * Perform a real-time diagnostic health check on Supabase connection,
 * tables, and storage buckets.
 */
export async function checkSupabaseHealth() {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      configured: false,
      connected: false,
      latencyMs: 0,
      tables: { siteContent: false, contactSubmissions: false, imagesBucket: false },
      message: 'Supabase credentials missing or invalid in environment.',
    }
  }

  const startTime = performance.now()
  let siteContentOk = false
  let contactSubmissionsOk = false
  let imagesBucketOk = false
  let errorMessage = null

  try {
    // 1. Test site_content table
    const { error: contentErr } = await supabase
      .from('site_content')
      .select('id')
      .limit(1)
    if (!contentErr) {
      siteContentOk = true
    } else {
      errorMessage = contentErr.message
    }

    // 2. Test contact_submissions table
    const { error: contactErr } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1)
    if (!contactErr) {
      contactSubmissionsOk = true
    }

    // 3. Test storage bucket
    try {
      const { error: bucketErr } = await supabase.storage.from('images').list('', { limit: 1 })
      if (!bucketErr) {
        imagesBucketOk = true
      }
    } catch (_bErr) {
      imagesBucketOk = false
    }

    const latencyMs = Math.round(performance.now() - startTime)

    return {
      configured: true,
      connected: siteContentOk || contactSubmissionsOk,
      latencyMs,
      tables: {
        siteContent: siteContentOk,
        contactSubmissions: contactSubmissionsOk,
        imagesBucket: imagesBucketOk,
      },
      message: siteContentOk ? 'Supabase connection operational.' : errorMessage || 'Could not query site_content table.',
    }
  } catch (err) {
    return {
      configured: true,
      connected: false,
      latencyMs: Math.round(performance.now() - startTime),
      tables: { siteContent: false, contactSubmissions: false, imagesBucket: false },
      message: err.message || 'Network connection to Supabase failed.',
    }
  }
}

