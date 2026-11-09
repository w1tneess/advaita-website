import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { CONTACT_EMAIL } from '@/config/site.js'

/** Closing poster: the invitation the whole notebook is built around. */
export default function CorrespondenceSection() {
  return (
    <section className="shell py-28 lg:py-44 border-t border-line" aria-labelledby="write-heading">
      <div data-reveal>
      <p className="mark-label" data-ink="opinion">a correction is welcome</p>
      <h2
        id="write-heading"
        className="mt-6 text-[length:var(--text-hero)] leading-[0.98] tracking-[-0.05em] -ml-[0.04em] max-w-[14ch]"
      >
        Tell me where I’m <span className="ink" data-ink="opinion">wrong</span>.
      </h2>
      </div>
      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4" data-reveal style={{ '--i': 2 }}>
        <Link to="/contact" className="btn-ink">
          <span>Write a note</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        {CONTACT_EMAIL && (
          <a href={`mailto:${CONTACT_EMAIL}`} className="pen-link text-[15px] text-muted hover:text-ink">
            {CONTACT_EMAIL}
          </a>
        )}
      </div>
    </section>
  )
}
