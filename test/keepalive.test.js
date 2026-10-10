import test from 'node:test'
import assert from 'node:assert/strict'
import handler from '../api/keepalive.js'

function createMockRes() {
  const headers = {}
  let statusCode = 200
  let responseData = null
  let ended = false

  const res = {
    setHeader(key, value) {
      headers[key.toLowerCase()] = value
      return res
    },
    getHeader(key) {
      return headers[key.toLowerCase()]
    },
    status(code) {
      statusCode = code
      return res
    },
    json(data) {
      responseData = data
      ended = true
      return res
    },
    end() {
      ended = true
      return res
    },
    _getData: () => responseData,
    _getStatus: () => statusCode,
    _getHeaders: () => headers,
    _isEnded: () => ended,
  }

  return res
}

test('keepalive: sets strict anti-caching and security headers on every request', async () => {
  const req = { method: 'GET', headers: {} }
  const res = createMockRes()

  await handler(req, res)

  assert.equal(res.getHeader('cache-control'), 'no-store, no-cache, must-revalidate, proxy-revalidate')
  assert.equal(res.getHeader('pragma'), 'no-cache')
  assert.equal(res.getHeader('expires'), '0')
  assert.equal(res.getHeader('x-content-type-options'), 'nosniff')
})

test('keepalive: rejects unauthorized HTTP methods with 405 Method Not Allowed', async () => {
  for (const badMethod of ['POST', 'PUT', 'DELETE', 'PATCH']) {
    const req = { method: badMethod, headers: {} }
    const res = createMockRes()

    await handler(req, res)

    assert.equal(res._getStatus(), 405)
    assert.equal(res.getHeader('allow'), 'GET, HEAD')
    assert.deepEqual(res._getData(), {
      ok: false,
      message: 'Method not allowed',
    })
  }
})

test('keepalive: handles public health checks and authorized keepalive triggers when CRON_SECRET is configured', async () => {
  const originalSecret = process.env.CRON_SECRET
  const originalAnon = process.env.VITE_SUPABASE_ANON_KEY
  process.env.CRON_SECRET = 'test-secret-token-xyz-123'
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key-456'

  try {
    // 1. Unauthenticated public ping (uptime monitors, health checks):
    // Returns 200 OK lightweight status without querying database
    const reqPublic = { method: 'GET', headers: {} }
    const resPublic = createMockRes()
    await handler(reqPublic, resPublic)
    assert.equal(resPublic._getStatus(), 200)
    assert.deepEqual(resPublic._getData()?.status, 'healthy')
    assert.equal(resPublic._getData()?.ok, true)

    // 2. HEAD method on public health check
    const reqHead = { method: 'HEAD', headers: {} }
    const resHead = createMockRes()
    await handler(reqHead, resHead)
    assert.equal(resHead._getStatus(), 200)
    assert.equal(resHead._isEnded(), true)

    // 3. Trusted Vercel Cron header (triggers keepalive execution)
    const reqVercelCron = {
      method: 'GET',
      headers: { 'x-vercel-cron': '1' },
    }
    const resVercelCron = createMockRes()
    await handler(reqVercelCron, resVercelCron)
    // Passes authorization, attempts DB fetch or returns 503 if mock unconfigured
    assert.notEqual(resVercelCron._getData()?.status, 'healthy')

    // 4. Valid CRON_SECRET Bearer token (triggers keepalive execution)
    const reqCronSecret = {
      method: 'GET',
      headers: { authorization: 'Bearer test-secret-token-xyz-123' },
    }
    const resCronSecret = createMockRes()
    await handler(reqCronSecret, resCronSecret)
    assert.notEqual(resCronSecret._getData()?.status, 'healthy')

    // 5. Valid anon key Bearer token from CI (triggers keepalive execution)
    const reqAnonKey = {
      method: 'GET',
      headers: { authorization: 'Bearer test-anon-key-456' },
    }
    const resAnonKey = createMockRes()
    await handler(reqAnonKey, resAnonKey)
    assert.notEqual(resAnonKey._getData()?.status, 'healthy')
  } finally {
    if (originalSecret !== undefined) {
      process.env.CRON_SECRET = originalSecret
    } else {
      delete process.env.CRON_SECRET
    }
    if (originalAnon !== undefined) {
      process.env.VITE_SUPABASE_ANON_KEY = originalAnon
    } else {
      delete process.env.VITE_SUPABASE_ANON_KEY
    }
  }
})

test('keepalive: returns 503 without leaking credentials if Supabase is unconfigured', async () => {
  const origUrl = process.env.VITE_SUPABASE_URL
  const origKey = process.env.VITE_SUPABASE_ANON_KEY
  delete process.env.VITE_SUPABASE_URL
  delete process.env.VITE_SUPABASE_ANON_KEY

  try {
    const req = { method: 'GET', headers: {} }
    const res = createMockRes()

    await handler(req, res)

    assert.equal(res._getStatus(), 503)
    const data = res._getData()
    assert.equal(data.ok, false)
    assert.equal(data.message, 'Supabase credentials unconfigured')
    assert.ok(data.timestamp)
    // Ensure no sensitive env values are leaked in the output object
    assert.equal(data.key, undefined)
    assert.equal(data.url, undefined)
    assert.equal(data.anonKey, undefined)
  } finally {
    if (origUrl !== undefined) process.env.VITE_SUPABASE_URL = origUrl
    if (origKey !== undefined) process.env.VITE_SUPABASE_ANON_KEY = origKey
  }
})
