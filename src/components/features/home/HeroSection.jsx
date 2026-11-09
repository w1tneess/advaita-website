import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import InkedText from '@/components/features/ink/InkedText.jsx'
import { InkKeys } from '@/components/features/ink/InkLens.jsx'

const RULE = 'On this site I try to separate four things: facts from sources, my inferences, my opinions, and things I do not know.'

export default function HeroSection({ profile = {} }) {
  const rule = profile?.epistemicNote || RULE

  return (
    <section className="shell folio min-h-[100svh] content-center pt-28 pb-16 lg:pt-32">
      <div className="folio-margin mb-10 lg:mb-0 lg:pt-4 settle" style={{ '--settle-delay': '80ms' }}>
        <p className="max-w-[15rem] text-[15px] leading-snug text-muted">
          A public notebook kept by a student in {profile?.location || 'West Bengal, India'}
        </p>
      </div>

      <div className="folio-body">
        <h1 className="settle text-[length:var(--text-hero)] leading-[1.02] tracking-[-0.045em] -ml-[0.04em] max-w-[16ch] sm:max-w-[18ch]">
          <InkedText text={rule} idle />
        </h1>

        <InkKeys variant="hero" className="settle mt-12 lg:mt-16" />

        <div className="settle mt-12 flex flex-wrap items-center gap-3" style={{ '--settle-delay': '200ms' }}>
          <Link to="/philosophy" className="btn-ink">
            <span>Read the notes</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/projects" className="btn-ink is-ghost">
            <span>See the projects</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
