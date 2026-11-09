import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import InkedText from '@/components/features/ink/InkedText.jsx'
import InkField from '@/components/features/ink/InkField.jsx'
import { InkKeys } from '@/components/features/ink/InkLens.jsx'
import { formatDate, isoDateAttr } from '@/lib/format'

const RULE = 'On this site I try to separate four things: facts from sources, my inferences, my opinions, and things I do not know.'

/**
 * First screen: the rule the whole notebook follows, set as the headline, on a page that
 * four pens keep marking. The bottom strip carries real counts from the content.
 */
export default function HeroSection({ profile = {}, notes = [], projects = [] }) {
  const rule = profile?.epistemicNote || RULE
  const latest = notes[0]

  return (
    <section className="relative isolate overflow-hidden" aria-labelledby="hero-heading">
      <InkField remarkSelector="#hero-heading .ink" className="-z-10" />
      {/* Calm the marks behind the reading column so the headline always sits on quiet paper. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_46%_42%,var(--color-canvas)_30%,transparent_78%)]" />

      <div className="shell folio min-h-[100svh] grid-rows-[1fr_auto] pt-24 lg:pt-28">
        <div className="folio-margin mb-10 self-center lg:mb-0 lg:self-start lg:pt-[16svh] settle" style={{ '--settle-delay': '80ms' }}>
          <p className="mark-label" data-ink="analysis">a public notebook</p>
          <p className="mt-3 max-w-[15rem] text-[15px] leading-snug text-muted">
            Kept by a student in {profile?.location || 'West Bengal, India'}. Philosophy, history, code and photographs.
          </p>
        </div>

        <div className="folio-body self-center">
          <h1
            id="hero-heading"
            className="text-[length:var(--text-hero)] leading-[1.02] tracking-[-0.045em] -ml-[0.04em] max-w-[16ch] sm:max-w-[18ch]"
          >
            <InkedText text={rule} />
          </h1>

          <InkKeys variant="hero" className="settle mt-12 lg:mt-14" />

          <div className="settle mt-10 flex flex-wrap items-center gap-3" style={{ '--settle-delay': '200ms' }}>
            <Link to="/philosophy" className="btn-ink">
              <span>Read the notes</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/projects" className="btn-ink is-ghost">
              <span>See the projects</span>
            </Link>
          </div>
        </div>

        {/* What is in the notebook right now; every value comes from the content. */}
        <dl className="col-span-full mt-12 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line py-6 text-[14px] sm:grid-cols-4 lg:grid-cols-12">
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
              {latest ? (
                <Link to={`/philosophy/${latest.slug}`} className="pen-link text-ink">{latest.title}</Link>
              ) : (
                <span className="text-muted">None yet</span>
              )}
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
