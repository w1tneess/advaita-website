import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

/**
 * Breadcrumb navigation for admin panel.
 *
 * Maps current route to hierarchical labels based on navigation structure.
 * Shows path from admin home to current section.
 */

// Route to label mappings
const BREADCRUMB_MAP = {
  '/admin': { label: 'Dashboard', parent: null },
  '/admin/profile': { label: 'Profile & bio', parent: '/admin' },
  '/admin/home': { label: 'Homepage', parent: '/admin' },
  '/admin/projects': { label: 'Projects', parent: '/admin' },
  '/admin/posts': { label: 'Writing', parent: '/admin' },
  '/admin/skills': { label: 'Skills', parent: '/admin' },
  '/admin/timeline': { label: 'Timeline', parent: '/admin' },
  '/admin/categories': { label: 'Categories', parent: '/admin' },
  '/admin/tags': { label: 'Tags', parent: '/admin' },
  '/admin/taxonomy': { label: 'Categories & tags', parent: '/admin' },
  '/admin/media': { label: 'Media library', parent: '/admin' },
  '/admin/social': { label: 'Social links', parent: '/admin' },
  '/admin/seo': { label: 'SEO settings', parent: '/admin' },
  '/admin/settings': { label: 'Settings', parent: '/admin' },
  '/admin/activity': { label: 'Activity log', parent: '/admin' },
  '/admin/data': { label: 'Data & backup', parent: '/admin' },
  '/admin/account': { label: 'Account', parent: '/admin' },
}

/**
 * Build breadcrumb trail from current path
 */
function getBreadcrumbs(pathname) {
  const crumbs = []
  let current = pathname

  // Handle dynamic routes (e.g., /admin/projects/123)
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 2) {
    // Root level like /admin
    current = `/${segments.join('/')}`
  } else if (segments.length === 3) {
    // Collection with ID like /admin/projects/123
    const basePath = `/${segments.slice(0, 2).join('/')}`
    const mapEntry = BREADCRUMB_MAP[basePath]
    if (mapEntry) {
      crumbs.push({ path: '/admin', label: 'Dashboard' })
      if (mapEntry.parent !== '/admin') {
        crumbs.push({ path: mapEntry.parent, label: 'Admin' })
      }
      crumbs.push({ path: basePath, label: mapEntry.label })
      // Check if it's a create form
      if (segments[2] === 'new') {
        crumbs.push({ path: null, label: 'New' })
      } else {
        crumbs.push({ path: null, label: 'Edit' })
      }
      return crumbs
    }
  }

  // Standard mapping
  const mapEntry = BREADCRUMB_MAP[current]
  if (mapEntry) {
    crumbs.push({ path: '/admin', label: 'Dashboard' })
    if (current !== '/admin' && mapEntry.parent !== '/admin') {
      crumbs.push({ path: mapEntry.parent, label: 'Admin' })
    }
    if (current !== '/admin') {
      crumbs.push({ path: current, label: mapEntry.label })
    }
  }

  return crumbs
}

export default function AdminBreadcrumbs() {
  const { pathname } = useLocation()

  // Don't show breadcrumbs on dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
    return null
  }

  const crumbs = getBreadcrumbs(pathname)

  if (crumbs.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {crumbs.map((crumb, index) => (
          <li key={crumb.path || crumb.label} className="flex items-center gap-2">
            {index === 0 && (
              <>
                <Link
                  to={crumb.path}
                  className="flex items-center gap-1 text-muted hover:text-ink transition-colors"
                >
                  <Home className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{crumb.label}</span>
                </Link>
                {crumbs.length > 1 && (
                  <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
                )}
              </>
            )}
            {index > 0 && (
              <>
                {crumb.path ? (
                  <Link to={crumb.path} className="text-muted hover:text-ink transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink font-medium">{crumb.label}</span>
                )}
                {index < crumbs.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
