import { createClient } from '@supabase/supabase-js'

const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : typeof process !== 'undefined' && process.env
      ? process.env
      : {}

// Resolve Supabase project URL from standard Vite env or Vercel integration prefixes
const supabaseUrl =
  env.VITE_SUPABASE_URL ||
  env.NEXT_PUBLIC_Backend_SUPABASE_URL ||
  env.Backend_SUPABASE_URL ||
  env.NEXT_PUBLIC_SUPABASE_URL ||
  ''

// Resolve Supabase public anon key (never expose service_role or SECRET_KEY to frontend code)
const supabaseAnonKey =
  env.VITE_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_Backend_SUPABASE_ANON_KEY ||
  env.NEXT_PUBLIC_Backend_SUPABASE_PUBLISHABLE_KEY ||
  env.Backend_SUPABASE_ANON_KEY ||
  env.Backend_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

if (
  (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) &&
  (env.VITE_SUPABASE_DEBUG === 'true' || env.DEV)
) {
  console.info(
    'Supabase credentials unconfigured. Local storage fallback active.',
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
)

/**
 * Helper to check if Supabase is properly configured
 */
export function isSupabaseConfigured() {
  return !!(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    supabaseUrl.startsWith('http')
  )
}
