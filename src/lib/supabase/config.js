/**
 * Supabase connection settings, kept free of @supabase/supabase-js so public pages can
 * read content with plain fetch. Read on each call (not at import) so the Node pre-render
 * sees variables that dotenv loads after its imports.
 */
export function supabaseConfig() {
  const env =
    (typeof import.meta !== 'undefined' && import.meta.env) ||
    (typeof process !== 'undefined' && process.env) ||
    {}

  // Standard Vite names first, then the prefixes added by the Vercel Supabase integration.
  const url =
    env.VITE_SUPABASE_URL ||
    env.NEXT_PUBLIC_Backend_SUPABASE_URL ||
    env.Backend_SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    env.SUPABASE_URL ||
    ''

  // Public anon key only — never a service_role or secret key.
  const anonKey =
    env.VITE_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_Backend_SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_Backend_SUPABASE_PUBLISHABLE_KEY ||
    env.Backend_SUPABASE_ANON_KEY ||
    env.Backend_SUPABASE_PUBLISHABLE_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    env.SUPABASE_ANON_KEY ||
    ''

  const configured = Boolean(url && anonKey && !url.includes('placeholder') && url.startsWith('http'))
  return { url: url.replace(/\/+$/, ''), anonKey, configured, debug: env.VITE_SUPABASE_DEBUG === 'true' || Boolean(env.DEV) }
}

export function isSupabaseConfigured() {
  return supabaseConfig().configured
}
