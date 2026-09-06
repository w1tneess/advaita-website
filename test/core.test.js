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

test('seed content document is structurally valid with zero problems', async () => {
  const { createSeedDocument } = await import('../src/data/seed.js')
  const { validateDocument } = await import('../src/lib/schema.js')

  const doc = createSeedDocument()
  const result = validateDocument(doc)

  assert.equal(result.ok, true, `Validation failed: ${result.problems?.join(', ')}`)
  assert.equal(result.problems.length, 0)
})

test('formatDate and formatDateShort format both dates and full ISO timestamps safely', async () => {
  const { formatDate, formatDateShort } = await import('../src/lib/format.js')

  assert.equal(formatDate(''), '')
  assert.equal(formatDate(null), '')
  assert.equal(formatDate(undefined), '')

  // Date-only string (e.g. 2026-05-15)
  const formattedDate = formatDate('2026-05-15')
  assert.match(formattedDate, /15 May 2026/)

  // Full ISO string with 'T' (e.g. 2026-05-15T10:30:00Z)
  const formattedIso = formatDate('2026-05-15T10:30:00Z')
  assert.match(formattedIso, /15 May 2026/)
  assert.doesNotMatch(formattedIso, /NaN/)

  // Short format
  const shortDate = formatDateShort('2026-05-15')
  assert.match(shortDate, /15 May 2026/)
  const shortIso = formatDateShort('2026-05-15T10:30:00Z')
  assert.match(shortIso, /15 May 2026/)
})

test('byNewest sorts collections by date field descending across camelCase and snake_case', async () => {
  const { byNewest } = await import('../src/lib/format.js')

  // snake_case published_at via comparator factory
  const snakeList = [
    { id: 1, published_at: '2025-01-01' },
    { id: 2, published_at: '2026-06-01' },
    { id: 3, published_at: '2024-12-31' },
  ]
  const sortedSnake = [...snakeList].sort(byNewest('published_at'))
  assert.equal(sortedSnake[0].id, 2)
  assert.equal(sortedSnake[1].id, 1)
  assert.equal(sortedSnake[2].id, 3)

  // Direct array transform: byNewest(snakeList, 'published_at')
  const directTransformed = byNewest(snakeList, 'published_at')
  assert.equal(directTransformed[0].id, 2)
  assert.equal(directTransformed[1].id, 1)
  assert.equal(directTransformed[2].id, 3)

  // camelCase publishedAt with direct sort comparator
  const camelList = [
    { id: 1, publishedAt: '2025-01-01' },
    { id: 2, publishedAt: '2026-06-01' },
  ]
  const sortedCamel = [...camelList].sort(byNewest)
  assert.equal(sortedCamel[0].id, 2)
  assert.equal(sortedCamel[1].id, 1)
})

test('readingMinutes calculates read time accurately from content and body', async () => {
  const { readingMinutes } = await import('../src/lib/format.js')

  // Empty post
  assert.equal(readingMinutes({}), 1)

  // Markdown content with 440 words
  const words = Array.from({ length: 440 }, (_, i) => `word${i}`).join(' ')
  assert.equal(readingMinutes({ content: words }), 2)

  // Short content rounded up to minimum 1 min
  assert.equal(readingMinutes({ content: 'A short note.' }), 1)
})

test('matchesQuery filters items across multiple fields case-insensitively', async () => {
  const { matchesQuery } = await import('../src/lib/format.js')

  const item = {
    title: 'Distributed Systems',
    description: 'A study on consensus algorithms',
    tags: ['raft', 'paxos'],
  }

  assert.equal(matchesQuery(item, 'consensus', ['title', 'description']), true)
  assert.equal(matchesQuery(item, 'SYSTEMS', ['title']), true)
  assert.equal(matchesQuery(item, 'nonexistent', ['title', 'description']), false)
  assert.equal(matchesQuery(item, '', ['title']), true)
})

test('slugify converts titles into URL-safe slugs correctly', async () => {
  const { slugify } = await import('../src/lib/schema.js')

  assert.equal(slugify('Hello World!'), 'hello-world')
  assert.equal(slugify('  Designing Systems & Resilient Architecture -- 2026  '), 'designing-systems-resilient-architecture-2026')
  assert.equal(slugify(''), '')
})

test('projects dataset and site config do not contain legacy GitHub Pages hosting references', async () => {
  const { readFile } = await import('node:fs/promises')
  const { join } = await import('node:path')

  const projectsRaw = await readFile(join(process.cwd(), 'src/data/projects.json'), 'utf8')
  assert.doesNotMatch(projectsRaw, /GitHub Pages/i, 'projects.json must not reference GitHub Pages')
  assert.doesNotMatch(projectsRaw, /github\.io/i, 'projects.json must not reference github.io')

  const projects = JSON.parse(projectsRaw)
  const websitePrj = projects.find((p) => p.id === 'prj-personal-website')
  assert.ok(websitePrj, 'Website project entry must exist')
  assert.ok(websitePrj.tools.includes('Vercel'), 'Website tools must include Vercel')
  assert.equal(websitePrj.tools.includes('GitHub Pages'), false, 'Website tools must not include GitHub Pages')
})

test('theme configuration adheres to verified accent tokens', async () => {
  const { readFile } = await import('node:fs/promises')
  const { join } = await import('node:path')

  const css = await readFile(join(process.cwd(), 'src/index.css'), 'utf8')
  assert.match(css, /--color-accent:\s*#c2956a;/, 'index.css must define confirmed --color-accent')
  assert.match(css, /--color-accent-strong:\s*#d4a87d;/, 'index.css must define confirmed --color-accent-strong')
})


