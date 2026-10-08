import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import Seo from '@/components/meta/Seo.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { getRoutePreloadProps } from '@/lib/preload'

export default function NotFound() {
  const { pathname } = useLocation()
  const displayPath = pathname && pathname.length > 80 ? `${pathname.slice(0, 80)}…` : (pathname || '/404')

  const canGoBack = typeof window !== 'undefined' && window.history && window.history.length > 1

  return (
    <>
      <Seo
        title="Page not found"
        description="This page does not exist on this site."
        path={pathname || '/404'}
        noindex
      />

      <div className="shell py-20 sm:py-28 md:py-36">
        <div className="max-w-xl bg-surface p-8 sm:p-12 border border-line">
          <p className="font-utility text-muted">
            404
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-normal text-ink font-display">
            Page not found
          </h1>
          <p className="mt-4 text-base font-sans leading-relaxed text-muted">
            The page at <code className="bg-line px-1.5 py-0.5 rounded text-sm text-ink break-all">{displayPath}</code> could not be found. It may have been moved or removed.
          </p>

          <nav aria-label="Archive directory" className="mt-8 pt-6 border-t border-line">
            <p className="font-utility text-muted mb-4">
              Explore the site:
            </p>
            <ul className="grid grid-cols-2 gap-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    {...getRoutePreloadProps(item.path)}
                    className="font-utility text-ink hover:text-muted transition-colors inline-flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center gap-4">
            {canGoBack && (
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 border border-line bg-surface px-5 py-2.5 font-utility text-ink hover:border-line-strong transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Go back</span>
              </button>
            )}
            <Link
              to="/"
              {...getRoutePreloadProps('/')}
              className="inline-flex items-center gap-2 bg-ink text-canvas px-5 py-2.5 font-utility hover:bg-muted transition-colors cursor-pointer"
            >
              <span>Return Home</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
