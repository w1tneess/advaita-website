import test from 'node:test'
import assert from 'node:assert/strict'

import { createSeedDocument } from '../src/data/seed.js'
import { loadDocument, reconcileWithSeed, saveDocument } from '../src/lib/store.js'
import { fetchPublicContent } from '../src/lib/supabase/public.js'

const json = (status, body) => ({ ok: status < 400, status, json: async () => body })

function withSupabase(fetchImpl, run) {
  const saved = { url: process.env.VITE_SUPABASE_URL, key: process.env.VITE_SUPABASE_ANON_KEY, fetch: globalThis.fetch }
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_ANON_KEY = 'anon-key'
  globalThis.fetch = fetchImpl
  return run().finally(() => {
    if (saved.url === undefined) delete process.env.VITE_SUPABASE_URL
    else process.env.VITE_SUPABASE_URL = saved.url
    if (saved.key === undefined) delete process.env.VITE_SUPABASE_ANON_KEY
    else process.env.VITE_SUPABASE_ANON_KEY = saved.key
    globalThis.fetch = saved.fetch
  })
}

test('saveDocument refuses the public copy so drafts and history are never overwritten', async () => {
  const result = await saveDocument({ ...createSeedDocument(), publicCopy: true })
  assert.equal(result.ok, false)
  assert.match(result.error, /public copy/)
})

test('fetchPublicContent reads the public RPC', async () => {
  const calls = []
  await withSupabase(
    async (url) => {
      calls.push(url)
      return json(200, [{ data: { publicCopy: true }, updated_at: '2026-10-16T16:28:05Z' }])
    },
    async () => {
      const result = await fetchPublicContent({ retries: 1 })
      assert.deepEqual(result.data, { publicCopy: true })
      assert.equal(result.updatedAt, '2026-10-16T16:28:05Z')
    },
  )
  assert.equal(calls.length, 1)
  assert.match(calls[0], /\/rest\/v1\/rpc\/get_public_site_content$/)
})

test('fetchPublicContent never reads the raw table when the RPC fails', async () => {
  const calls = []
  await withSupabase(
    async (url) => {
      calls.push(url)
      return json(404, {})
    },
    async () => {
      const result = await fetchPublicContent({ retries: 1 })
      assert.equal(result.data, null)
      assert.match(result.error.message, /HTTP 404/)
    },
  )
  assert.equal(calls.length, 1)
  assert.match(calls[0], /\/rpc\/get_public_site_content$/)
})

test('loadDocument falls back to the bundled seed when Supabase is down', async () => {
  await withSupabase(
    async () => json(500, {}),
    async () => {
      const { doc, source } = await loadDocument()
      assert.equal(source, 'seed')
      assert.deepEqual(doc.projects, createSeedDocument().projects)
    },
  )
})

test('an older seedVersion never replaces live content with the bundled seed', () => {
  const live = { ...createSeedDocument(), seedVersion: 0, projects: [{ id: 'live-only', slug: 'live-only', title: 'Live project' }] }
  const result = reconcileWithSeed(live)
  assert.deepEqual(result.projects.map((project) => project.id), ['live-only'])
  assert.equal(result.seedVersion, 0)
})

test('loadDocument keeps a remote document with an old seedVersion as the remote source', async () => {
  const remote = { ...createSeedDocument(), seedVersion: 0, projects: [{ id: 'live-only', slug: 'live-only', title: 'Live project' }] }
  await withSupabase(
    async () => json(200, [{ data: remote, updated_at: null }]),
    async () => {
      const { doc, source } = await loadDocument()
      assert.equal(source, 'remote')
      assert.deepEqual(doc.projects.map((project) => project.id), ['live-only'])
    },
  )
})
