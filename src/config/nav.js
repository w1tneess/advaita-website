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
    title: 'Advaita Chandra — Thinking. Building. Noticing.',
    description:
      "A personal space for things I'm thinking about, making, and noticing — philosophy, photography, and projects.",
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
      "A record of what I'm reading, questioning, and trying to understand more clearly — Krishnamurti, Camus, Dostoevsky, Ramana Maharshi, and Osho.",
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/photography',
    key: 'photography',
    label: 'Photography',
    nav: true,
    title: 'Photography',
    description:
      "A visual notebook of things I've noticed through a camera — street, landscape, and everyday moments.",
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
    description:
      "Things I'm building — some finished, most still evolving. School worksheet generator, school website, and this site.",
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/about',
    key: 'about',
    label: 'About',
    nav: true,
    title: 'About',
    description:
      "Who I am, what I'm interested in, and how I approach a question. Student researcher, not an expert.",
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
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ]
}
