import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)

  if (pathnames.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-sm text-muted overflow-x-auto whitespace-nowrap">
      <Link to="/" className="flex items-center hover:text-ink transition-colors">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        
        // Capitalize and format the breadcrumb text
        const title = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2 text-line" aria-hidden="true" />
            {last ? (
              <span className="font-medium text-ink" aria-current="page">
                {title}
              </span>
            ) : (
              <Link to={to} className="hover:text-ink transition-colors">
                {title}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
