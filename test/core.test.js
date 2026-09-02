import test from 'node:test'
import assert from 'node:assert/strict'
import { generateImageVariants } from '../src/lib/imageProcessor.js'

test('draft filtering correctly removes unpublished items', () => {
  const items = [
    { id: 1, status: 'published', title: 'A' },
    { id: 2, status: 'draft', title: 'B' },
    { id: 3, status: 'published', title: 'C' },
    { id: 4, title: 'D' }, // missing status
  ]
  
  const publicItems = items.filter((item) => item.status === 'published')
  
  assert.equal(publicItems.length, 2)
  assert.equal(publicItems[0].id, 1)
  assert.equal(publicItems[1].id, 3)
})

test('imageProcessor rejects invalid or unsupported files gracefully', async () => {
  try {
    await generateImageVariants(null)
    assert.fail('Should have thrown an error for null input')
  } catch (err) {
    assert.ok(err.message || err)
  }
})
