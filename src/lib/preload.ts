/**
 * Route preloading system for immediate first-click navigation.
 * Strongly typed in TypeScript.
 */

const routeLoaders: Record<string, () => Promise<unknown>> = {
  '/': () => import('../pages/Home.jsx'),
  '/about': () => import('../pages/About.jsx'),
  '/philosophy': () => import('../pages/Philosophy.jsx'),
  '/photography': () => import('../pages/Photography.jsx'),
  '/projects': () => import('../pages/Projects.jsx'),
  '/blog': () => import('../pages/Blog.jsx'),
  '/contact': () => import('../pages/Contact.jsx'),
  '/privacy': () => import('../pages/Privacy.jsx'),
  '/terms': () => import('../pages/Terms.jsx'),
}

const preloaded = new Set<string>()

export function preloadRoute(path?: string | null): void {
  if (!path || typeof path !== 'string' || preloaded.has(path)) return

  const cleanPath = path.split('#')[0].split('?')[0] || '/'
  let loader = routeLoaders[cleanPath]

  if (!loader && cleanPath.startsWith('/blog/')) {
    loader = () => import('../pages/BlogPost.jsx')
  } else if (!loader && cleanPath.startsWith('/philosophy/')) {
    loader = () => import('../pages/NotePost.jsx')
  }

  if (loader) {
    preloaded.add(cleanPath)
    loader().catch(() => {
      preloaded.delete(cleanPath)
    })
  }
}

export interface RoutePreloadProps {
  onPointerEnter: () => void
  onFocus: () => void
  onTouchStart: () => void
}

export function getRoutePreloadProps(path: string): RoutePreloadProps {
  return {
    onPointerEnter: () => preloadRoute(path),
    onFocus: () => preloadRoute(path),
    onTouchStart: () => preloadRoute(path),
  }
}
