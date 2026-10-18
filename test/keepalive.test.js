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

const SECRET = 'test-secret-token-xyz-123'
const ANON = 'test-anon-key-456'
const SUPABASE_ENV = { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: ANON }

/**
 * Runs `fn` with the given env vars (undefined deletes one), a stubbed fetch that answers
 * 200 and records its calls, and a captured console.warn. Everything is restored after.
 */
async function withStubs(env, fn) {
  const saved = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]))
  const realFetch = globalThis.fetch
  const realWarn = console.warn
  const fetchCalls = []
  const warnings = []
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  globalThis.fetch = async (url, init) => {
    fetchCalls.push({ url, init })
    return { ok: true, status: 200 }
  }
  console.warn = (message) => warnings.push(message)
  try {
    await fn({ fetchCalls, warnings })
  } finally {
    globalThis.fetch = realFetch
    console.warn = realWarn
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

async function call(headers = {}, method = 'GET') {
  const res = createMockRes()
  await handler({ method, headers }, res)
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

test('keepalive: the CRON_SECRET bearer token triggers the database ping', async () => {
  await withStubs({ ...SUPABASE_ENV, CRON_SECRET: SECRET }, async ({ fetchCalls }) => {
    const res = await call({ authorization: `Bearer ${SECRET}` })

    assert.equal(res._getStatus(), 200)
    assert.equal(res._getData().status, 'active')
    assert.equal(fetchCalls.length, 1)
    assert.match(fetchCalls[0].url, /^https:\/\/example\.supabase\.co\/rest\/v1\/site_content/)

    const head = await call({ authorization: `Bearer ${SECRET}` }, 'HEAD')
    assert.equal(head._getStatus(), 200)
    assert.equal(fetchCalls.length, 2)
  })
})

test('keepalive: requests without the CRON_SECRET only get the health check and never query the database', async () => {
  const impostors = {
    'no credentials': {},
    'public anon key as bearer': { authorization: `Bearer ${ANON}` },
    'x-vercel-cron header alone': { 'x-vercel-cron': '1' },
    'wrong secret, same length': { authorization: `Bearer ${SECRET.replace(/.$/, 'X')}` },
    'wrong secret, different length': { authorization: 'Bearer nope' },
    'secret without the Bearer prefix': { authorization: SECRET },
  }

  await withStubs({ ...SUPABASE_ENV, CRON_SECRET: SECRET }, async ({ fetchCalls }) => {
    for (const [name, headers] of Object.entries(impostors)) {
      const res = await call(headers)
      assert.equal(res._getStatus(), 200, name)
      assert.equal(res._getData().status, 'healthy', name)
      assert.equal(res._getData().ok, true, name)
    }

    const head = await call({}, 'HEAD')
    assert.equal(head._getStatus(), 200)
    assert.equal(head._isEnded(), true)

    assert.equal(fetchCalls.length, 0, 'no request may reach Supabase without the secret')
  })
})

test('keepalive: with CRON_SECRET unset nothing is authorized, whatever the headers say', async () => {
  await withStubs({ ...SUPABASE_ENV, CRON_SECRET: undefined }, async ({ fetchCalls }) => {
    for (const headers of [{}, { authorization: `Bearer ${ANON}` }, { authorization: 'Bearer undefined' }, { authorization: 'Bearer ' }, { 'x-vercel-cron': '1' }]) {
      const res = await call(headers)
      assert.equal(res._getData().status, 'healthy', JSON.stringify(headers))
    }
    assert.equal(fetchCalls.length, 0)
  })
})

test('keepalive: a rejected cron-style request logs a warning, an ordinary ping does not', async () => {
  await withStubs({ ...SUPABASE_ENV, CRON_SECRET: SECRET }, async ({ warnings }) => {
    await call({})
    assert.equal(warnings.length, 0)

    await call({ 'x-vercel-cron': '1' })
    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /CRON_SECRET/)

    await call({ 'x-vercel-cron': '1', authorization: `Bearer ${SECRET}` })
    assert.equal(warnings.length, 1, 'an authorized cron call must not warn')
  })
})

test('keepalive: returns 503 without leaking credentials if Supabase is unconfigured', async () => {
  const env = {
    CRON_SECRET: SECRET,
    VITE_SUPABASE_URL: undefined,
    VITE_SUPABASE_ANON_KEY: undefined,
    NEXT_PUBLIC_Backend_SUPABASE_URL: undefined,
    Backend_SUPABASE_URL: undefined,
    NEXT_PUBLIC_SUPABASE_URL: undefined,
    SUPABASE_URL: undefined,
    NEXT_PUBLIC_Backend_SUPABASE_ANON_KEY: undefined,
    NEXT_PUBLIC_Backend_SUPABASE_PUBLISHABLE_KEY: undefined,
    Backend_SUPABASE_ANON_KEY: undefined,
    Backend_SUPABASE_PUBLISHABLE_KEY: undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
    SUPABASE_ANON_KEY: undefined,
  }

  await withStubs(env, async ({ fetchCalls }) => {
    const res = await call({ authorization: `Bearer ${SECRET}` })

    assert.equal(res._getStatus(), 503)
    const data = res._getData()
    assert.equal(data.ok, false)
    assert.equal(data.message, 'Supabase credentials unconfigured')
    assert.ok(data.timestamp)
    // Ensure no sensitive env values are leaked in the output object
    assert.equal(data.key, undefined)
    assert.equal(data.url, undefined)
    assert.equal(data.anonKey, undefined)
    assert.equal(fetchCalls.length, 0)
  })
})
