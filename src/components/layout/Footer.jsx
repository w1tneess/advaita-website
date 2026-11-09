import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { CONTACT_EMAIL } from '@/config/site.js'
import { getRoutePreloadProps } from '@/lib/preload'
import PenStroke from '@/components/features/ink/PenStroke.jsx'

// His clock, so a reader can tell whether a reply is likely soon. Updated once a minute.
function useIndiaTime() {
  const read = () => {
    const now = new Date()
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' })
        .formatToParts(now)
        .map((p) => [p.type, p.value]),
    )
    const h = Number(parts.hour) % 24
    const m = Number(parts.minute)
    const label = `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`
    return { h, m, label }
  }
  const [time, setTime] = useState(null)
  useEffect(() => {
    setTime(read())
    const id = setInterval(() => setTime(read()), 60_000)
    return () => clearInterval(id)
  }, [])
  return time
}

/** A small hand-drawn clock face showing his local time. */
function PenClock({ h, m }) {
  const hourDeg = ((h % 12) + m / 60) * 30
  const minDeg = m * 6
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0" aria-hidden="true">
      <path d="M32 3 C 50 2, 62 15, 61 33 C 60 50, 47 62, 31 61 C 14 60, 3 48, 3 31 C 4 15, 16 4, 34 4" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
      {[0, 90, 180, 270].map((d) => (
        <line key={d} x1="32" y1="8" x2="32" y2="11" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${d} 32 32)`} />
      ))}
      <line x1="32" y1="32" x2="32" y2="18" stroke="var(--color-ink)" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${hourDeg} 32 32)`} />
      <line x1="32" y1="32" x2="32" y2="11" stroke="var(--color-opinion)" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${minDeg} 32 32)`} />
      <circle cx="32" cy="32" r="2" fill="var(--color-ink)" />
    </svg>
  )
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
        {/* Sign-off: the whole sentence is the way to write to him. */}
        <div className="folio gap-y-10" data-reveal>
          <div className="folio-margin">
            <p className="mark-label" data-ink="opinion">end of the page</p>
            <PenStroke seed={2} className="mt-2" />
            <p className="mt-4 max-w-[15rem] text-[15px] leading-snug text-muted">Thanks for reading this far.</p>
          </div>

          <div className="lg:col-span-6 lg:col-start-4">
            <Link to="/contact" {...getRoutePreloadProps('/contact')} className="group block">
              <span className="block text-[clamp(2.75rem,1.2rem+5.6vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.05em]">
                Tell me where I’m{' '}
                <span className="ink is-lifted transition-[background-size] duration-500 group-hover:[background-size:100%_0.26em] group-focus-visible:[background-size:100%_0.26em]" data-ink="opinion">
                  wrong
                </span>
                .
              </span>
              <span className="mt-8 inline-flex items-center gap-2 text-[16px] text-muted transition-colors group-hover:text-ink">
                Write a note
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`} className="pen-link mt-3 inline-block py-1 text-[16px] text-muted hover:text-ink">
              or email {CONTACT_EMAIL}
            </a>
          </div>

          {time && (
            <div className="flex items-center gap-5 self-end text-ink lg:col-span-3 lg:col-start-10 lg:justify-end">
              <PenClock h={time.h} m={time.m} />
              <div className="text-[15px] leading-snug">
                <p className="tabular-nums">
                  It’s <time>{time.label}</time> for me
                </p>
                <p className="text-muted">in {profile?.location || 'West Bengal, India'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Where everything is */}
        <div className="folio mt-24 gap-y-10 border-t border-line pt-10" data-reveal style={{ '--i': 1 }}>
          <div className="folio-margin text-[15px] text-muted">
            <p className="text-ink">{profile?.location || 'West Bengal, India'}</p>
            <p className="mt-1">India Standard Time</p>
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
          <p className="mt-1 flex gap-5 sm:hidden">
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
