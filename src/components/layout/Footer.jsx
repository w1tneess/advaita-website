import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { useContent } from '@/lib/content.jsx'
import { CONTACT_EMAIL } from '@/config/site.js'
import { getRoutePreloadProps } from '@/lib/preload'

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

// One inline link in the colophon: pen underline at rest, ink on hover.
function L({ to, href, children }) {
  const cls = 'text-ink underline decoration-line-strong decoration-1 underline-offset-[0.2em] transition-colors duration-200 hover:text-accent hover:decoration-accent'
  if (to) return <Link to={to} {...getRoutePreloadProps(to)} className={cls}>{children}</Link>
  return <a href={href} className={cls} {...(href?.startsWith('http') ? { target: '_blank', rel: 'me noopener noreferrer' } : {})}>{children}</a>
}

/**
 * The colophon: the last page of the notebook, written as one short paragraph in his voice,
 * with every way onward set inside the sentence. Then a single line of small print.
 */
export default function Footer() {
  const { profile, publicSocialLinks } = useContent()
  const byPlatform = (p) => publicSocialLinks.find((l) => l.url && l.platform === p)
  const github = byPlatform('GitHub')
  const x = byPlatform('X')
  const instagram = byPlatform('Instagram')
  const year = new Date().getFullYear()
  const name = profile?.name || 'Advaita Chandra'
  const time = useIndiaTime()

  return (
    <footer className="mt-auto border-t border-line pt-16 pb-8 lg:pt-20">
      <div className="shell folio gap-y-8" data-reveal>
        <div className="folio-margin flex items-start gap-4 lg:flex-col lg:gap-5">
          {time && <PenClock h={time.h} m={time.m} />}
          <p className="mark-label" data-ink="opinion">end of the page</p>
        </div>

        <p className="folio-body max-w-[46rem] text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] leading-[1.45] tracking-[-0.02em] text-muted">
          This notebook is kept by <span className="text-ink">{name}</span> in {profile?.location || 'West Bengal, India'}
          {time ? <>, where it’s <time className="text-ink tabular-nums">{time.label}</time> right now</> : null}. It holds{' '}
          <L to="/philosophy">reading notes</L>, <L to="/photography">photographs</L>, <L to="/blog">longer writing</L> and{' '}
          <L to="/projects">things I built</L>, with a little <L to="/about">about me</L>. If something here is wrong,{' '}
          <L to="/contact">tell me</L> or write to <L href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</L>.
          {(github || x || instagram) && (
            <>
              {' '}Elsewhere I’m{' '}
              {github && <L href={github.url}>@{github.handle}</L>}
              {github && x && ' on GitHub, '}
              {x && <L href={x.url}>@{x.handle}</L>}
              {x && ' on X'}
              {instagram && <>{' '}and <L href={instagram.url}>@{instagram.handle}</L> on Instagram</>}.
            </>
          )}
        </p>
      </div>

      <div className="shell mt-14 flex flex-col gap-3 border-t border-line pt-5 text-[13px] text-text-3 sm:flex-row sm:items-center sm:justify-between">
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
