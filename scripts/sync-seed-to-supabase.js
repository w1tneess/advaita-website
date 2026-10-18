/**
 * Supabase Seed Sync Utility
 *
 * Overwrites the whole `site_content` row ('main') with the bundled seed
 * (src/data/seed.js). Everything edited in /admin that is not in the seed is replaced, so:
 *
 *   - By default it only compares the live document with the seed and prints a summary.
 *   - With --yes it first saves the live document to backups/ (gitignored, mode 0600),
 *     then overwrites it.
 *
 * Authentication (one of):
 *   1. SUPABASE_SERVICE_ROLE_KEY=<key> npm run content:sync [-- --yes]
 *   2. SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD in the environment, or leave either
 *      unset to be prompted (the password prompt is hidden). Passwords are never accepted
 *      as command-line arguments: they would end up in shell history and process lists.
 *
 * Optional: SYNC_BACKUP_DIR overrides the backup folder (default ./backups).
 */

import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { Writable } from 'node:stream'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { createSeedDocument } from '../src/data/seed.js'
import { validateDocument } from '../src/lib/schema.js'

dotenv.config({ quiet: true })
dotenv.config({ path: '.env.local', quiet: true })

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

const args = process.argv.slice(2)
const confirmed = args.includes('--yes')
if (args.some((arg) => arg !== '--yes')) {
  // Deliberately does not echo the arguments: an old-style call put a password in them.
  console.error(
    'Error: only --yes is accepted. Passwords can no longer be passed on the command line;\n' +
      'set SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD or answer the prompts.',
  )
  process.exit(1)
}

if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
  console.error('Error: Supabase URL and API Key must be configured in environment.')
  process.exit(1)
}

/** Reads one line from the terminal; `hidden` suppresses the echo of what is typed. */
function prompt(question, { hidden = false } = {}) {
  if (!process.stdin.isTTY) {
    console.error(`Error: no terminal to ask "${question.trim()}". Set the matching environment variable instead.`)
    process.exit(1)
  }
  return new Promise((resolve) => {
    let muted = false
    const output = new Writable({
      write(chunk, encoding, done) {
        if (!muted) process.stdout.write(chunk, encoding)
        done()
      },
    })
    const rl = readline.createInterface({ input: process.stdin, output, terminal: true })
    rl.question(question, (answer) => {
      rl.close()
      if (hidden) process.stdout.write('\n')
      resolve(answer.trim())
    })
    muted = hidden
  })
}

const stable = (value) =>
  JSON.stringify(value, (_, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1)))
      : v,
  )

/** One line per top-level key whose value differs between the live document and the seed. */
function summarizeDiff(live, seed) {
  const lines = []
  for (const key of new Set([...Object.keys(live), ...Object.keys(seed)])) {
    if (stable(live[key]) === stable(seed[key])) continue
    if (!(key in seed)) {
      lines.push(`${key}: only in live, would be DELETED`)
    } else if (!(key in live)) {
      lines.push(`${key}: only in seed, would be added`)
    } else if (Array.isArray(live[key]) && Array.isArray(seed[key])) {
      const seedIds = new Set(seed[key].map((item) => item?.id))
      const liveIds = new Set(live[key].map((item) => item?.id))
      const removed = live[key].filter((item) => !seedIds.has(item?.id)).length
      const added = seed[key].filter((item) => !liveIds.has(item?.id)).length
      lines.push(`${key}: ${live[key].length} -> ${seed[key].length} items (${removed} removed, ${added} added, others overwritten)`)
    } else {
      lines.push(`${key}: differs, live value would be overwritten`)
    }
  }
  return lines
}

async function authenticate() {
  if (serviceRoleKey) {
    console.log('Authenticating via SUPABASE_SERVICE_ROLE_KEY...')
    return createClient(supabaseUrl, serviceRoleKey)
  }

  const client = createClient(supabaseUrl, anonKey)
  const email = process.env.SUPABASE_ADMIN_EMAIL || (await prompt('Admin email: '))
  const password = process.env.SUPABASE_ADMIN_PASSWORD || (await prompt('Admin password: ', { hidden: true }))
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error) {
    console.error('Authentication error:', error.message)
    process.exit(1)
  }
  console.log('Successfully authenticated as:', data.user?.email)
  return client
}

async function main() {
  console.log('--- Supabase Sync Utility ---')
  console.log('Target URL:', supabaseUrl)

  const doc = createSeedDocument()
  const { ok: isValid, problems } = validateDocument(doc)

  if (!isValid) {
    console.error('Error: Seed document failed schema validation:', problems)
    process.exit(1)
  }

  console.log(`Seed validated (Seed Version: ${doc.seedVersion}, Schema Version: ${doc.schemaVersion})`)

  const client = await authenticate()

  // Admin and service-role reads see the row; a plain visitor cannot, so a failed or empty
  // read for someone allowed to write is a genuinely missing row.
  const { data: rows, error: readError } = await client
    .from('site_content')
    .select('data, updated_at')
    .eq('id', 'main')
  if (readError) {
    console.error('Could not read the live document, so it cannot be backed up. Nothing changed:', readError.message)
    process.exit(1)
  }
  const live = rows?.[0] ?? null

  if (live) {
    const lines = summarizeDiff(live.data ?? {}, doc)
    console.log(`\nLive document (updated ${live.updated_at}) vs seed:`)
    console.log(lines.length ? lines.map((line) => `  - ${line}`).join('\n') : '  identical, nothing to change')
  } else {
    console.log('\nNo live document yet; this would create it.')
  }

  if (!confirmed) {
    console.log('\nDry run: nothing was written. Re-run with --yes to back up the live document and overwrite it.')
    return
  }

  if (live) {
    const backupDir = path.resolve(process.env.SYNC_BACKUP_DIR || 'backups')
    fs.mkdirSync(backupDir, { recursive: true })
    const file = path.join(backupDir, `site_content-main-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
    fs.writeFileSync(file, JSON.stringify(live, null, 2), { mode: 0o600 })
    console.log(`\nBacked up the live document to ${file}`)
  }

  const { data, error } = await client
    .from('site_content')
    .upsert({
      id: 'main',
      data: doc,
      updated_at: new Date().toISOString(),
    })
    .select('id, updated_at')

  if (error) {
    console.error('Supabase update failed:', error.message)
    process.exit(1)
  }

  if (!data || data.length === 0) {
    console.error(
      '\nError: 0 rows modified. Row Level Security (RLS) blocked the write, so this account is not an admin.\n' +
        'Use SUPABASE_SERVICE_ROLE_KEY, an admin account in public.admin_users, or the\n' +
        '"Manual Cloud Sync" button in Data Manager at /admin.',
    )
    process.exit(1)
  }

  console.log('\nSUCCESS! Site content synchronized to Supabase.')
  console.log('Updated row:', data[0])
}

main().catch((err) => {
  console.error('Unexpected error:', err.message)
  process.exit(1)
})
