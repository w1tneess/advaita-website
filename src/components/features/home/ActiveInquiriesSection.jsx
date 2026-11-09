import { Link } from 'react-router'
import PenStroke from '@/components/features/ink/PenStroke.jsx'

/** Who I am reading: the names set as one sentence, then why, in my own words. */
export default function ActiveInquiriesSection({ philosophy = {} }) {
  const thinkers = [...(philosophy.thinkers || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  if (!thinkers.length) return null

  const names = thinkers.map((t) => t.name)
  const sentence = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}.` : `${names[0]}.`

  return (
    <section id="inquiries" className="shell folio py-24 lg:py-36 border-t border-line" aria-labelledby="reading-heading">
      <div className="folio-margin mb-6 lg:mb-0" data-reveal>
        <h2 id="reading-heading" className="text-[length:var(--text-2xl)] tracking-[-0.03em]">Reading now</h2>
        <PenStroke seed={2} className="mt-1" />
      </div>

      <div className="folio-body">
        <p className="text-[length:var(--text-3xl)] sm:text-[length:var(--text-5xl)] leading-[1.05] tracking-[-0.04em] text-ink max-w-[20ch]" data-reveal>
          {sentence}
        </p>

        <dl className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {thinkers.map((t, i) => (
            <div key={t.id || t.name} className="border-t border-line pt-4" data-reveal style={{ '--i': i }}>
              <dt className="text-[15px] text-ink">{t.name}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-muted">{t.description || t.role}</dd>
            </div>
          ))}
        </dl>

        <Link to="/philosophy" className="pen-link mt-12 inline-block text-[15px] text-ink">
          Notes on these books
        </Link>
      </div>
    </section>
  )
}
