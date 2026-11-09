import { Link } from 'react-router'

import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { getRoutePreloadProps } from '@/lib/preload'

/** Footer as the last page of the notebook: the name, where things are, the small print. */
export default function Footer() {
  const { profile, publicSocialLinks } = useContent()
  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()
  const name = profile?.name || 'Advaita Chandra'
  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-line pt-20 pb-28 md:pb-24">
      <div className="shell">
        <div className="folio gap-y-12">
          <nav className="folio-margin" aria-label="Footer">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} {...getRoutePreloadProps(item.path)} className="pen-link inline-block py-1 text-[15px] text-muted hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-4">
            <ul className="space-y-2">
              {configured.map((link) => (
                <li key={link.id || link.label}>
                  <a
                    href={hrefFor(link)}
                    className="pen-link inline-block min-w-6 py-1 text-[15px] text-muted hover:text-ink"
                    {...(link.kind === 'email' ? {} : { target: '_blank', rel: 'me noopener noreferrer' })}
                  >
                    {link.kind === 'email' ? link.url : link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 text-[15px] text-muted">
            <p>{profile?.location || 'West Bengal, India'}</p>
            <p className="mt-2 max-w-sm leading-relaxed">
              Corrections, questions and book recommendations are always welcome.
            </p>
          </div>
        </div>

        <div className="relative" aria-hidden="true" data-reveal>
        <p
          className="mt-20 text-[clamp(2rem,12.6vw,15rem)] font-medium leading-[0.86] tracking-[-0.06em] text-ink -ml-[0.05em] select-none whitespace-nowrap"
        >
          {name}
        </p>
        <p className="mt-4 flex gap-8 text-text-3">
          <span className="mark-label" data-ink="fact">a-: not</span>
          <span className="mark-label" data-ink="fact">dvaita: two</span>
          <span className="mark-label text-muted">ex duris gloria</span>
        </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-text-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular-nums">&copy; {year} {name}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link to="/privacy" className="inline-block py-1 hover:text-ink transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="inline-block py-1 hover:text-ink transition-colors">Terms</Link></li>
            <li><a href="https://support.advaitachandra.in" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-ink transition-colors">Support</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
