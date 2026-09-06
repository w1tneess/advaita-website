/**
 * Route table re-exports for backwards compatibility.
 * Canonical definitions live in src/config/nav.js and src/config/site.js.
 */

export {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
} from '../config/site.js'

export {
  PUBLIC_ROUTES,
  ADMIN_ROUTE_PREFIX,
  NAV_ITEMS,
  allPrerenderRoutes,
} from '../config/nav.js'

/**
 * Build the route entry for a single published article.
 * @param {object} post
 */
export function articleRoute(post) {
  return {
    path: `/blog/${post.slug}`,
    key: `post:${post.slug}`,
    title: post.title,
    description: post.excerpt || 'An article by Advaita Chandra.',
    priority: '0.7',
    changefreq: 'yearly',
    lastmod: post.updated_at || post.updatedAt || post.published_at || post.publishedAt || undefined,
    type: 'article',
  }
}
