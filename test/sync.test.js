import test from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSeedDocument } from '../src/data/seed.js'

const script = fileURLToPath(new URL('../scripts/sync-seed-to-supabase.js', import.meta.url))

const seed = createSeedDocument()
const liveRow = {
  data: { ...seed, blog: [{ id: 'post-1', status: 'published' }], adminOnlyKey: 'edited in /admin' },
  updated_at: '2026-01-01T00:00:00Z',
}

/** A local stand-in for PostgREST that records every request it receives. */
async function withMock({ failRead = false } = {}, fn) {
  const requests = []
  const server = http.createServer((req, res) => {
    req.resume()
    req.on('end', () => {
      requests.push(req.method)
      res.setHeader('Content-Type', 'application/json')
      if (req.method === 'GET') {
        res.statusCode = failRead ? 500 : 200
        return res.end(JSON.stringify(failRead ? { message: 'boom' } : [liveRow]))
      }
      res.statusCode = 201
      res.end(JSON.stringify([{ id: 'main', updated_at: 'now' }]))
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  try {
    return await fn(`http://127.0.0.1:${server.address().port}`, requests)
  } finally {
    server.close()
  }
}

function run(url, args = []) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'sync-test-'))
  // Drop every real Supabase variable so the script can only ever reach the mock.
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/supabase/i.test(key)))
  Object.assign(env, {
    SUPABASE_URL: url,
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    SYNC_BACKUP_DIR: path.join(cwd, 'backups'),
  })
  return new Promise((resolve) => {
    execFile(process.execPath, [script, ...args], { cwd, env }, (error, stdout, stderr) =>
      resolve({ code: error ? error.code : 0, output: stdout + stderr, backups: path.join(cwd, 'backups') }),
    )
  })
}

test('sync: without --yes it summarises the diff and writes nothing', async () => {
  await withMock({}, async (url, requests) => {
    const { code, output, backups } = await run(url)
    assert.equal(code, 0)
    assert.match(output, /blog: 1 -> 0 items/)
    assert.match(output, /adminOnlyKey: only in live, would be DELETED/)
    assert.match(output, /Re-run with --yes/)
    assert.deepEqual(requests, ['GET'])
    assert.equal(fs.existsSync(backups), false)
  })
})

test('sync: --yes backs up the live document, then overwrites it', async () => {
  await withMock({}, async (url, requests) => {
    const { code, backups } = await run(url, ['--yes'])
    assert.equal(code, 0)
    assert.deepEqual(requests, ['GET', 'POST'])
    const [file] = fs.readdirSync(backups)
    assert.match(file, /^site_content-main-\d{4}-\d{2}-\d{2}T[\d-]+Z\.json$/)
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(backups, file), 'utf8')), liveRow)
  })
})

test('sync: a failed read aborts before any write, even with --yes', async () => {
  await withMock({ failRead: true }, async (url, requests) => {
    const { code, output, backups } = await run(url, ['--yes'])
    assert.equal(code, 1)
    assert.match(output, /cannot be backed up/)
    assert.deepEqual(requests, ['GET'])
    assert.equal(fs.existsSync(backups), false)
  })
})

test('sync: refuses a password on the command line and does not echo it', async () => {
  await withMock({}, async (url, requests) => {
    const { code, output } = await run(url, ['admin@example.com', 'hunter2-password'])
    assert.equal(code, 1)
    assert.match(output, /only --yes is accepted/)
    assert.doesNotMatch(output, /hunter2-password/)
    assert.deepEqual(requests, [])
  })
})
