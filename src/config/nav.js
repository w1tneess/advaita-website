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
 * Defined in site.js (SITE_URL).
 */

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
    description: 'Notes and projects on philosophy, data, technology, and Indian politics.',
    priority: '1.0',
    changefreq: 'monthly',
  },
  {
    path: '/philosophy',
    key: 'philosophy',
    label: 'Philosophy',
    nav: true,
    title: 'Philosophy',
    description:
      'Notes on books I am reading and questions I have not solved yet.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/photography',
    key: 'photography',
    label: 'Photography',
    nav: true,
    title: 'Photography',
    description: 'Street, landscape, and everyday photography.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/blog',
    key: 'blog',
    label: 'Writing',
    nav: true,
    title: 'Writing / Blog',
    description: 'Notes, research, and ideas as they develop.',
    priority: '0.9',
    changefreq: 'weekly',
  },
  {
    path: '/projects',
    key: 'projects',
    label: 'Projects',
    nav: true,
    title: 'Projects',
    description: 'Projects and source code.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/about',
    key: 'about',
    label: 'About',
    nav: true,
    title: 'About',
    description: 'Background, learning direction, and how I approach questions.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/contact',
    key: 'contact',
    label: 'Contact',
    nav: true,
    title: 'Contact',
    description: 'Get in touch about projects, feedback, or collaboration.',
    priority: '0.6',
    changefreq: 'yearly',
  },
  {
    path: '/privacy',
    key: 'privacy',
    label: 'Privacy Policy',
    nav: false,
    title: 'Privacy Policy',
    description: 'Privacy notice, data practices, and correspondence handling policy.',
    priority: '0.3',
    changefreq: 'yearly',
  },
  {
    path: '/terms',
    key: 'terms',
    label: 'Terms of Use',
    nav: false,
    title: 'Terms of Use',
    description: 'Terms and conditions, scholarly attribution, and licensing of materials.',
    priority: '0.3',
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
 * Every route to pre-render, given the published posts.
 * @param {Array<object>} publishedPosts
 */
export function allPrerenderRoutes(publishedPosts = []) {
  return [
    ...PUBLIC_ROUTES,
    ...publishedPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      key: `post:${post.slug}`,
      title: post.title,
      description: post.excerpt || 'An article by Advaita Chandra.',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: post.updated_at || post.updatedAt || post.published_at || post.publishedAt || undefined,
      type: 'article',
    })),
  ]
}
