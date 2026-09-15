/**
 * Post-build pre-render.
 *
 * On static hosting and modern CDNs, requests for clean URLs like /about benefit from
 * route-specific pre-rendered HTML. This script writes a real index.html for every known
 * route after `vite build`:
 *   1. Bakes route-specific <head> tags, Open Graph, Twitter cards, and Schema.org JSON-LD.
 *   2. Pre-renders semantic HTML into <div id="root"> so AI scrapers, LLM agents, and
 *      search crawlers without JavaScript receive complete page content immediately.
 *      (When the client JS bundle loads, React createRoot seamlessly mounts over it.)
 *   3. Generates RSS 2.0 (rss.xml) and JSON Feed 1.1 (feed.json) feeds for content syndication.
 *   4. Generates a comprehensive sitemap.xml.
 *
 * Run automatically by `npm run build`.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

import { allPrerenderRoutes, NAV_ITEMS } from '../src/config/nav.js'
import { SITE_NAME, SITE_URL } from '../src/config/site.js'
import { buildMeta, renderMetaTags, escapeHtml } from '../src/lib/seo.js'

dotenv.config()
dotenv.config({ path: '.env.local' })

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const dist = join(root, 'dist')

const basePath = '/'

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

/**
 * Generate semantic fallback HTML inside <div id="root">.
 * This ensures AI crawlers, LLMs, and non-JS text browsers receive complete,
 * structured text content instantly.
 */
function renderSemanticBody(route, siteData) {
  const e = escapeHtml
  const { profile = {}, philosophy = {}, projects = [], posts = [] } = siteData

  const navLinks = NAV_ITEMS.map(
    (item) => `<li><a href="${item.path}">${e(item.label)}</a></li>`,
  ).join('\n        ')

  let mainContent = ''

  const canonicalBio =
    'Advaita Chandra is a student and developer from West Bengal, India. He builds websites, experiments with code, explores digital technology, and documents his interests in photography, philosophy, history, and creative computing. His official website is https://advaitachandra.in/.'
  const displayBio = profile.bio || canonicalBio

  if (route.path === '/') {
    mainContent = `
      <section>
        <h1>Advaita Chandra</h1>
        <p><strong>Student and developer from West Bengal, India</strong></p>
        <p>${e(displayBio)}</p>
        <p><strong>Official website:</strong> <a href="https://advaitachandra.in/">https://advaitachandra.in/</a></p>
      </section>

      <section>
        <h2>Core Epistemic Principles</h2>
        <p>${e(profile.epistemicNote || '')}</p>
      </section>

      <section>
        <h2>Featured Projects</h2>
        <ul>
          ${projects
            .filter((p) => p.published)
            .map(
              (p) => `
            <li>
              <h3>${e(p.title)}</h3>
              <p>${e(p.summary || p.description)}</p>
              <p><em>Tools: ${(p.tools || []).join(', ')}</em></p>
            </li>`,
            )
            .join('\n')}
        </ul>
      </section>

      <section>
        <h2>Philosophy Notes &amp; Inquiry</h2>
        <p>${e(philosophy.intro || '')}</p>
        <ul>
          ${(philosophy.notes || [])
            .filter((n) => n.status === 'published')
            .map(
              (n) => `
            <li>
              <h3>${e(n.title)}</h3>
              <p><small>${e(n.category)} | ${e(n.published_at)}</small></p>
              <p>${e(n.content)}</p>
            </li>`,
            )
            .join('\n')}
        </ul>
      </section>`
  } else if (route.path === '/about') {
    mainContent = `
      <article>
        <h1>About Advaita Chandra</h1>
        <p><strong>This is the official website of Advaita Chandra.</strong></p>
        <p>${e(displayBio)}</p>
        
        <h2>Identity &amp; Roles</h2>
        <ul>
          <li><strong>Full Name:</strong> Advaita Chandra</li>
          <li><strong>Roles:</strong> Student and Developer</li>
          <li><strong>Location:</strong> West Bengal, India</li>
          <li><strong>Official Website:</strong> <a href="https://advaitachandra.in/">https://advaitachandra.in/</a></li>
        </ul>

        <h2>Verified Profiles &amp; Networks</h2>
        <ul>
          <li>GitHub: <a href="https://github.com/w1tneess">https://github.com/w1tneess</a></li>
          <li>X (Twitter): <a href="https://x.com/w1tneess_">https://x.com/w1tneess_</a></li>
          <li>Instagram: <a href="https://www.instagram.com/adva1ta_/">https://www.instagram.com/adva1ta_/</a></li>
          <li>Email: <a href="mailto:hi@advaitachandra.in">hi@advaitachandra.in</a></li>
        </ul>

        <h2>Technologies &amp; Developer Toolkit</h2>
        <p>Tools and technologies used in projects and digital experiments:</p>
        <ul>
          <li>Web Development: React, JavaScript (ESNext), HTML5, CSS3, Tailwind CSS, Vite</li>
          <li>Data &amp; Computation: Python, Matplotlib, Data Wrangling, Source Reconciliation</li>
          <li>Backend &amp; Infrastructure: Supabase, Vercel, Git</li>
        </ul>

        <h2>Current Projects</h2>
        <ul>
          ${projects
            .filter((p) => p.published)
            .map(
              (p) => `
            <li>
              <strong><a href="/projects#${e(p.id)}">${e(p.title)}</a></strong>: ${e(p.description)}
              <br><small>Status: ${e(p.status)} | Tools: ${(p.tools || []).join(', ')}</small>
            </li>`,
            )
            .join('\n')}
        </ul>
        
        <h2>Research Approach</h2>
        <dl>
          ${(profile.approach || [])
            .map(
              (a) => `
            <dt><strong>${e(a.title)}</strong></dt>
            <dd>${e(a.detail)}</dd>`,
            )
            .join('\n')}
        </dl>

        <h2>Epistemic Framework</h2>
        <p>${e(profile.epistemicNote || '')}</p>
      </article>`
  } else if (route.path === '/philosophy') {
    mainContent = `
      <article>
        <h1>Philosophy &amp; Inquiries</h1>
        <p>${e(philosophy.intro || '')}</p>
        <p>${e(philosophy.description || '')}</p>

        <h2>Thinkers Explored</h2>
        <ul>
          ${(philosophy.thinkers || [])
            .map(
              (t) => `
            <li>
              <strong>${e(t.name)}</strong>: ${e(t.description)}
            </li>`,
            )
            .join('\n')}
        </ul>

        <h2>Notes</h2>
        ${(philosophy.notes || [])
          .filter((n) => n.status === 'published')
          .map(
            (n) => `
          <section>
            <h3>${e(n.title)}</h3>
            <p><small>${e(n.category)} &bull; Published ${e(n.published_at)}</small></p>
            <div>${e(n.content).replace(/\n\n/g, '</p><p>')}</div>
          </section>`,
          )
          .join('\n')}
      </article>`
  } else if (route.path === '/projects') {
    mainContent = `
      <article>
        <h1>Projects &amp; Research</h1>
        <p>A collection of research documents, data visualizations, and software systems.</p>
        ${projects
          .filter((p) => p.published)
          .map(
            (p) => `
          <section id="${e(p.id)}">
            <h2>${e(p.title)}</h2>
            <p><strong>Status:</strong> ${e(p.status)} | <strong>Categories:</strong> ${(p.categories || []).join(', ')}</p>
            <p>${e(p.description)}</p>
            <p><strong>Role:</strong> ${e(p.role)}</p>
            <p><strong>Tools:</strong> ${(p.tools || []).join(', ')}</p>
            ${
              p.methodology && p.methodology.length
                ? `
              <h4>Methodology</h4>
              <ul>
                ${p.methodology.map((m) => `<li><strong>${e(m.title)}:</strong> ${e(m.detail)}</li>`).join('\n')}
              </ul>`
                : ''
            }
            ${
              p.limitations && p.limitations.length
                ? `
              <h4>Stated Limitations</h4>
              <ul>
                ${p.limitations.map((l) => `<li>${e(l)}</li>`).join('\n')}
              </ul>`
                : ''
            }
          </section>`,
          )
          .join('\n')}
      </article>`
  } else if (route.path === '/blog') {
    mainContent = `
      <article>
        <h1>Writing &amp; Research Log</h1>
        <p>Notes, long-form logs, and ideas as they develop.</p>
        ${
          posts.length > 0
            ? `<ul>
                ${posts
                  .map(
                    (post) => `
                  <li>
                    <h2><a href="/blog/${e(post.slug)}">${e(post.title)}</a></h2>
                    <p>${e(post.excerpt || '')}</p>
                    <p><small>${e(post.published_at || post.publishedAt || '')}</small></p>
                  </li>`,
                  )
                  .join('\n')}
              </ul>`
            : '<p>Long-form notes are being prepared. See the <a href="/philosophy">Philosophy</a> section for active inquiry notes.</p>'
        }
      </article>`
  } else if (route.type === 'article') {
    mainContent = `
      <article>
        <h1>${e(route.title)}</h1>
        <p><small>Published by Advaita Chandra on ${e(route.lastmod || '')}</small></p>
        <div>${e(route.description)}</div>
      </article>`
  } else if (route.path === '/photography') {
    mainContent = `
      <article>
        <h1>Photography Portfolio</h1>
        <p>Street, landscape, and everyday photography by Advaita Chandra.</p>
        <p>A visual log capturing light, human geometry, and spontaneous moments.</p>
      </article>`
  } else if (route.path === '/contact') {
    mainContent = `
      <article>
        <h1>Contact Advaita Chandra</h1>
        <p>Reach out for inquiries, scholarly feedback, or collaboration.</p>
        <ul>
          <li>Email: <a href="mailto:hi@advaitachandra.in">hi@advaitachandra.in</a></li>
          <li>GitHub: <a href="https://github.com/w1tneess">https://github.com/w1tneess</a></li>
          <li>X (Twitter): <a href="https://x.com/w1tneess_">https://x.com/w1tneess_</a></li>
          <li>Instagram: <a href="https://www.instagram.com/adva1ta_/">https://www.instagram.com/adva1ta_/</a></li>
        </ul>
      </article>`
  } else if (route.path === '/privacy') {
    mainContent = `
      <article>
        <h1>Privacy Policy</h1>
        <p>Personal portfolio privacy practices. No tracking cookies or commercial telemetry.</p>
      </article>`
  } else if (route.path === '/terms') {
    mainContent = `
      <article>
        <h1>Terms of Use</h1>
        <p>Terms of service, intellectual attribution, and licensing of written material.</p>
      </article>`
  } else {
    mainContent = `
      <article>
        <h1>${e(route.title || SITE_NAME)}</h1>
        <p>${e(route.description || '')}</p>
      </article>`
  }

  return `
    <div id="prerendered-content">
      <header>
        <nav aria-label="Main Navigation">
          <ul>
            ${navLinks}
          </ul>
        </nav>
      </header>
      <main>
        ${mainContent}
      </main>
      <footer>
        <p>&copy; ${new Date().getFullYear()} ${e(SITE_NAME)}. All rights reserved.</p>
        <p>
          <a href="/llms.txt">LLM Summary (llms.txt)</a> &bull;
          <a href="/llms-full.txt">LLM Full Context</a> &bull;
          <a href="/rss.xml">RSS Feed</a> &bull;
          <a href="/feed.json">JSON Feed</a> &bull;
          <a href="/sitemap.xml">Sitemap</a>
        </p>
      </footer>
    </div>`
}

/** Inject both head meta and semantic body into the template. */
function injectFullRoute(template, route, siteData) {
  let html = injectMeta(template, route)
  const semanticBody = renderSemanticBody(route, siteData)
  html = html.replace('<div id="root"></div>', `<div id="root">${semanticBody}</div>`)
  return html
}

/** '/' → dist/index.html; '/about' → dist/about/index.html. */
async function writeRoute(template, route, siteData) {
  const html = injectFullRoute(template, route, siteData)
  const relative = route.path === '/' ? '' : route.path.replace(/^\/|\/$/g, '')
  const dir = relative ? join(dist, relative) : dist

  await mkdir(dir, { recursive: true })
  await writeFile(join(dist, relative ? `${relative}/index.html` : 'index.html'), html, 'utf8')
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

/** Render RSS 2.0 Feed combining notes and blog posts. */
function renderRssFeed({ posts = [], notes = [] }) {
  const items = []

  // Add blog posts
  for (const post of posts) {
    const pubDate = new Date(post.published_at || post.publishedAt || Date.now()).toUTCString()
    items.push(`
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt || post.content || ''}]]></description>
      <author>hi@advaitachandra.in (Advaita Chandra)</author>
    </item>`)
  }

  // Add philosophy notes
  for (const note of notes) {
    const pubDate = new Date(note.published_at || Date.now()).toUTCString()
    items.push(`
    <item>
      <title><![CDATA[${note.title}]]></title>
      <link>${SITE_URL}/philosophy#${note.id}</link>
      <guid isPermaLink="false">${SITE_URL}/philosophy#${note.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${note.category || 'Philosophy'}]]></category>
      <description><![CDATA[${note.content}]]></description>
      <author>hi@advaitachandra.in (Advaita Chandra)</author>
    </item>`)
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Advaita Chandra</title>
    <link>${SITE_URL}/</link>
    <description>Personal website for a student's projects and learning notes.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join('\n')}
  </channel>
</rss>`
}

/** Render JSON Feed 1.1 */
function renderJsonFeed({ posts = [], notes = [] }) {
  const feedItems = []

  for (const post of posts) {
    feedItems.push({
      id: `${SITE_URL}/blog/${post.slug}`,
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      summary: post.excerpt,
      content_text: post.content || post.excerpt,
      date_published: new Date(post.published_at || post.publishedAt || Date.now()).toISOString(),
      author: {
        name: 'Advaita Chandra',
        url: SITE_URL,
      },
    })
  }

  for (const note of notes) {
    feedItems.push({
      id: `${SITE_URL}/philosophy#${note.id}`,
      url: `${SITE_URL}/philosophy#${note.id}`,
      title: note.title,
      content_text: note.content,
      tags: [note.category],
      date_published: new Date(note.published_at || Date.now()).toISOString(),
      author: {
        name: 'Advaita Chandra',
        url: SITE_URL,
      },
    })
  }

  return JSON.stringify(
    {
      version: 'https://jsonfeed.org/version/1.1',
      title: 'Advaita Chandra',
      home_page_url: `${SITE_URL}/`,
      feed_url: `${SITE_URL}/feed.json`,
      description: "Personal website for a student's projects and learning notes.",
      authors: [
        {
          name: 'Advaita Chandra',
          url: `${SITE_URL}/`,
        },
      ],
      items: feedItems,
    },
    null,
    2,
  )
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase =
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

async function getPrerenderData() {
  let posts = []
  let latestUpdate = null
  let profile = {}
  let philosophy = {}
  let projects = []
  let social = []

  // Load local data as baseline
  try {
    profile = JSON.parse(await readFile(join(root, 'src/data/profile.json'), 'utf8'))
    philosophy = JSON.parse(await readFile(join(root, 'src/data/philosophy.json'), 'utf8'))
    projects = JSON.parse(await readFile(join(root, 'src/data/projects.json'), 'utf8'))
    social = JSON.parse(await readFile(join(root, 'src/data/social.json'), 'utf8'))
  } catch (e) {
    console.warn('Warning reading local data files:', e.message)
  }

  if (supabase) {
    try {
      const { data } = await supabase
        .from('site_content')
        .select('data, updated_at')
        .eq('id', 'main')
        .single()

      if (data?.data?.blog && Array.isArray(data.data.blog)) {
        posts = data.data.blog.filter((p) => p.status === 'published')
      }
      if (data?.data?.profile) profile = { ...profile, ...data.data.profile }
      if (data?.data?.philosophy) {
        const remoteNotes = data.data.philosophy.notes
        philosophy = {
          ...philosophy,
          ...data.data.philosophy,
          notes:
            Array.isArray(remoteNotes) && remoteNotes.length > 0
              ? remoteNotes
              : philosophy.notes || [],
        }
      }
      if (data?.data?.projects && Array.isArray(data.data.projects) && data.data.projects.length > 0) {
        projects = data.data.projects
      }
      if (data?.updated_at) {
        latestUpdate = new Date(data.updated_at).toISOString()
      }
    } catch (_e) {
      // Fallback to local files
    }
  }

  if (posts.length === 0) {
    try {
      const blogSeed = JSON.parse(await readFile(join(root, 'src/data/blog.json'), 'utf8'))
      if (Array.isArray(blogSeed)) {
        posts = blogSeed.filter((p) => p.status === 'published')
      }
    } catch {
      // No seed blog
    }
  }

  return { posts, latestUpdate, profile, philosophy, projects, social }
}

async function main() {
  const template = await readFile(join(dist, 'index.html'), 'utf8')
  const siteData = await getPrerenderData()
  const { posts, latestUpdate, philosophy } = siteData
  const routes = allPrerenderRoutes(posts)

  if (latestUpdate) {
    routes.forEach((route) => {
      // Set lastmod on dynamic pages if they are updated
      if (['projects', 'philosophy', 'blog'].includes(route.key)) {
        route.lastmod = latestUpdate
      }
    })
  }

  const written = []
  for (const route of routes) {
    written.push(await writeRoute(template, route, siteData))
  }

  // 404.html fallback
  await writeFile(
    join(dist, '404.html'),
    injectFullRoute(
      template,
      {
        path: '/404',
        title: 'Page not found',
        description: 'That page does not exist on this site.',
        noindex: true,
      },
      siteData,
    ),
    'utf8',
  )

  // Sitemap
  await writeFile(join(dist, 'sitemap.xml'), renderSitemap(routes), 'utf8')

  // Feeds
  const notes = (philosophy.notes || []).filter((n) => n.status === 'published')
  await writeFile(join(dist, 'rss.xml'), renderRssFeed({ posts, notes }), 'utf8')
  await writeFile(join(dist, 'feed.json'), renderJsonFeed({ posts, notes }), 'utf8')

  // robots.txt rewrite sitemap if needed
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
    // No robots.txt
  }

  console.log(
    [
      `Pre-rendered ${written.length} route${written.length === 1 ? '' : 's'} at base "${basePath}":`,
      ...written.map((file) => `  ${file}`),
      `  404.html`,
      `  sitemap.xml (${routes.length} URLs)`,
      `  rss.xml (${posts.length + notes.length} entries)`,
      `  feed.json (${posts.length + notes.length} entries)`,
    ].join('\n'),
  )
}

main().catch((error) => {
  console.error(`\nPre-render failed: ${error.message}\n`)
  process.exit(1)
})
