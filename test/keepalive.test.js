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

test('keepalive: enforces CRON_SECRET authorization when configured', async () => {
  const originalSecret = process.env.CRON_SECRET
  process.env.CRON_SECRET = 'test-secret-token-xyz-123'

  try {
    // Missing token
    const reqMissing = { method: 'GET', headers: {} }
    const resMissing = createMockRes()
    await handler(reqMissing, resMissing)
    assert.equal(resMissing._getStatus(), 401)
    assert.equal(resMissing._getData()?.message, 'Unauthorized')

    // Invalid token
    const reqInvalid = {
      method: 'GET',
      headers: { authorization: 'Bearer wrong-token' },
    }
    const resInvalid = createMockRes()
    await handler(reqInvalid, resInvalid)
    assert.equal(resInvalid._getStatus(), 401)
    assert.equal(resInvalid._getData()?.message, 'Unauthorized')

    // Trusted Vercel Cron header
    const reqVercelCron = {
      method: 'GET',
      headers: { 'x-vercel-cron': '1' },
    }
    const resVercelCron = createMockRes()
    await handler(reqVercelCron, resVercelCron)
    // Should bypass auth check and reach credentials check (503 if mock unconfigured or 200/upstream)
    assert.notEqual(resVercelCron._getStatus(), 401)

    // Valid Bearer token
    const reqValid = {
      method: 'GET',
      headers: { authorization: 'Bearer test-secret-token-xyz-123' },
    }
    const resValid = createMockRes()
    await handler(reqValid, resValid)
    assert.notEqual(resValid._getStatus(), 401)
  } finally {
    if (originalSecret !== undefined) {
      process.env.CRON_SECRET = originalSecret
    } else {
      delete process.env.CRON_SECRET
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
