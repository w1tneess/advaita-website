import { Link, useLocation } from 'react-router'
import Seo from '@/components/meta/Seo.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { getRoutePreloadProps } from '@/lib/preload'

/** 404 in the only ink that fits: something I do not know. */
export default function NotFound() {
  const { pathname } = useLocation()
  const displayPath = pathname && pathname.length > 80 ? `${pathname.slice(0, 80)}…` : pathname || '/404'

  return (
    <>
      <Seo title="Page not found" description="This page does not exist on this site." path={pathname || '/404'} noindex />

      <section className="shell folio min-h-[80svh] content-center pt-32 pb-24">
        <div className="folio-margin mb-8 text-[15px] text-muted lg:mb-0 lg:pt-4">
          <p className="tabular-nums">404</p>
          <p className="mt-1 break-all text-text-3">{displayPath}</p>
        </div>

        <div className="folio-body" data-ink="limitation">
          <p className="mark-label" data-ink="limitation">unknown</p>
          <h1 className="mt-4 text-[length:var(--text-hero)] leading-[1] tracking-[-0.05em] -ml-[0.04em] max-w-[14ch]">
            I have <span className="ink" data-ink="limitation">no source</span> for this page.
          </h1>
          <p className="mt-8 max-w-lg text-[length:var(--text-lg)] leading-relaxed text-muted">
            It may have moved, or it never existed. These pages do:
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.path}>
                <Link to={item.path} {...getRoutePreloadProps(item.path)} className="pen-link text-[17px] text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
