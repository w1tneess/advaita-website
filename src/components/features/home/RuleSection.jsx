import InkedText from '@/components/features/ink/InkedText.jsx'
import { InkKeys } from '@/components/features/ink/InkLens.jsx'
import PenStroke from '@/components/features/ink/PenStroke.jsx'

const RULE = 'On this site I try to separate four things: facts from sources, my inferences, my opinions, and things I do not know.'

/** How the notebook is kept: his rule, inked, with the lens to read by one kind of claim. */
export default function RuleSection({ profile = {} }) {
  return (
    <section className="shell folio border-t border-line py-24 lg:py-36" aria-labelledby="rule-heading">
      <div className="folio-margin mb-8 lg:mb-0" data-reveal>
        <p className="text-[length:var(--text-2xl)] tracking-[-0.03em]">How I keep this notebook</p>
        <PenStroke seed={1} className="mt-1" />
        <p className="mt-3 max-w-[16rem] text-[15px] leading-snug text-muted">
          Pick an ink and the page shows only that kind of claim
        </p>
      </div>
      <div className="folio-body" data-reveal style={{ '--i': 1 }}>
        <h2 id="rule-heading" className="text-[length:var(--text-5xl)] leading-[1.04] tracking-[-0.04em] max-w-[20ch]">
          <InkedText text={profile?.epistemicNote || RULE} />
        </h2>
        <InkKeys variant="hero" className="mt-12" />
      </div>
    </section>
  )
}
