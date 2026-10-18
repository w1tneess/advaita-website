import test from 'node:test'
import assert from 'node:assert/strict'

import { replaceSection, syncLlmsFull, syncLlmsTxt } from '../scripts/llms.js'
import { allPrerenderRoutes } from '../src/config/nav.js'
import { buildMeta, generateJsonLd, projectCollection } from '../src/lib/seo.js'

const projects = [
  { id: 'p1', title: 'Live One', summary: 'Has a site.', links: { live: 'https://one.example', repository: 'https://github.com/x/one' } },
  { id: 'p2', title: 'Anchor Two', summary: 'No site.', links: {} },
]
const notes = [{ slug: 'n1', title: 'Note One', category: 'Ethics', published_at: '2025-01-02', content: 'Para one.\n\nPara two.' }]

test('replaceSection swaps only the named section and tolerates CRLF', () => {
  const source = '# T\r\n\r\n## A\r\nold a\r\n\r\n## B\r\nkeep b\r\n'
  assert.equal(replaceSection(source, '## A', '## ', 'new a\n'), '# T\n\n## A\nnew a\n\n## B\nkeep b\n')
})

test('replaceSection leaves the text unchanged when the heading is missing', () => {
  assert.equal(replaceSection('# T\n## X\nbody\n', '## Missing', '## ', 'new\n'), '# T\n## X\nbody\n')
})

test('llms.txt project list follows content: stale entries go, new ones appear', () => {
  const source = '## Key Research & Projects\n- [Deleted Project](https://x): gone\n\n## Philosophical Focus\nkept\n'
  const out = syncLlmsTxt(source, { projects })
  assert.doesNotMatch(out, /Deleted Project/)
  assert.match(out, /- \[Live One\]\(https:\/\/one\.example\): Has a site\. \(Repo: https:\/\/github\.com\/x\/one\)/)
  assert.match(out, /- \[Anchor Two\]\(https:\/\/advaitachandra\.in\/projects#p2\): No site\./)
  assert.match(out, /\n\n## Philosophical Focus\nkept\n$/)
})

test('llms-full.txt regenerates notes and projects between their headings', () => {
  const source = '## 3. Philosophy\n\n### Full Text of Philosophical Notes\nold notes\n\n---\n\n## 4. Projects & Engineering Portfolio\nold projects\n\n---\n\n## 5. Skills\nkept\n'
  const out = syncLlmsFull(source, { projects, notes })
  assert.match(out, /#### Note 1: Note One\n- \*\*Category\*\*: Ethics\n- \*\*Date\*\*: 2025-01-02/)
  assert.match(out, / {2}Para one\.\n\n {2}Para two\./)
  assert.match(out, /### Project 2: Anchor Two/)
  assert.doesNotMatch(out, /old (notes|projects)/)
  assert.match(out, /---\n\n## 5\. Skills\nkept\n$/)
})

test('article routes carry publishedAt so the pre-rendered BlogPosting has datePublished', () => {
  const route = allPrerenderRoutes([], [{ slug: 'n1', title: 'Note One', published_at: '2025-01-02', status: 'published' }]).at(-1)
  const graph = generateJsonLd(buildMeta(route))['@graph']
  const article = graph.find((node) => node['@type'] === 'BlogPosting')
  assert.equal(article.datePublished, '2025-01-02')
  assert.ok(article.headline && article.author && article.image)
})

test('projects page graph lists projects as CreativeWork', () => {
  const meta = buildMeta({ path: '/projects', title: 'Projects', collection: projectCollection(projects) })
  const page = generateJsonLd(meta)['@graph'].find((node) => node['@type'] === 'CollectionPage')
  const items = page.mainEntity.itemListElement
  assert.deepEqual(items.map((entry) => entry.item['@type']), ['CreativeWork', 'CreativeWork'])
  assert.equal(items[1].item.url, 'https://advaitachandra.in/projects#p2')
})
