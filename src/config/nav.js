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
    description: 'Personal site and public notebook of Advaita Chandra, a student, learner, and explorer. Notes on philosophy, data, technology, and coding projects.',
  },
  {
    path: '/philosophy',
    key: 'philosophy',
    label: 'Philosophy',
    nav: true,
    title: 'Philosophy',
    description:
      'Notes on books I am reading and questions I have not solved yet.',
  },
  {
    path: '/photography',
    key: 'photography',
    label: 'Photography',
    nav: true,
    title: 'Photography',
    description: 'Street, landscape, and everyday photography.',
  },
  {
    path: '/blog',
    key: 'blog',
    label: 'Writing',
    nav: true,
    title: 'Writing / Blog',
    description: 'Public notebook of notes, research, and ideas as a learner and explorer.',
  },
  {
    path: '/projects',
    key: 'projects',
    label: 'Projects',
    nav: true,
    title: 'Projects',
    description: 'My coding projects, data architecture experiments, and source code.',
  },
  {
    path: '/about',
    key: 'about',
    label: 'About',
    nav: true,
    title: 'About',
    description: 'Background, learning direction, and how I approach questions.',
  },
  {
    path: '/contact',
    key: 'contact',
    label: 'Contact',
    nav: true,
    title: 'Contact',
    description: 'Get in touch about projects, feedback, or collaboration.',
  },
  {
    path: '/art',
    key: 'art',
    label: 'Algorithmic Art',
    nav: false,
    title: 'Algorithmic Art & Creative Computing',
    description: 'Interactive computational aesthetics, mathematical flow fields, and particle dynamics.',
  },
  {
    path: '/privacy',
    key: 'privacy',
    label: 'Privacy Policy',
    nav: false,
    title: 'Privacy Policy',
    description: 'Privacy notice, data practices, and correspondence handling policy.',
  },
  {
    path: '/terms',
    key: 'terms',
    label: 'Terms of Use',
    nav: false,
    title: 'Terms of Use',
    description: 'Terms and conditions, scholarly attribution, and licensing of materials.',
  },
]

/** Navigation items for the public header and footer. */
export const NAV_ITEMS = PUBLIC_ROUTES.filter((route) => route.nav).map(({ path, label, key, description }) => ({
  path,
  label,
  key,
  desc: description,
}))

/**
 * Every route to pre-render, given the published posts and philosophy notes.
 * @param {Array<object>} publishedPosts
 * @param {Array<object>} publishedNotes
 */
export function allPrerenderRoutes(publishedPosts = [], publishedNotes = []) {
  return [
    ...PUBLIC_ROUTES,
    ...publishedPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      key: `post:${post.slug}`,
      title: post.title,
      description: post.excerpt || 'An article by Advaita Chandra.',
      lastmod: post.updated_at || post.updatedAt || post.published_at || post.publishedAt || undefined,
      publishedAt: post.published_at || post.publishedAt,
      updatedAt: post.updated_at || post.updatedAt,
      type: 'article',
    })),
    ...publishedNotes
      .filter((note) => note.slug)
      .map((note) => ({
        path: `/philosophy/${note.slug}`,
        key: `note:${note.slug}`,
        title: note.title,
        description: note.excerpt || note.title,
        lastmod: note.updated_at || note.published_at || undefined,
        publishedAt: note.published_at,
        updatedAt: note.updated_at,
        type: 'article',
      })),
  ]
}
