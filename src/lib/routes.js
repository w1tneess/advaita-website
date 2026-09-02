/**
 * Route table — the single source of truth for:
 *   - React Router (src/App.jsx)
 *   - the header/footer navigation
 *   - the pre-render + sitemap script (scripts/prerender.js)
 *
 * This file is plain JavaScript with NO React imports so that Node can import it
 * directly at build time. Do not add JSX or browser-only APIs here.
 */

/**
 * Canonical production origin, without a trailing slash.
 *
 * This is the one place the site URL is defined. It is intentionally NOT stored in
 * src/data/settings.json: the pre-rendered <link rel="canonical"> tags are baked at
 * build time, so a runtime-editable copy could silently disagree with them.
 *
 * Change this if you deploy somewhere else, e.g. 'https://username.github.io'.
 */
export const SITE_URL = 'https://advaitachandra.in'

export const SITE_NAME = 'Advaita Chandra'

/** Default Open Graph image. Replace with a 1200x630 PNG before sharing links widely. */
export const DEFAULT_OG_IMAGE = 'og-placeholder.svg'

/**
 * Public routes. Every entry is pre-rendered to its own index.html and listed in
 * sitemap.xml.
 *
 * `nav: true` also places the route in the header and footer navigation.
 */
export const PUBLIC_ROUTES = [
  {
    path: '/',
    key: 'home',
    label: 'Home',
    nav: true,
    title: 'Advaita Chandra',
    description:
      'Notes on philosophy, Indian politics, technology, and data.',
    priority: '1.0',
    changefreq: 'monthly',
  },
  {
    path: '/about',
    key: 'about',
    label: 'About',
    nav: true,
    title: 'About',
    description:
      'A short biography, research interests, current learning direction, and the four-step approach behind the work on this site.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/portfolio',
    key: 'portfolio',
    label: 'Portfolio',
    nav: true,
    title: 'Portfolio',
    description:
      'Research, writing, data, and concept projects.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/blog',
    key: 'blog',
    label: 'Writing',
    nav: true,
    title: 'Writing',
    description:
      'Notes, research and ideas as they develop, with sources cited and analysis separated from opinion.',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    path: '/contact',
    key: 'contact',
    label: 'Contact',
    nav: true,
    title: 'Contact',
    description: 'How to get in touch about research, writing or collaboration.',
    priority: '0.6',
    changefreq: 'yearly',
  },
]

/** Routes that must never be indexed or listed in the sitemap. */
export const ADMIN_ROUTE_PREFIX = '/admin'

/** Navigation items for the public header and footer. */
export const NAV_ITEMS = PUBLIC_ROUTES.filter((route) => route.nav).map(({ path, label, key }) => ({
  path,
  label,
  key,
}))

/**
 * Build the route entry for a single published article.
 * Used by the pre-render script so each post becomes a real, crawlable URL.
 */
export function articleRoute(post) {
  return {
    path: `/blog/${post.slug}`,
    key: `post:${post.slug}`,
    title: post.title,
    description: post.excerpt || `An article by ${SITE_NAME}.`,
    priority: '0.7',
    changefreq: 'yearly',
    lastmod: post.updatedAt || post.publishedAt || undefined,
    type: 'article',
  }
}

/**
 * Every route to pre-render, given the published posts.
 * @param {Array<object>} publishedPosts
 */
export function allPrerenderRoutes(publishedPosts = []) {
  return [...PUBLIC_ROUTES, ...publishedPosts.map(articleRoute)]
}
