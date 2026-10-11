/**
 * Automated Supabase Data Sync Utility
 *
 * Synchronizes the local codebase seed document (src/data/seed.js) into
 * the Supabase PostgreSQL `site_content` table with complete schema validation
 * and security precautions.
 *
 * Usage:
 *   1. With Service Role Key (e.g. CI or maintenance):
 *      SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/sync-seed-to-supabase.js
 *
 *   2. With Admin Auth Credentials:
 *      node scripts/sync-seed-to-supabase.js admin@example.com my_password
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { createSeedDocument } from '../src/data/seed.js'
import { validateDocument } from '../src/lib/schema.js'

dotenv.config()
dotenv.config({ path: '.env.local' })

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

if (!supabaseUrl || (!serviceRoleKey && !anonKey)) {
  console.error('Error: Supabase URL and API Key must be configured in environment.')
  process.exit(1)
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

  console.log(`Document validated successfully (Seed Version: ${doc.seedVersion}, Schema Version: ${doc.schemaVersion})`)
  console.log(`- Projects: ${doc.projects?.length || 0}`)
  console.log(`- Philosophy Notes: ${doc.philosophy?.notes?.length || 0}`)
  console.log(`- Blog Posts: ${doc.blog?.length || 0}`)

  let client

  if (serviceRoleKey) {
    console.log('Authenticating via SUPABASE_SERVICE_ROLE_KEY...')
    client = createClient(supabaseUrl, serviceRoleKey)
  } else {
    client = createClient(supabaseUrl, anonKey)
    const email = process.argv[2]
    const password = process.argv[3]

    if (email && password) {
      console.log(`Authenticating via user credentials for ${email}...`)
      const { data, error } = await client.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('Authentication error:', error.message)
        process.exit(1)
      }
      console.log('Successfully authenticated as:', data.user?.email)
    } else {
      console.log('Attempting sync with current credentials...')
    }
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
    console.warn(
      '\nNotice: 0 rows modified. Row Level Security (RLS) prevented anonymous write.\n' +
      'To update Supabase directly from CLI, either:\n' +
      '  1. Provide admin credentials: node scripts/sync-seed-to-supabase.js <admin_email> <password>\n' +
      '  2. Set SUPABASE_SERVICE_ROLE_KEY in environment\n' +
      '  3. Or log into the Studio at /admin and click "Manual Cloud Sync" in Data Manager.'
    )
    return
  }

  console.log('\nSUCCESS! Site content synchronized to Supabase.')
  console.log('Updated row:', data[0])
}

main().catch((err) => {
  console.error('Unexpected error:', err.message)
  process.exit(1)
})
