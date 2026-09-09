import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import Reveal from '@/components/ui/Reveal.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { NAV_ITEMS } from '@/config/nav.js'

/**
 * 404 page.
 *
 * Darkroom journal / cinematic editorial error state.
 */
export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <>
      <Seo
        title="Page not found"
        description="This page does not exist on this site."
        path={pathname}
        noindex
      />

      <div className="shell py-20 sm:py-28 md:py-36">
        <Reveal y={12}>
          <div className="max-w-xl border border-line bg-surface/80 p-8 sm:p-12 backdrop-blur-sm relative overflow-hidden">
            {/* Optical darkroom corner bracket */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-copper/30 pointer-events-none" />

            <p className="font-mono text-xs text-copper uppercase tracking-widest">
              404 // PAGE NOT FOUND
            </p>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl font-light tracking-tight text-text">
              Page not found
            </h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-2">
              The page at <code className="font-mono text-xs text-copper bg-canvas px-2 py-0.5 border border-line break-all">{pathname}</code> could not be found. It may have been moved or removed.
            </p>

            <nav aria-label="Archive directory" className="mt-8 pt-6 border-t border-line">
              <p className="font-mono text-xs text-text-3 uppercase tracking-wider">
                Explore the site:
              </p>
              <ul className="mt-3 grid grid-cols-2 gap-2.5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="font-mono text-xs text-copper hover:text-copper-strong transition-colors inline-flex items-center gap-1.5"
                    >
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 pt-6 border-t border-line">
              <Link
                to="/"
                className="inline-block border border-copper bg-copper px-5 py-2 font-mono text-xs font-semibold text-black uppercase tracking-wider hover:bg-copper-strong transition-colors cursor-pointer"
              >
                Return Home ↗
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
