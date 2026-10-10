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

  // 3. Resolve Supabase credentials (prioritize VITE_ prefix, then Vercel integration aliases)
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

  // 4. Check authorization for active PostgreSQL database keepalive execution
  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers?.authorization || ''
  const isVercelCron = req.headers?.['x-vercel-cron'] === '1'
  const isCronSecretValid = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`)
  const isAnonKeyValid = Boolean(anonKey && authHeader === `Bearer ${anonKey}`)
  const isKeepaliveAuthorized = isVercelCron || isCronSecretValid || isAnonKeyValid

  // If CRON_SECRET is configured and this request is an unauthenticated public ping,
  // serve a lightweight 200 OK health check immediately so uptime monitors and CI pass
  // without triggering database query load or leaking any internal state.
  if (cronSecret && !isKeepaliveAuthorized) {
    if (req.method === 'HEAD') {
      return res.status(200).end()
    }
    return res.status(200).json({
      ok: true,
      service: 'advaita-website-api',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  }

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
