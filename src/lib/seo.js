/**
 * SEO metadata helpers.
 *
 * Shared between the React <Seo> component (runtime) and scripts/prerender.js
 * (build time) so a page's title, description, Open Graph, Twitter cards, and
 * Schema.org JSON-LD graphs are identical in both environments.
 *
 * Plain JavaScript, no React — Node imports this directly.
 */

export { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from './routes.js'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from './routes.js'

export const TWITTER_HANDLE = '@w1tneess_'
export const GITHUB_PROFILE = 'https://github.com/w1tneess'
export const TWITTER_PROFILE = 'https://x.com/w1tneess_'
export const INSTAGRAM_PROFILE = 'https://www.instagram.com/adva1ta_/'

/** Join the site origin, the deploy base path and a route into one absolute URL. */
export function absoluteUrl(path = '/', basePath = '/') {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = basePath.endsWith('/') ? basePath : `${basePath}/`
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${SITE_URL}${base}${cleanPath}`
}

/** Page titles read "About — Advaita Chandra"; the home title is already complete. */
export function formatTitle(title) {
  if (!title) return SITE_NAME
  return title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`
}

/**
 * Normalise a route into the exact tag values to render.
 * @returns {{
 *   title: string,
 *   description: string,
 *   canonical: string,
 *   image: string,
 *   type: string,
 *   noindex: boolean,
 *   publishedAt?: string,
 *   updatedAt?: string,
 *   path: string,
 *   pageType: string
 * }}
 */
export function buildMeta(route = {}, basePath = '/') {
  const path = route.path || '/'
  let pageType = 'WebPage'
  if (path === '/' || path === '/about') {
    pageType = 'ProfilePage'
  } else if (['/projects', '/philosophy', '/blog', '/photography'].includes(path)) {
    pageType = 'CollectionPage'
  } else if (route.type === 'article') {
    pageType = 'BlogPosting'
  }

  return {
    title: formatTitle(route.title),
    description: route.description || 'Personal website and notebook of Advaita Chandra, a student based in West Bengal, India.',
    canonical: absoluteUrl(path, basePath),
    image: route.image
      ? absoluteUrl(route.image, basePath)
      : absoluteUrl(DEFAULT_OG_IMAGE, basePath),
    type: route.type || 'website',
    noindex: Boolean(route.noindex),
    publishedAt: route.publishedAt || route.published_at,
    updatedAt: route.updatedAt || route.updated_at,
    path,
    pageType,
  }
}

/** Escape a string for safe interpolation into an HTML attribute. */
export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Build a rich Schema.org Linked Data graph for search engines and LLM reasoning.
 */
export function generateJsonLd(meta) {
  const personId = `${SITE_URL}/#person`
  const websiteId = `${SITE_URL}/#website`
  const webpageId = `${meta.canonical}#webpage`

  const personEntity = {
    '@type': 'Person',
    '@id': personId,
    name: 'Advaita Chandra',
    givenName: 'Advaita',
    familyName: 'Chandra',
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og-image.jpg`,
    jobTitle: 'Student',
    description:
      'Advaita Chandra is a student from West Bengal, India. This is his personal website for projects, reading notes, and learning logs.',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'West Bengal',
      addressCountry: 'IN',
    },
    homeLocation: {
      '@type': 'Place',
      name: 'West Bengal, India',
    },
    knowsAbout: [
      'Web development',
      'Programming',
      'Full-stack development',
      'Photography',
      'Digital experiments',
      'Philosophy',
      'History',
      'Creative computing',
      'Python',
      'React',
      'System design',
    ],
    sameAs: [GITHUB_PROFILE, TWITTER_PROFILE, INSTAGRAM_PROFILE],
  }

  const websiteEntity = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${SITE_URL}/`,
    name: 'Advaita Chandra',
    description:
      "Personal website for a student's projects and learning notes.",
    publisher: { '@id': personEntity['@id'] },
    inLanguage: 'en-US',
  }

  // Determine breadcrumb structure
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${SITE_URL}/`,
    },
  ]

  if (meta.path !== '/') {
    const clean = meta.path.replace(/^\/|\/$/g, '')
    const parts = clean.split('/')

    if (parts.length === 1) {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: meta.title.replace(` — ${SITE_NAME}`, ''),
        item: meta.canonical,
      })
    } else if (parts.length >= 2) {
      const parentSlug = parts[0]
      const parentLabel = parentSlug.charAt(0).toUpperCase() + parentSlug.slice(1)
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: parentLabel === 'Blog' ? 'Writing' : parentLabel,
        item: `${SITE_URL}/${parentSlug}`,
      })
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 3,
        name: meta.title.replace(` — ${SITE_NAME}`, ''),
        item: meta.canonical,
      })
    }
  }

  const breadcrumbEntity = {
    '@type': 'BreadcrumbList',
    '@id': `${meta.canonical}#breadcrumb`,
    itemListElement: breadcrumbItems,
  }

  const webpageEntity = {
    '@type': meta.pageType,
    '@id': webpageId,
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': websiteId },
    about: { '@id': personId },
    breadcrumb: { '@id': breadcrumbEntity['@id'] },
    inLanguage: 'en-US',
  }

  if (meta.pageType === 'ProfilePage') {
    webpageEntity.mainEntity = {
      '@type': 'Person',
      name: 'Advaita Chandra',
      url: `${SITE_URL}/`,
      jobTitle: 'Student',
      description:
        'Advaita Chandra is a student from West Bengal, India. This is his personal website for projects, reading notes, and learning logs.',
      sameAs: [GITHUB_PROFILE, TWITTER_PROFILE, INSTAGRAM_PROFILE],
      knowsAbout: [
        'Web development',
        'Programming',
        'Full-stack development',
        'Photography',
        'Digital experiments',
        'Philosophy',
        'History',
        'Creative computing',
      ],
    }
  }

  if (meta.type === 'article') {
    webpageEntity.headline = meta.title
    webpageEntity.image = [meta.image]
    if (meta.publishedAt) webpageEntity.datePublished = meta.publishedAt
    if (meta.updatedAt || meta.publishedAt) webpageEntity.dateModified = meta.updatedAt || meta.publishedAt
    webpageEntity.author = { '@id': personId }
    webpageEntity.publisher = { '@id': personId }
    webpageEntity.mainEntityOfPage = meta.canonical
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [personEntity, websiteEntity, webpageEntity, breadcrumbEntity],
  }
}

/**
 * Render the <head> metadata block as an HTML string with JSON-LD.
 * Used by scripts/prerender.js to bake complete SEO and GEO tags.
 */
export function renderMetaTags(meta) {
  const e = escapeHtml
  const jsonLd = generateJsonLd(meta)

  const tags = [
    `<title>${e(meta.title)}</title>`,
    `<meta name="description" content="${e(meta.description)}" />`,
    `<link rel="canonical" href="${e(meta.canonical)}" />`,
  ]

  if (meta.noindex) {
    tags.push('<meta name="robots" content="noindex, nofollow" />')
  } else {
    tags.push(
      '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />',
      '<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />',
      '<meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />',
    )
  }

  tags.push(
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:type" content="${e(meta.type)}" />`,
    `<meta property="og:site_name" content="${e(SITE_NAME)}" />`,
    `<meta property="og:title" content="${e(meta.title)}" />`,
    `<meta property="og:description" content="${e(meta.description)}" />`,
    `<meta property="og:url" content="${e(meta.canonical)}" />`,
    `<meta property="og:image" content="${e(meta.image)}" />`,
    `<meta property="og:image:alt" content="${e(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${TWITTER_HANDLE}" />`,
    `<meta name="twitter:creator" content="${TWITTER_HANDLE}" />`,
    `<meta name="twitter:title" content="${e(meta.title)}" />`,
    `<meta name="twitter:description" content="${e(meta.description)}" />`,
    `<meta name="twitter:image" content="${e(meta.image)}" />`,
  )

  if (meta.publishedAt) {
    tags.push(`<meta property="article:published_time" content="${e(meta.publishedAt)}" />`)
    tags.push(`<meta property="article:author" content="${SITE_URL}/#person" />`)
  }
  if (meta.updatedAt) {
    tags.push(`<meta property="article:modified_time" content="${e(meta.updatedAt)}" />`)
  }

  // Add discovery tags for LLM & RSS consumers
  tags.push(
    `<link rel="alternate" type="text/plain" href="${SITE_URL}/llms.txt" title="LLM Context" />`,
    `<link rel="alternate" type="text/plain" href="${SITE_URL}/llms-full.txt" title="Full LLM Context" />`,
    `<link rel="alternate" type="application/rss+xml" title="Advaita Chandra — RSS Feed" href="${SITE_URL}/rss.xml" />`,
    `<link rel="alternate" type="application/feed+json" title="Advaita Chandra — JSON Feed" href="${SITE_URL}/feed.json" />`,
  )

  // Injected JSON-LD Schema
  tags.push(`<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`)

  return tags.join('\n    ')
}
