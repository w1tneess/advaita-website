/**
 * Read-only RLS check with the public anon key: tries to read, write and delete on every
 * table, RPC and storage bucket the site uses, and reports PASS/FAIL per attempt.
 *
 *   npm run security:rls [-- extra_table ...]
 *
 * Nothing is ever written. Inserts and updates carry a NULL in a NOT NULL column, so if
 * RLS wrongly allowed them they still fail on the constraint (PostgreSQL checks RLS
 * first). Updates and deletes also send `Prefer: handling=strict, max-affected=0`, so
 * PostgREST rolls back any statement that would touch a row. Storage uploads only
 * request a signed upload URL, which needs the same INSERT permission and is never used.
 * Storage deletes have no dry run and are not attempted. No accounts are created and
 * the key is never printed.
 */

import dotenv from 'dotenv'

import { createSeedDocument } from '../src/data/seed.js'
import { supabaseConfig } from '../src/lib/supabase/config.js'

dotenv.config({ quiet: true })
dotenv.config({ path: '.env.local', quiet: true })

const { url, anonKey, configured } = supabaseConfig()
if (!configured) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (in .env.local) first.')
  process.exit(2)
}

// Each table with a filter matching every row and a NOT NULL column to null out.
const TABLES = {
  site_content: { all: 'id=not.is.null', nullColumn: 'data' },
  contact_submissions: { all: 'id=not.is.null', nullColumn: 'name' },
  admin_users: { all: 'user_id=not.is.null', nullColumn: 'user_id' },
}
for (const name of process.argv.slice(2)) TABLES[name] ??= { all: 'id=not.is.null', nullColumn: 'id' }

const SAFE_WRITE = 'return=minimal, handling=strict, max-affected=0'
const results = []

async function call(path, { method = 'GET', body, prefer, headers = {} } = {}) {
  const response = await fetch(`${url}${path}`, {
    method,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await response.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    // Non-JSON body (e.g. empty 204).
  }
  const code = json?.code ?? json?.error ?? json?.statusCode ?? ''
  const message = String(json?.message ?? json?.msg ?? text).replaceAll(anonKey, '<anon key>').slice(0, 110)
  return { status: response.status, code: String(code), message, json }
}

function record(target, attempt, pass, detail) {
  results.push({ target, attempt, result: pass === null ? 'SKIP' : pass ? 'PASS' : 'FAIL', detail })
}

const denied = (r) => r.status === 401 || r.status === 403 || r.code === '42501'
// Storage wraps RLS failures in 400/403 bodies; anything else (e.g. a malformed request) is inconclusive.
const storageDenied = (r) => r.status === 403 || /row-level security|unauthorized/i.test(r.message)
const missing = (r) => r.status === 404 || ['42P01', 'PGRST205', 'PGRST202'].includes(r.code)

// Does this PostgREST honour max-affected? An unknown preference with handling=strict errors (PGRST122).
const support = await call('/rest/v1/site_content?id=eq.__rls_check_no_such_row__', { method: 'DELETE', prefer: SAFE_WRITE })
const canProbeDeletes = support.code !== 'PGRST122'

for (const [table, { all, nullColumn }] of Object.entries(TABLES)) {
  let r = await call(`/rest/v1/${table}?select=*&limit=1`)
  if (missing(r)) {
    record(table, 'exists', null, `not found (${r.status} ${r.code}); not probed`)
    continue
  }
  const rows = Array.isArray(r.json) ? r.json.length : 0
  record(table, 'select', denied(r) || (r.status === 200 && rows === 0), denied(r) ? `denied (${r.status})` : `${r.status}, ${rows} row(s) visible`)

  r = await call(`/rest/v1/${table}`, { method: 'POST', body: { [nullColumn]: null }, prefer: 'return=minimal' })
  record(table, 'insert', denied(r), denied(r) ? `denied (${r.code || r.status})` : `RLS let it through, stopped only by: ${r.code} ${r.message}`)

  r = await call(`/rest/v1/${table}?${all}`, { method: 'PATCH', body: { [nullColumn]: null }, prefer: canProbeDeletes ? SAFE_WRITE : 'return=minimal' })
  const updatedNothing = r.status === 204 || r.status === 200
  record(table, 'update', denied(r) || updatedNothing, denied(r) ? `denied (${r.code || r.status})` : updatedNothing ? '0 rows affected' : `rows were writable (rolled back): ${r.code} ${r.message}`)

  if (canProbeDeletes) {
    r = await call(`/rest/v1/${table}?${all}`, { method: 'DELETE', prefer: SAFE_WRITE })
    const deletedNothing = r.status === 204 || r.status === 200
    record(table, 'delete', denied(r) || deletedNothing, denied(r) ? `denied (${r.code || r.status})` : deletedNothing ? '0 rows affected' : `rows were deletable (rolled back): ${r.code} ${r.message}`)
  } else {
    record(table, 'delete', null, 'server ignores max-affected; no safe way to probe')
  }
}

// RPCs: helpers must be closed to anon; the public copy must be open and clean.
for (const fn of ['is_admin', 'enforce_contact_rate_limit']) {
  const r = await call(`/rest/v1/rpc/${fn}`, { method: 'POST', body: {} })
  record(`rpc ${fn}`, 'execute', denied(r) || missing(r), denied(r) ? `denied (${r.code || r.status})` : missing(r) ? 'not exposed' : `callable: ${r.status}`)
}
{
  const r = await call('/rest/v1/rpc/get_public_site_content')
  if (missing(r)) {
    record('rpc get_public_site_content', 'execute', false, 'not deployed: run supabase/public_content.sql')
  } else {
    const doc = r.json?.[0]?.data
    // The seed's keys are the intended public document; the function adds only publicCopy.
    const known = createSeedDocument()
    const extraKeys = doc ? Object.keys(doc).filter((key) => !(key in known) && key !== 'publicCopy') : []
    const leaks = !doc
      ? ['no document']
      : [
          (doc.activity ?? []).length > 0 && 'activity log',
          (doc.blog ?? []).some((p) => p.status !== 'published') && 'draft posts',
          (doc.philosophy?.notes ?? []).some((n) => n.status !== 'published') && 'draft notes',
          (doc.projects ?? []).some((p) => p.published !== true) && 'unpublished projects',
          (doc.social ?? []).some((s) => s.visible !== true) && 'hidden social links',
          extraKeys.length > 0 && `unlisted keys (${extraKeys.join(', ')})`,
        ].filter(Boolean)
    record('rpc get_public_site_content', 'read', leaks.length === 0, leaks.length ? `exposes: ${leaks.join(', ')}` : 'public copy only')
  }
}

// Storage.
const buckets = await call('/storage/v1/bucket')
const bucketNames = new Set(['images', ...(Array.isArray(buckets.json) ? buckets.json.map((b) => b.id) : [])])
for (const bucket of bucketNames) {
  let r = await call(`/storage/v1/object/list/${bucket}`, { method: 'POST', body: { prefix: '', limit: 5 } })
  const listed = Array.isArray(r.json) ? r.json.length : 0
  const existing = listed ? r.json[0].name : null
  record(`storage ${bucket}`, 'list', denied(r) || listed === 0, listed ? `${listed}+ object name(s) listable` : `nothing listable (${r.status})`)

  const probePath = `rls-check-${Date.now()}.txt`
  r = await call(`/storage/v1/object/upload/sign/${bucket}/${probePath}`, { method: 'POST', body: {} })
  record(`storage ${bucket}`, 'upload', storageDenied(r), storageDenied(r) ? `denied (${r.status} ${r.message})` : r.status < 300 ? 'signed upload URL issued: anon can upload (URL not used)' : `inconclusive: ${r.status} ${r.message}`)

  if (existing) {
    r = await call(`/storage/v1/object/upload/sign/${bucket}/${existing}`, { method: 'POST', body: {}, headers: { 'x-upsert': 'true' } })
    record(`storage ${bucket}`, 'overwrite', storageDenied(r), storageDenied(r) ? `denied (${r.status} ${r.message})` : r.status < 300 ? 'signed overwrite URL issued: anon can replace files (URL not used)' : `inconclusive: ${r.status} ${r.message}`)
  } else {
    record(`storage ${bucket}`, 'overwrite', null, 'no listable object to target; covered by the policy review')
  }
  record(`storage ${bucket}`, 'delete', null, 'no dry run for storage deletes; covered by the policy review')
}

const width = Math.max(...results.map((r) => r.target.length))
for (const r of results) console.log(`${r.result}  ${r.target.padEnd(width)}  ${r.attempt.padEnd(9)}  ${r.detail}`)
const failed = results.filter((r) => r.result === 'FAIL').length
console.log(`\n${results.filter((r) => r.result === 'PASS').length} passed, ${failed} failed, ${results.filter((r) => r.result === 'SKIP').length} skipped`)
process.exit(failed ? 1 : 0)
