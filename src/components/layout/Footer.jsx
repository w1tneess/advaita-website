import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'

import { useContent } from '@/lib/content.jsx'
import { CONTACT_EMAIL } from '@/config/site.js'
import { getRoutePreloadProps } from '@/lib/preload'
import InkSketch from '@/components/features/ink/InkSketch.jsx'

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
    <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden="true">
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

const INDEX = [
  ['/philosophy', 'Philosophy', 'what I am reading'],
  ['/photography', 'Photography', 'what caught my eye'],
  ['/blog', 'Writing', 'longer pieces'],
  ['/projects', 'Projects', 'things I built'],
  ['/about', 'About', 'who I am'],
  ['/contact', 'Contact', 'write to me'],
]

const PENS = [
  ['fact', 'Blue pencil'],
  ['analysis', 'Highlighter'],
  ['opinion', 'Red pen'],
  ['limitation', 'Graphite'],
]

const NOTE = 'mark-label !text-[clamp(1rem,0.9rem+0.5vw,1.375rem)] absolute left-[0.04em] top-full mt-3 whitespace-nowrap tracking-normal opacity-0 transition-opacity duration-500 group-hover/foot:opacity-100'
const PART = 'relative inline-block transition-transform duration-700 ease-[var(--ease-soft)]'

/**
 * The last page of the notebook, left open: visitors can write on it with any of the four
 * inks (the ink dries and fades), every page of the site is indexed in large type with its
 * margin note, and the name it is kept under parts into "not two" when pointed at.
 */
export default function Footer() {
  const { profile, publicSocialLinks } = useContent()
  const social = publicSocialLinks.filter((l) => l.url && l.kind !== 'email')
  const year = new Date().getFullYear()
  const name = profile?.name || 'Advaita Chandra'
  const [first, ...rest] = name.split(' ')
  const time = useIndiaTime()
  const pageRef = useRef(null)
  const [pen, setPen] = useState('opinion')
  const [clears, setClears] = useState(0)

  return (
    <footer ref={pageRef} className="relative isolate mt-auto overflow-hidden border-t border-line pt-16 pb-8 lg:pt-20">
      <InkSketch targetRef={pageRef} ink={pen} clearSignal={clears} className="-z-10" />

      <div className="shell grid gap-x-10 gap-y-14 lg:grid-cols-12">
        {/* Index: every page in large type, with its margin note on hover. */}
        <nav aria-label="Footer" className="lg:col-span-7">
          <p className="mark-label" data-ink="opinion">end of the page</p>
          <ul className="mt-6">
            {INDEX.map(([to, label, note]) => (
              <li key={to} className="border-b border-line first:border-t">
                <Link to={to} {...getRoutePreloadProps(to)} className="group flex items-baseline justify-between gap-6 py-3">
                  <span className="nav-swipe text-[clamp(1.75rem,1.2rem+2vw,3rem)] leading-none tracking-[-0.04em] text-muted transition-colors group-hover:text-ink group-hover:[background-size:100%_0.45em] group-focus-visible:text-ink group-focus-visible:[background-size:100%_0.45em]">
                    {label}
                  </span>
                  <span className="mark-label !text-[1.25rem] text-text-3 opacity-0 -translate-x-2 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                    {note}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* The open page: pick a pen and write on it. Then the clock and the ways to reach him. */}
        <div className="flex flex-col gap-10 lg:col-span-4 lg:col-start-9">
          <div className="hidden pointer-fine:block">
            <p className="text-[length:var(--text-2xl)] leading-tight tracking-[-0.03em]">This page is blank. Write on it.</p>
            <p className="mt-2 text-[15px] text-muted">Move to draw, hold to highlight. The ink dries in a few seconds.</p>
            <div role="radiogroup" aria-label="Pen" className="mt-5 flex flex-wrap items-center gap-2">
              {PENS.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={pen === key}
                  onClick={() => setPen(key)}
                  className={`flex h-9 items-center gap-2 rounded-[6px] border px-3 text-[13px] transition-colors ${pen === key ? 'border-ink text-ink' : 'border-line text-muted hover:border-line-strong hover:text-ink'}`}
                >
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--color-${key})` }} />
                  {label}
                </button>
              ))}
              <button type="button" onClick={() => setClears((c) => c + 1)} className="pen-link ml-1 py-1 text-[13px] text-text-3 hover:text-ink">
                Clear
              </button>
            </div>
          </div>

          {time && (
            <div className="flex items-center gap-4">
              <PenClock h={time.h} m={time.m} />
              <p className="text-[15px] leading-snug">
                <time className="tabular-nums text-ink">{time.label}</time>
                <span className="block text-muted">in {profile?.location || 'West Bengal, India'}</span>
              </p>
            </div>
          )}

          <ul className="space-y-1 text-[15px]">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="pen-link inline-block py-1 text-ink">{CONTACT_EMAIL}</a>
            </li>
            {social.map((l) => (
              <li key={l.id || l.label}>
                <a href={l.url} target="_blank" rel="me noopener noreferrer" className="group inline-flex items-baseline gap-2 py-1 text-muted hover:text-ink">
                  <span className="pen-link">{l.label}</span>
                  {l.handle && <span className="text-text-3 group-hover:text-muted">@{l.handle}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* The name it is kept under: point at it and it parts into a- and dvaita, "not two". */}
      <div className="shell mt-20 [container-type:inline-size]" aria-hidden="true">
        <p className="group/foot w-fit whitespace-nowrap text-[clamp(2.5rem,13.4cqi,15rem)] font-medium leading-[0.8] tracking-[-0.065em] select-none">
          <span className={`${PART} group-hover/foot:-translate-x-[0.1em]`}>
            {first.slice(0, 1)}
            <span className={NOTE} data-ink="fact">a-: not</span>
          </span>
          <span className={`${PART} group-hover/foot:translate-x-[0.1em]`}>
            {first.slice(1)}
            <span className={NOTE} data-ink="fact">dvaita: two</span>
          </span>{' '}
          <span className={`${PART} text-muted group-hover/foot:translate-x-[0.1em]`}>{rest.join(' ')}</span>
        </p>
      </div>

      <div className="shell mt-16 flex flex-col gap-3 border-t border-line pt-5 pr-16 text-[13px] text-text-3 sm:flex-row sm:items-center sm:justify-between lg:pr-24">
        <p className="flex flex-wrap items-baseline gap-x-3 tabular-nums">
          <span>&copy; {year} {name}</span>
          <span className="mark-label !text-[1.05rem] text-muted">ex duris gloria</span>
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li><Link to="/privacy" className="inline-block py-1 transition-colors hover:text-ink">Privacy</Link></li>
          <li><Link to="/terms" className="inline-block py-1 transition-colors hover:text-ink">Terms</Link></li>
          <li><a href="https://support.advaitachandra.in" target="_blank" rel="noopener noreferrer" className="inline-block py-1 transition-colors hover:text-ink">Support my work</a></li>
        </ul>
      </div>
    </footer>
  )
}
