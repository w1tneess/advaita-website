import { supabaseConfig } from './config.js'

/** Saving the visitor copy would erase drafts and the activity log from the real row. */
export const PUBLIC_COPY_SAVE_ERROR =
  'This is the public copy of the site, without drafts or history. Reload the admin panel to load the full document before editing.'

async function getJson(path, signal) {
  const { url, anonKey } = supabaseConfig()
  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal,
  })
  if (!response.ok) throw new Error(`Supabase responded with HTTP ${response.status}`)
  return response.json()
}

/**
 * The visitor's copy of the site document. Drafts, hidden items and the admin activity
 * log are removed server-side by get_public_site_content() (supabase/public_content.sql).
 * Plain fetch, so public pages never load @supabase/supabase-js.
 *
 * @returns {Promise<{data: object|null, updatedAt: string|null, error: Error|null}>}
 */
export async function fetchPublicContent({ retries = 2, timeoutMs = 3500 } = {}) {
  if (!supabaseConfig().configured) {
    return { data: null, updatedAt: null, error: new Error('Supabase is not configured.') }
  }

  for (let attempt = 1; ; attempt += 1) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const rows = await getJson('rpc/get_public_site_content', controller.signal)
      return { data: rows?.[0]?.data ?? null, updatedAt: rows?.[0]?.updated_at ?? null, error: null }
    } catch (error) {
      if (attempt >= retries) return { data: null, updatedAt: null, error }
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    } finally {
      clearTimeout(timer)
    }
  }
}
