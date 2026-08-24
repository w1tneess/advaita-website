/**
 * Post-build pre-render.
 *
 * GitHub Pages has no server, so a request for /about would normally 404: the built app is a
 * single index.html and nothing maps that path to it. This script writes a real index.html
 * for every known route after `vite build`, each with its own <title>, description, canonical
 * URL and Open Graph tags baked in.
 *
 * Two things that matter and are easy to get wrong:
 *
 *   1. It is NOT server-side rendering. Each file is the same app shell with route-specific
 *      <head> tags; the body is still rendered by React on load. That is enough for correct
 *      status codes, correct crawler metadata and correct link previews, which is what the
 *      static host actually breaks. Claiming more would be a lie.
 *
 *   2. Asset URLs must stay absolute. index.html references /assets/…, which resolves the
 *      same way from /about/index.html as from /index.html. A relative base ('./') would
 *      break at depth, so vite.config.js never uses one.
 *
 * Run automatically by `npm run build`. Honours BASE_PATH exactly as vite.config.js does.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { PUBLIC_ROUTES, SITE_URL, allPrerenderRoutes } from '../src/lib/routes.js'
import { buildMeta, renderMetaTags } from '../src/lib/seo.js'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = join(root, 'dist')

/** Same normalisation as vite.config.js: always absolute, always trailing-slashed. */
function normaliseBase(value) {
  if (!value || value === '/') return '/'
  const withLeading = value.startsWith('/') ? value : `/${value}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

const basePath = normaliseBase(process.env.BASE_PATH)

const MARKER_START = '<!--seo-->'
const MARKER_END = '<!--/seo-->'

/** Replace the marked block in index.html with this route's metadata. */
function injectMeta(template, route) {
  const start = template.indexOf(MARKER_START)
  const end = template.indexOf(MARKER_END)

  if (start === -1 || end === -1) {
    throw new Error(
      `index.html is missing the ${MARKER_START} … ${MARKER_END} markers, so per-route metadata cannot be injected.`,
    )
  }

  const meta = buildMeta(route, basePath)
  return (
    template.slice(0, start + MARKER_START.length) +
    '\n    ' +
    renderMetaTags(meta) +
    '\n    ' +
    template.slice(end)
  )
}

/** '/' → dist/index.html; '/about' → dist/about/index.html. */
async function writeRoute(template, route) {
  const html = injectMeta(template, route)
  const relative = route.path === '/' ? '' : route.path.replace(/^\/|\/$/g, '')
  const dir = relative ? join(dist, relative) : dist

  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'index.html'), html, 'utf8')
  return relative ? `${relative}/index.html` : 'index.html'
}

function renderSitemap(routes) {
  const urls = routes
    .map((route) => {
      const meta = buildMeta(route, basePath)
      const lastmod = route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ''
      return [
        '  <url>',
        `    <loc>${meta.canonical}</loc>${lastmod}`,
        `    <changefreq>${route.changefreq || 'monthly'}</changefreq>`,
        `    <priority>${route.priority || '0.5'}</priority>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

async function readPublishedPosts() {
  try {
    const raw = await readFile(join(root, 'src', 'data', 'posts.json'), 'utf8')
    const posts = JSON.parse(raw)
    if (!Array.isArray(posts)) return []
    // Only published articles become real URLs. A draft has no public page, so listing it in
    // the sitemap would advertise a route that renders "not found".
    return posts.filter((post) => post.status === 'published' && post.slug)
  } catch {
    return []
  }
}

async function main() {
  const template = await readFile(join(dist, 'index.html'), 'utf8')
  const posts = await readPublishedPosts()
  const routes = allPrerenderRoutes(posts)

  const written = []
  for (const route of routes) {
    written.push(await writeRoute(template, route))
  }

  // 404.html doubles as the SPA fallback: GitHub Pages serves it for any unmatched path, and
  // the app then renders the real NotFound page for whatever URL was requested.
  await writeFile(
    join(dist, '404.html'),
    injectMeta(template, {
      path: '/404',
      title: 'Page not found',
      description: 'That page does not exist on this site.',
      noindex: true,
    }),
    'utf8',
  )

  await writeFile(join(dist, 'sitemap.xml'), renderSitemap(routes), 'utf8')

  // robots.txt ships from public/, but its Sitemap line has to match the deploy base.
  const robotsPath = join(dist, 'robots.txt')
  try {
    const robots = await readFile(robotsPath, 'utf8')
    const sitemapUrl = `${SITE_URL}${basePath}sitemap.xml`
    await writeFile(
      robotsPath,
      robots.replace(/^Sitemap:.*$/m, `Sitemap: ${sitemapUrl}`),
      'utf8',
    )
  } catch {
    // No robots.txt in public/ — nothing to rewrite.
  }

  const postCount = posts.length
  console.log(
    [
      `Pre-rendered ${written.length} route${written.length === 1 ? '' : 's'} at base "${basePath}":`,
      ...written.map((file) => `  ${file}`),
      `  404.html`,
      `  sitemap.xml (${routes.length} URLs)`,
      postCount === 0
        ? `  no published articles yet — ${PUBLIC_ROUTES.length} static routes only`
        : `  including ${postCount} published article${postCount === 1 ? '' : 's'}`,
    ].join('\n'),
  )
}

main().catch((error) => {
  console.error(`\nPre-render failed: ${error.message}\n`)
  process.exit(1)
})
