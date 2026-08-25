import { createSeedDocument } from '../src/data/seed.js'
import { buildPublishBundle } from '../src/lib/publish.js'

const result = buildPublishBundle(createSeedDocument())
if (!result.ok) {
  console.error('Content validation failed:')
  for (const problem of result.errors) console.error(`- ${problem}`)
  process.exitCode = 1
} else {
  console.log('Content validation passed.')
}
