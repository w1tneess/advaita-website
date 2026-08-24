/**
 * SEO metadata helpers.
 *
 * Shared between the React <Seo> component (runtime) and scripts/prerender.js
 * (build time) so a page's title/description/OG tags are identical in both.
 *
 * Plain JavaScript, no React — Node imports this directly.
 */

import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from './routes.js'

/** Join the site origin, the deploy base path and a route into one absolute URL. */
export function absoluteUrl(path = '/', basePath = '/') {
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
 * @returns {{title: string, description: string, canonical: string, image: string,
 *            type: string, noindex: boolean}}
 */
export function buildMeta(route = {}, basePath = '/') {
  return {
    title: formatTitle(route.title),
    description: route.description || '',
    canonical: absoluteUrl(route.path || '/', basePath),
    image: route.image
      ? absoluteUrl(route.image, basePath)
      : absoluteUrl(DEFAULT_OG_IMAGE, basePath),
    type: route.type || 'website',
    noindex: Boolean(route.noindex),
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
 * Render the <head> metadata block as an HTML string.
 * Used only by scripts/prerender.js — the React component renders real elements.
 */
export function renderMetaTags(meta) {
  const e = escapeHtml
  const tags = [
    `<title>${e(meta.title)}</title>`,
    `<meta name="description" content="${e(meta.description)}" />`,
    `<link rel="canonical" href="${e(meta.canonical)}" />`,
    `<meta property="og:type" content="${e(meta.type)}" />`,
    `<meta property="og:site_name" content="${e(SITE_NAME)}" />`,
    `<meta property="og:title" content="${e(meta.title)}" />`,
    `<meta property="og:description" content="${e(meta.description)}" />`,
    `<meta property="og:url" content="${e(meta.canonical)}" />`,
    `<meta property="og:image" content="${e(meta.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(meta.title)}" />`,
    `<meta name="twitter:description" content="${e(meta.description)}" />`,
    `<meta name="twitter:image" content="${e(meta.image)}" />`,
  ]

  if (meta.noindex) {
    tags.push('<meta name="robots" content="noindex, nofollow" />')
  }

  return tags.join('\n    ')
}
