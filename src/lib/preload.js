/**
 * Route preloading system for immediate first-click navigation.
 *
 * Preloads page JS bundles on pointer enter, focus, or touch start so that
 * lazy-loaded routes are already parsed in memory when the user clicks.
 */

const routeLoaders = {
  '/': () => import('../pages/Home.jsx'),
  '/about': () => import('../pages/About.jsx'),
  '/philosophy': () => import('../pages/Philosophy.jsx'),
  '/photography': () => import('../pages/Photography.jsx'),
  '/projects': () => import('../pages/Projects.jsx'),
  '/blog': () => import('../pages/Blog.jsx'),
  '/contact': () => import('../pages/Contact.jsx'),
}

const preloaded = new Set()

export function preloadRoute(path) {
  if (!path || typeof path !== 'string' || preloaded.has(path)) return

  const cleanPath = path.split('#')[0].split('?')[0] || '/'
  let loader = routeLoaders[cleanPath]

  if (!loader && cleanPath.startsWith('/blog/')) {
    loader = () => import('../pages/BlogPost.jsx')
  }

  if (loader) {
    preloaded.add(cleanPath)
    loader().catch(() => {
      preloaded.delete(cleanPath)
    })
  }
}

/**
 * Returns event handlers for preloading routes on hover/focus/touch.
 */
export function getRoutePreloadProps(path) {
  return {
    onPointerEnter: () => preloadRoute(path),
    onFocus: () => preloadRoute(path),
    onTouchStart: () => preloadRoute(path),
  }
}
