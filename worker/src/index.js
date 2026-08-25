const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }
const MAX_BODY_BYTES = 1024 * 1024
const SESSION_DAYS = 7

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  })
}

function error(message, status = 400) {
  return json({ ok: false, error: message }, status)
}

function corsHeaders(request, env) {
  const origin = request.headers.get('origin')
  const allowed = env.FRONTEND_ORIGIN || origin
  return origin && allowed && origin === allowed
    ? { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', vary: 'origin' }
    : {}
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers)
  for (const [key, value] of Object.entries(corsHeaders(request, env))) headers.set(key, value)
  return new Response(response.body, { status: response.status, headers })
}

async function sha256(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function cookieValue(request, name) {
  return request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) || null
}

async function requireSession(request, env) {
  const token = cookieValue(request, 'advaita_session')
  if (!token) return null
  const tokenHash = await sha256(token)
  const row = await env.DB.prepare('SELECT id, expires_at FROM admin_sessions WHERE token_hash = ? AND expires_at > ?').bind(tokenHash, new Date().toISOString()).first()
  return row || null
}

async function readJson(request) {
  const length = Number(request.headers.get('content-length') || 0)
  if (length > MAX_BODY_BYTES) throw new Error('Request body is too large.')
  return request.json()
}

async function login(request, env) {
  const body = await readJson(request)
  if (typeof body?.password !== 'string' || body.password.length < 8) return error('A valid password is required.', 401)
  const configured = (env.ADMIN_PASSWORD_HASH || '').split(':')
  if (configured.length !== 3) return error('Admin authentication is not configured.', 503)
  const [salt, iterationsText, expected] = configured
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(body.password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: Number(iterationsText), hash: 'SHA-256' }, key, 256)
  const actual = [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  if (actual !== expected) return error('That password is not correct.', 401)
  const token = crypto.randomUUID() + crypto.randomUUID()
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString()
  await env.DB.prepare('INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, ?)').bind(await sha256(token), expires).run()
  return json({ ok: true }, 200, { 'set-cookie': `advaita_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${SESSION_DAYS * 86400}` })
}

async function content(request, env, session) {
  if (request.method === 'GET') {
    const row = await env.DB.prepare('SELECT document FROM content_documents WHERE id = 1').first()
    return row ? json({ ok: true, document: JSON.parse(row.document) }) : json({ ok: true, document: null })
  }
  if (!session) return error('Authentication required.', 401)
  if (!['PUT', 'PATCH'].includes(request.method)) return error('Method not allowed.', 405)
  const document = await readJson(request)
  if (!document || typeof document !== 'object' || !Array.isArray(document.projects) || !Array.isArray(document.posts)) return error('Invalid content document.')
  await env.DB.prepare('INSERT INTO content_documents (id, document, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET document = excluded.document, updated_at = excluded.updated_at').bind(JSON.stringify(document), new Date().toISOString()).run()
  return json({ ok: true, document })
}

async function messages(request, env, session) {
  if (request.method === 'POST') {
    const body = await readJson(request)
    if (!body || typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.message !== 'string' || body.message.length > 10000) return error('Name, email, and a message are required.')
    await env.DB.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)').bind(body.name.trim().slice(0, 120), body.email.trim().slice(0, 320), body.message.trim()).run()
    return json({ ok: true }, 201)
  }
  if (!session) return error('Authentication required.', 401)
  if (request.method === 'GET') return json({ ok: true, messages: (await env.DB.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 100').all()).results })
  return error('Method not allowed.', 405)
}

async function media(request, env, session) {
  if (!env.MEDIA) return error('Media storage is not enabled yet.', 503)
  const key = decodeURIComponent(new URL(request.url).pathname.replace('/api/media/', ''))
  if (request.method === 'GET') {
    const object = await env.MEDIA?.get(key)
    return object ? new Response(object.body, { headers: { 'content-type': object.httpMetadata?.contentType || 'application/octet-stream', 'cache-control': 'public, max-age=31536000, immutable' } }) : error('Media not found.', 404)
  }
  if (!session) return error('Authentication required.', 401)
  if (request.method === 'DELETE') { await env.MEDIA?.delete(key); return json({ ok: true }) }
  if (request.method === 'PUT') {
    const type = request.headers.get('content-type') || ''
    if (!/^image\/(png|jpeg|webp|gif|avif)$/.test(type)) return error('Only supported image uploads are allowed.')
    const length = Number(request.headers.get('content-length') || 0)
    if (length > 10 * 1024 * 1024) return error('Images must be 10 MB or smaller.')
    await env.MEDIA?.put(key, request.body, { httpMetadata: { contentType: type } })
    return json({ ok: true, key }, 201)
  }
  return error('Method not allowed.', 405)
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url)
      if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204, headers: { 'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '86400' } }), request, env)
      if (!url.pathname.startsWith('/api/')) return error('Not found.', 404)
      let result
      if (url.pathname === '/api/auth/login' && request.method === 'POST') result = await login(request, env)
      else if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
        const token = cookieValue(request, 'advaita_session')
        if (token) await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await sha256(token)).run()
        result = json({ ok: true }, 200, { 'set-cookie': 'advaita_session=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0' })
      } else {
        const session = await requireSession(request, env)
        if (url.pathname === '/api/auth/session') result = json({ ok: true, authenticated: Boolean(session) })
        else if (url.pathname === '/api/content') result = await content(request, env, session)
        else if (url.pathname === '/api/messages') result = await messages(request, env, session)
        else if (url.pathname.startsWith('/api/media/')) result = await media(request, env, session)
        else result = error('Not found.', 404)
      }
      return withCors(result, request, env)
    } catch (caught) {
      return withCors(error(caught instanceof Error ? caught.message : 'Request failed.', 500), request, env)
    }
  },
}