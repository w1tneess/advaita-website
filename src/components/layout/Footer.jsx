import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { CONTACT_EMAIL } from '@/config/site.js'
import { getRoutePreloadProps } from '@/lib/preload'
import PenStroke from '@/components/features/ink/PenStroke.jsx'

// His clock, so a reader knows whether a reply is likely soon. Updated once a minute.
function useIndiaTime() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
      .format(new Date())
      .replace(/\s?([ap])\.?m\.?/i, (_, p) => ` ${p.toLowerCase()}m`)
  const [time, setTime] = useState(null)
  useEffect(() => {
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 60_000)
    return () => clearInterval(id)
  }, [])
  return time
}

/** The notebook's last page: a sign-off, where everything is, and the name it is kept under. */
export default function Footer() {
  const { profile, publicSocialLinks } = useContent()
  const elsewhere = publicSocialLinks.filter((link) => link.url && link.kind !== 'email')
  const year = new Date().getFullYear()
  const name = profile?.name || 'Advaita Chandra'
  const [first, ...rest] = name.split(' ')
  const time = useIndiaTime()

  return (
    <footer className="mt-auto border-t border-line pt-24 pb-10 lg:pt-32">
      <div className="shell">
        {/* Sign-off */}
        <div className="folio gap-y-8" data-reveal>
          <div className="folio-margin">
            <p className="mark-label" data-ink="opinion">end of the page</p>
            <PenStroke seed={2} className="mt-2" />
          </div>
          <div className="folio-body">
            <p className="text-[length:var(--text-5xl)] leading-[1.02] tracking-[-0.045em] max-w-[16ch]">
              Thanks for reading. If something here is wrong, tell me.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link to="/contact" {...getRoutePreloadProps('/contact')} className="btn-ink">
                <span>Write a note</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="pen-link py-1 text-[15px] text-muted hover:text-ink">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* Where everything is */}
        <div className="folio mt-24 gap-y-10 border-t border-line pt-10" data-reveal style={{ '--i': 1 }}>
          <div className="folio-margin text-[15px] text-muted">
            <p className="text-ink">{profile?.location || 'West Bengal, India'}</p>
            {time && (
              <p className="mt-1 tabular-nums">
                It’s <time>{time}</time> here
              </p>
            )}
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-4">
            <p className="mark-label !text-[1.125rem] text-text-3">pages</p>
            <ul className="mt-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} {...getRoutePreloadProps(item.path)} className="pen-link inline-block py-1 text-[15px] text-muted hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-7">
            <p className="mark-label !text-[1.125rem] text-text-3">elsewhere</p>
            <ul className="mt-3 space-y-1">
              {elsewhere.map((link) => (
                <li key={link.id || link.label}>
                  <a href={link.url} target="_blank" rel="me noopener noreferrer" className="pen-link inline-block py-1 text-[15px] text-muted hover:text-ink">
                    {link.label}
                    {link.handle && <span className="text-text-3"> @{link.handle}</span>}
                  </a>
                </li>
              ))}
              <li>
                <a href="https://support.advaitachandra.in" target="_blank" rel="noopener noreferrer" className="pen-link inline-block py-1 text-[15px] text-muted hover:text-ink">
                  Support my work
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-10 text-[15px] leading-relaxed text-muted">
            <p className="mark-label !text-[1.125rem] text-text-3">kept by</p>
            <p className="mt-3">A student and developer building small things and keeping the questions open.</p>
          </div>
        </div>

        {/* The name it is kept under, with its meaning pencilled beneath. */}
        <div className="mt-24 group/name [container-type:inline-size]" aria-hidden="true" data-reveal style={{ '--i': 2 }}>
          <p className="whitespace-nowrap text-[clamp(2.5rem,13.4cqi,15rem)] font-medium leading-[0.8] tracking-[-0.065em] -ml-[0.05em] select-none">
            <span className="name-part relative inline-block">
              {first.slice(0, 1)}
              <span className="absolute left-[0.04em] top-full mt-3 hidden whitespace-nowrap sm:block tracking-normal mark-label !text-[clamp(1rem,0.9rem+0.5vw,1.375rem)]" data-ink="fact">a-: not</span>
            </span>
            <span className="name-part relative inline-block">
              {first.slice(1)}
              <span className="absolute left-[0.04em] top-full mt-3 hidden whitespace-nowrap sm:block tracking-normal mark-label !text-[clamp(1rem,0.9rem+0.5vw,1.375rem)]" data-ink="fact">dvaita: two</span>
            </span>
            <span className="text-muted"> {rest.join(' ')}</span>
          </p>
          <p className="mt-3 flex gap-5 sm:hidden">
            <span className="mark-label !text-[1.125rem]" data-ink="fact">a-: not</span>
            <span className="mark-label !text-[1.125rem]" data-ink="fact">dvaita: two</span>
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-text-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="tabular-nums">&copy; {year} {name}. <span className="mark-label !text-[1rem] text-muted">ex duris gloria</span></p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><Link to="/privacy" className="inline-block py-1 hover:text-ink transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="inline-block py-1 hover:text-ink transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
