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

  const navLinks = NAV_ITEMS.filter((item) => item.path !== '/' && item.path !== '/contact')
    .map(
      (item) =>
        `<li><a href="${item.path}" class="text-[13.5px] font-sans text-muted hover:text-ink transition-colors">${e(item.label)}</a></li>`,
    )
    .join('\n            ')

  let mainContent = ''

  const canonicalBio =
    'Advaita Chandra is a student and developer from West Bengal, India. He builds websites, experiments with code, and maintains a public notebook for his interests in photography, philosophy, history, and creative computing. His official website is https://advaitachandra.in/.'
  const displayBio = profile.bio || canonicalBio

  if (route.path === '/') {
    mainContent = `
      <section class="shell relative pt-[clamp(7.5rem,13vw,11.5rem)] pb-[clamp(2.5rem,5vw,4.5rem)] overflow-hidden">
        <div class="ambient-glow top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(48rem,95vw)] h-[min(48rem,95vw)] opacity-20" aria-hidden="true"></div>
        <div class="relative z-10 w-full">
          <div class="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-line bg-surface/60 text-muted font-mono text-[11px] mb-6 sm:mb-8 backdrop-blur-sm">
            <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
            <span class="text-ink font-medium">${e(profile?.name || "Advaita Chandra")}</span>
            <span class="text-line">•</span>
            <span>Archive &amp; Notebook</span>
          </div>

          <div class="max-w-5xl">
            <h1 class="text-[length:var(--text-hero)] font-normal tracking-tight text-ink mb-[var(--spacing-fluid-sm)] leading-[1.12] text-balance">
              I am someone who notices, thinks, builds, photographs, reads, and writes.
            </h1>
            
            <p class="text-[length:var(--text-lg)] text-muted leading-relaxed mb-[var(--spacing-fluid-md)] max-w-3xl">
              Working drafts, code experiments, and study notes tracking my interests in creative computing, philosophy, history, and internet infrastructure.
            </p>

            <div class="flex flex-wrap items-center gap-4 sm:gap-6 mb-[var(--spacing-fluid-lg)]">
              <a
                href="/projects"
                class="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-accent text-canvas text-sm font-semibold shadow-subtle"
              >
                <span>Explore Projects &rarr;</span>
              </a>
              <a
                href="#inquiries"
                class="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-line bg-surface/50 text-muted text-sm font-semibold"
              >
                <span>Reading Archive &darr;</span>
              </a>
            </div>
          </div>

          <div class="pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            <a href="/philosophy" class="p-4 sm:p-6 rounded-xl border border-line/60 bg-surface/30 flex flex-col justify-between">
              <span class="font-mono text-xs text-ink font-medium mb-2">Philosophy</span>
              <p class="text-xs text-muted leading-relaxed">Krishnamurti, Camus, inquiry notes</p>
            </a>
            <a href="/projects" class="p-4 sm:p-6 rounded-xl border border-line/60 bg-surface/30 flex flex-col justify-between">
              <span class="font-mono text-xs text-ink font-medium mb-2">Projects &amp; Tools</span>
              <p class="text-xs text-muted leading-relaxed">Data analysis, code experiments</p>
            </a>
            <a href="/photography" class="p-4 sm:p-6 rounded-xl border border-line/60 bg-surface/30 flex flex-col justify-between">
              <span class="font-mono text-xs text-ink font-medium mb-2">Photography</span>
              <p class="text-xs text-muted leading-relaxed">Visual documentation &amp; geometry</p>
            </a>
            <a href="/blog" class="p-4 sm:p-6 rounded-xl border border-line/60 bg-surface/30 flex flex-col justify-between">
              <span class="font-mono text-xs text-ink font-medium mb-2">Notes &amp; Logs</span>
              <p class="text-xs text-muted leading-relaxed">Working essays &amp; observations</p>
            </a>
          </div>
        </div>
      </section>

      <section class="shell pt-[var(--spacing-fluid-section)] border-t border-line" id="projects">
        <div class="flex flex-wrap items-end justify-between gap-6 mb-8">
          <h2 class="text-2xl sm:text-3xl font-normal text-ink text-balance">Currently building</h2>
          <a href="/projects" class="font-mono text-xs tracking-wide text-ink border-b border-line pb-1">View all projects &rarr;</a>
        </div>
        <div class="divide-y divide-line border-t border-b border-line">
          ${projects
            .filter((p) => p.published)
            .map(
              (p) => `
            <article class="py-6 sm:py-8 grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline">
              <div class="font-mono text-xs tracking-widest uppercase text-muted font-medium">
                ${e(p.categories?.[0] || p.status || 'Project')}
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-normal text-ink leading-snug mb-2">${e(p.title)}</h3>
                <p class="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-2xl">${e(p.summary || p.description)}</p>
              </div>
            </article>`,
            )
            .join('\n')}
        </div>
      </section>

      <section class="shell pt-[var(--spacing-fluid-section)]" id="inquiries">
        <div class="border-b border-line pb-6 mb-8">
          <h2 class="text-2xl sm:text-3xl font-normal text-ink">Currently studying &amp; reading</h2>
        </div>
        <div class="divide-y divide-line border-t border-b border-line">
          ${(philosophy.notes || [])
            .filter((n) => n.status === 'published')
            .map(
              (n) => `
            <article class="py-8 sm:py-10 grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline">
              <div class="font-mono text-xs tracking-widest uppercase text-muted font-medium">${e(n.category)}</div>
              <div>
                <h3 class="text-2xl font-normal text-ink mb-3">${e(n.title)}</h3>
                <p class="text-lg text-muted font-sans leading-relaxed max-w-2xl">${e(n.excerpt || (n.content ? n.content.slice(0, 200) : ''))}</p>
              </div>
            </article>`,
            )
            .join('\n')}
        </div>
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

        <h2>Profiles &amp; Networks</h2>
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
  } else if (route.path.startsWith('/philosophy/')) {
    const noteSlug = route.path.replace('/philosophy/', '')
    const note = (philosophy.notes || []).find((n) => n.slug === noteSlug || n.id === noteSlug)
    if (note) {
      mainContent = `
        <article>
          <h1>${e(note.title)}</h1>
          <p><small>${e(note.category || 'Philosophy')} &bull; Published ${e(note.published_at || '')}</small></p>
          <div>${e(note.content).replace(/\n\n/g, '</p><p>')}</div>
        </article>`
    } else {
      mainContent = `
        <article>
          <h1>${e(route.title || SITE_NAME)}</h1>
          <p>${e(route.description || '')}</p>
        </article>`
    }
  } else if (route.path.startsWith('/blog/')) {
    const postSlug = route.path.replace('/blog/', '')
    const post = (posts || []).find((p) => p.slug === postSlug || p.id === postSlug)
    if (post) {
      mainContent = `
        <article>
          <h1>${e(post.title)}</h1>
          <p><small>${e(post.category || 'Note')} &bull; Published ${e(post.published_at || '')}</small></p>
          <div>${e(post.content).replace(/\n\n/g, '</p><p>')}</div>
        </article>`
    } else {
      mainContent = `
        <article>
          <h1>${e(route.title || SITE_NAME)}</h1>
          <p>${e(route.description || '')}</p>
        </article>`
    }
  } else {
    mainContent = `
      <article>
        <h1>${e(route.title || SITE_NAME)}</h1>
        <p>${e(route.description || '')}</p>
      </article>`
  }

  return `
    <div id="prerendered-content" class="flex min-h-dvh flex-col bg-canvas text-ink">
      <header class="fixed top-0 inset-x-0 z-50 bg-transparent pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-5 pb-2">
        <div class="shell flex h-12 sm:h-14 items-center justify-between gap-[var(--spacing-fluid-md)]">
          <a href="/" class="flex items-center gap-2.5 sm:gap-3 text-ink select-none font-display text-[1.15rem] sm:text-[1.3rem] font-normal tracking-[-0.015em]" aria-label="${e(profile.name || SITE_NAME)}, home">
            <span>${e(profile.name || SITE_NAME)}</span>
            <span aria-hidden="true" class="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(194,149,106,0.55)]"></span>
          </a>
          <nav aria-label="Primary" class="hidden items-center gap-6 lg:gap-7 md:flex">
            <ul class="flex items-center gap-6 list-none p-0 m-0">
              ${navLinks}
            </ul>
          </nav>
          <div class="hidden sm:flex items-center gap-3">
            <a href="/contact" class="inline-flex items-center gap-2 px-4 py-1 text-[13px] font-sans font-medium rounded-full border border-line text-muted hover:text-ink">
              <span>Contact</span>
            </a>
          </div>
        </div>
      </header>
      <main id="main-content" class="flex-1">
        ${route.path === '/' ? mainContent : `<div class="shell pt-[clamp(7.5rem,13vw,11.5rem)] pb-16 prose-body">${mainContent}</div>`}
      </main>
      <footer class="mt-auto border-t border-line py-12 text-sm text-muted">
        <div class="shell flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; ${new Date().getFullYear()} ${e(SITE_NAME)}. All rights reserved.</p>
          <p class="flex flex-wrap gap-4">
            <a href="/llms.txt" class="underline underline-offset-4 hover:text-ink">LLM Summary</a>
            <a href="/rss.xml" class="underline underline-offset-4 hover:text-ink">RSS Feed</a>
            <a href="/feed.json" class="underline underline-offset-4 hover:text-ink">JSON Feed</a>
            <a href="/sitemap.xml" class="underline underline-offset-4 hover:text-ink">Sitemap</a>
          </p>
        </div>
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
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

/** Notes without a slug have no page of their own, only an anchor on /philosophy. */
const noteUrl = (note) => (note.slug ? `${SITE_URL}/philosophy/${note.slug}` : `${SITE_URL}/philosophy#${note.id}`)

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
      <link>${noteUrl(note)}</link>
      <guid isPermaLink="false">${noteUrl(note)}</guid>
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
      id: noteUrl(note),
      url: noteUrl(note),
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

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_Backend_SUPABASE_URL ||
  process.env.Backend_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ''

const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_Backend_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_Backend_SUPABASE_PUBLISHABLE_KEY ||
  process.env.Backend_SUPABASE_ANON_KEY ||
  process.env.Backend_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''

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
      // Supabase is authoritative: merging seed projects back in resurrected ones deleted in admin.
      if (Array.isArray(data?.data?.projects) && data.data.projects.length > 0) {
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
  const routes = allPrerenderRoutes(posts, philosophy.notes || [])

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
