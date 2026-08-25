import test from 'node:test'
import assert from 'node:assert/strict'

import { createSeedDocument } from '../src/data/seed.js'
import { buildPublishBundle } from '../src/lib/publish.js'
import { slugify, validateDocument } from '../src/lib/schema.js'
import { safeAssetFilename, validateImageFile } from '../src/lib/media.js'

 test('seed content passes document validation', () => {
  const result = validateDocument(createSeedDocument())
  assert.equal(result.ok, true, result.problems.join('\n'))
})

test('slugify creates stable URL-safe slugs', () => {
  assert.equal(slugify('Research: India & Data!'), 'research-india-data')
})

test('publish bundle reports changed source files', () => {
  const document = createSeedDocument()
  document.home.heroHeading = 'Updated heading'
  const result = buildPublishBundle(document)
  assert.equal(result.ok, true)
  assert.deepEqual(result.bundle.modified, ['src/data/home.json'])
  assert.match(result.bundle.files[0].content, /Updated heading/)
})

test('publish bundle rejects malformed content', () => {
  const document = createSeedDocument()
  document.posts = [{ id: 'bad', slug: 'Bad Slug' }]
  const result = buildPublishBundle(document)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((problem) => problem.includes('posts[0].slug')))
})

test('asset names are safe and image limits are enforced', () => {
  assert.equal(safeAssetFilename('../Hero Image.PNG', 'image/png'), 'hero-image.png')
  assert.equal(validateImageFile({ name: 'x.svg', type: 'image/svg+xml', size: 10 }).ok, false)
  assert.equal(validateImageFile({ name: 'x.png', type: 'image/png', size: 5 * 1024 * 1024 + 1 }).ok, false)
})
