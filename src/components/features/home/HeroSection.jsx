import { Link } from 'react-router'
import InkField from '@/components/features/ink/InkField.jsx'
import PenStroke from '@/components/features/ink/PenStroke.jsx'
import { formatDate, isoDateAttr } from '@/lib/format'

// His own line, with each verb leading to the part of the notebook where it happens.
const VERBS = [
  ['notice', '/about'],
  ['think', '/philosophy'],
  ['build', '/projects'],
  ['photograph', '/photography'],
  ['read', '/philosophy'],
  ['write', '/blog'],
]

/**
 * First screen: Advaita, by name. "Advaita" is Sanskrit for "not two"; the word arrives
 * as two parts (a- and dvaita) that close into one, with the etymology pencilled underneath.
 * Around it: his handle, his motto, his own words. Every value in the strip comes from content.
 */
export default function HeroSection({ profile = {}, notes = [], projects = [] }) {
  const latest = notes[0]
  const [first = 'Advaita', ...rest] = (profile?.name || 'Advaita Chandra').split(' ')
  const last = rest.join(' ') || 'Chandra'
  const splitAt = first.toLowerCase().startsWith('a') ? 1 : 0

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <InkField className="-z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_58%_46%_at_50%_42%,var(--color-canvas)_32%,transparent_80%)]" />

      <div className="shell folio min-h-[100svh] grid-rows-[1fr_auto] gap-y-10 pt-24 lg:pt-28">
        {/* Margin: who he is online, and the line he signs with. */}
        <aside className="folio-margin order-2 self-end text-[15px] leading-snug text-muted lg:order-none lg:pb-4 settle" style={{ '--settle-delay': '1100ms' }}>
          <p className="mark-label" data-ink="fact">online I’m w1tneess</p>
          <p className="mt-2 max-w-[15rem]">Read it as “witness”. Same person on GitHub and X.</p>
          <p className="mark-label mt-8 text-ink">ex duris gloria</p>
          <p className="mt-2 max-w-[15rem]">Latin: from hardship, glory.</p>
        </aside>

        <div className="folio-body self-center [container-type:inline-size]">
          <h1 id="hero-heading" className="group/name">
            <span className="sr-only">{first} {last}</span>
            <span aria-hidden="true" className="name-word block whitespace-nowrap text-[clamp(4.5rem,32cqi,26rem)] font-medium leading-[0.8] tracking-[-0.065em] -ml-[0.06em]">
              {splitAt > 0 && (
                <span className="name-part name-a relative inline-block">
                  {first.slice(0, splitAt)}
                  <span className="name-note left-[0.08em]">
                    <PenStroke seed={2} auto className="pen-late w-[1.2em]" />
                    <span className="mark-label" data-ink="fact">a-: not</span>
                  </span>
                </span>
              )}
              <span className="name-part name-rest relative inline-block">
                {first.slice(splitAt)}
                {splitAt > 0 && (
                  <span className="name-note left-[0.04em]">
                    <PenStroke seed={0} auto className="pen-late w-[3.6em]" />
                    <span className="mark-label" data-ink="fact">dvaita: two</span>
                  </span>
                )}
              </span>
            </span>
            <span aria-hidden="true" className="settle mt-[clamp(3.5rem,9cqi,7rem)] flex items-baseline justify-between gap-6" style={{ '--settle-delay': '700ms' }}>
              <span className="text-[clamp(2.25rem,9cqi,8rem)] font-medium leading-none tracking-[-0.05em] text-muted">{last}</span>
              <span className="hidden text-right text-[14px] leading-snug text-text-3 sm:block">
                Sanskrit <span className="text-muted">अद्वैत</span>
                <br />
                “not two”
              </span>
            </span>
          </h1>

          <div className="settle mt-12 max-w-[44rem]" style={{ '--settle-delay': '900ms' }}>
            <p className="text-[length:var(--text-xl)] leading-[1.35] tracking-[-0.015em]">
              Student and developer from India, somewhere between software, philosophy and history.
              Building small things, keeping the questions open.
            </p>
            <p className="mt-6 text-[length:var(--text-lg)] leading-relaxed text-muted">
              I{' '}
              {VERBS.map(([verb, to], i) => (
                <span key={verb}>
                  <Link to={to} className="pen-link text-ink [background-size:100%_1px] hover:text-accent">{verb}</Link>
                  {i < VERBS.length - 2 ? ', ' : i === VERBS.length - 2 ? ' and ' : '.'}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* What is in the notebook right now. */}
        <dl className="col-span-full order-3 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line py-6 text-[14px] sm:grid-cols-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <dt className="text-text-3">Notes</dt>
            <dd className="mt-1 text-ink tabular-nums">{notes.length}</dd>
          </div>
          <div className="lg:col-span-2">
            <dt className="text-text-3">Projects</dt>
            <dd className="mt-1 text-ink tabular-nums">{projects.length}</dd>
          </div>
          <div className="col-span-2 min-w-0 sm:col-span-1 lg:col-span-4">
            <dt className="text-text-3">Latest note</dt>
            <dd className="mt-1 truncate">
              {latest ? <Link to={`/philosophy/${latest.slug}`} className="pen-link text-ink">{latest.title}</Link> : <span className="text-muted">None yet</span>}
            </dd>
          </div>
          <div className="hidden sm:block lg:col-span-3 lg:text-right">
            <dt className="text-text-3">Written</dt>
            <dd className="mt-1 text-ink tabular-nums">
              {latest?.published_at ? <time dateTime={isoDateAttr(latest.published_at)}>{formatDate(latest.published_at)}</time> : 'Not yet'}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
