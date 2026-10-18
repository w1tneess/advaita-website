import { createClient } from '@supabase/supabase-js'

import { supabaseConfig } from './config.js'

export { isSupabaseConfigured } from './config.js'

const { url, anonKey, configured, debug } = supabaseConfig()

if (!configured && debug) {
  console.info('Supabase credentials unconfigured. Local storage fallback active.')
}

export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
