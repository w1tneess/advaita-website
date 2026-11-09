import { useState } from 'react'
import { Link } from 'react-router'
import InkField from '@/components/features/ink/InkField.jsx'
import PenStroke from '@/components/features/ink/PenStroke.jsx'

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
 * Around it: his handle, his motto, his own words.
 */
export default function HeroSection({ profile = {} }) {
  const [paused, setPaused] = useState(false)
  const [first = 'Advaita', ...rest] = (profile?.name || 'Advaita Chandra').split(' ')
  const last = rest.join(' ') || 'Chandra'
  const splitAt = first.toLowerCase().startsWith('a') ? 1 : 0

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <InkField paused={paused} className="-z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_58%_46%_at_50%_42%,var(--color-canvas)_32%,transparent_80%)]" />

      <div className="shell folio min-h-[100svh] gap-y-10 pt-24 pb-20 lg:pt-24">
        <div className="folio-body self-center [container-type:inline-size]">
          <h1 id="hero-heading" className="group/name">
            <span className="sr-only">{first} {last}</span>
            <span aria-hidden="true" className="name-word block whitespace-nowrap text-[clamp(4.5rem,29cqi,24rem)] font-medium leading-[0.8] tracking-[-0.065em] -ml-[0.06em]">
              {splitAt > 0 && (
                <span className="name-part name-a relative inline-block">
                  {first.slice(0, splitAt)}
                  <span className="name-note left-[0.04em]">
                    <PenStroke seed={2} auto width="0.66em" className="pen-late !h-[0.06em] max-w-none" />
                    <span className="mark-label" data-ink="fact">a-: not</span>
                  </span>
                </span>
              )}
              <span className="name-part name-rest relative inline-block">
                {first.slice(splitAt)}
                {splitAt > 0 && (
                  <span className="name-note left-[0.04em]">
                    <PenStroke seed={0} auto width="2.4em" className="pen-late !h-[0.06em] max-w-none" />
                    <span className="mark-label" data-ink="fact">dvaita: two</span>
                  </span>
                )}
              </span>
            </span>
            <span aria-hidden="true" className="settle mt-[clamp(3rem,6.5cqi,5rem)] flex items-baseline justify-between gap-6" style={{ '--settle-delay': '450ms' }}>
              <span className="text-[clamp(2.25rem,8cqi,7rem)] font-medium leading-none tracking-[-0.05em] text-muted">{last}</span>
              <span className="hidden text-right text-[14px] leading-snug text-text-3 sm:block">
                Sanskrit <span className="text-muted">अद्वैत</span>
                <br />
                “not two”
              </span>
            </span>
          </h1>

          <div className="settle mt-10 max-w-[44rem]" style={{ '--settle-delay': '600ms' }}>
            <p className="text-[length:var(--text-xl)] leading-[1.35] tracking-[-0.015em]">
              Student and developer from India, somewhere between software, philosophy and history.
              Building small things, keeping the questions open.
            </p>
            <p className="mt-4 text-[length:var(--text-lg)] leading-relaxed text-muted">
              I{' '}
              {VERBS.map(([verb, to], i) => (
                <span key={verb}>
                  <Link to={to} className="pen-link inline-block py-1 text-ink [background-size:100%_1px] hover:text-accent">{verb}</Link>
                  {i < VERBS.length - 2 ? ', ' : i === VERBS.length - 2 ? ' and ' : '.'}
                </span>
              ))}
            </p>
          </div>

          {/* Signature row: who he is online, the line he signs with, and the pens' switch. */}
          <div className="settle mt-10 grid gap-x-10 gap-y-6 border-t border-line pt-6 text-[15px] leading-snug text-muted sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" style={{ '--settle-delay': '750ms' }}>
            <div>
              <p className="mark-label" data-ink="fact">online I’m w1tneess</p>
              <p className="mt-2 max-w-[17rem]">Read it as “witness”. Same person on GitHub and X.</p>
            </div>
            <div>
              <p className="mark-label text-ink">ex duris gloria</p>
              <p className="mt-2">Latin: from hardship, glory.</p>
            </div>
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              className="pen-link hidden items-center gap-2 self-end justify-self-start py-1 text-[13px] text-text-3 hover:text-ink motion-safe:lg:inline-flex sm:justify-self-end"
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${paused ? 'bg-text-3' : 'bg-accent'}`} />
              {paused ? 'Let the pens draw' : 'Pause the pens'}
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
