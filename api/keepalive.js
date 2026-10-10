/**
 * Vercel Serverless Function: Supabase PostgreSQL Keepalive & Health Ping
 *
 * Prevents Supabase project inactivity pause (free tier pauses after 7 days without queries).
 * Invoked automatically by Vercel Cron (schedule defined in vercel.json) and GitHub Actions.
 *
 * Security & Zero-Leak Guarantees:
 * - Only GET and HEAD methods permitted.
 * - If CRON_SECRET is set in environment, enforces Bearer token or Vercel Cron header validation.
 * - Never leaks upstream Supabase response bodies, schema errors, or environment keys.
 * - Sets strict no-cache headers to prevent proxy/CDN memoization.
 * - Employs an explicit AbortSignal timeout to prevent hung executions.
 */

export default async function handler(req, res) {
  // 1. Set anti-caching & security headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // 2. Enforce allowed HTTP methods
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).json({
      ok: false,
      message: 'Method not allowed',
    })
  }

  // 3. Verify CRON_SECRET if configured (standard Vercel recommendation for securing cron jobs)
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const authHeader = req.headers?.authorization || ''
    const isVercelCronHeader = req.headers?.['x-vercel-cron'] === '1'
    const isBearerValid = authHeader === `Bearer ${cronSecret}`

    if (!isBearerValid && !isVercelCronHeader) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized',
      })
    }
  }

  // 4. Resolve Supabase credentials (prioritize VITE_ prefix, then Vercel integration aliases)
  const rawUrl =
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_Backend_SUPABASE_URL ||
    process.env.Backend_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL

  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_Backend_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_Backend_SUPABASE_PUBLISHABLE_KEY ||
    process.env.Backend_SUPABASE_ANON_KEY ||
    process.env.Backend_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY

  if (!rawUrl || !anonKey || rawUrl.includes('placeholder')) {
    return res.status(503).json({
      ok: false,
      message: 'Supabase credentials unconfigured',
      timestamp: new Date().toISOString(),
    })
  }

  // Sanitize base URL (remove trailing slashes)
  const supabaseUrl = rawUrl.replace(/\/+$/, '')

  try {
    // 5. Query public site_content table with explicit 8-second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const targetUrl = `${supabaseUrl}/rest/v1/site_content?select=id,updated_at&limit=1`
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Handle HEAD requests immediately without JSON body
    if (req.method === 'HEAD') {
      return res.status(response.ok ? 200 : response.status).end()
    }

    if (response.ok) {
      return res.status(200).json({
        ok: true,
        message: 'Supabase PostgreSQL database pinged successfully.',
        timestamp: new Date().toISOString(),
        status: 'active',
      })
    }

    // Zero-leak fallback: log sanitized status code without exposing raw response data
    return res.status(response.status >= 500 ? 502 : response.status).json({
      ok: false,
      message: 'Upstream database responded with non-200 status',
      timestamp: new Date().toISOString(),
      status: 'upstream_error',
    })
  } catch (error) {
    // If client requested HEAD, return 500 without body
    if (req.method === 'HEAD') {
      return res.status(500).end()
    }

    // Zero-leak: never expose stack traces, connection strings, or error.message in JSON
    const isTimeout = error?.name === 'AbortError'
    return res.status(isTimeout ? 504 : 500).json({
      ok: false,
      message: isTimeout ? 'Gateway timeout connecting to database' : 'Keepalive check failed',
      timestamp: new Date().toISOString(),
      status: 'error',
    })
  }
}
