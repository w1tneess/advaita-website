import { createSeedDocument } from '../src/data/seed.js'
import { validateDocument } from '../src/lib/schema.js'

const result = validateDocument(createSeedDocument())
if (!result.ok) {
  console.error('Content validation failed:')
  for (const problem of result.problems) console.error(`- ${problem}`)
  process.exitCode = 1
} else {
  console.log('Content validation passed.')
}
