import { Link } from 'react-router'
import { ArrowDown, ArrowUpRight } from 'lucide-react'

const BRANCHES = [
  { label: 'Philosophy', desc: 'Krishnamurti, Camus, inquiry notes', path: '/philosophy' },
  { label: 'Projects & Tools', desc: 'Data analysis, code experiments', path: '/projects' },
  { label: 'Photography', desc: 'Visual documentation & geometry', path: '/photography' },
  { label: 'Notes & Logs', desc: 'Working essays & observations', path: '/blog' },
]

export default function HeroSection({ profile = {} }) {
  return (
    <section className="shell pt-[clamp(7.5rem,13vw,11.5rem)] pb-[clamp(2.5rem,5vw,4.5rem)]">
      <div className="w-full">
        <p className="flex items-center gap-2 font-mono text-xs text-muted mb-6 sm:mb-8">
          <span className="text-ink">{profile?.name || 'Advaita Chandra'}</span>
          <span aria-hidden="true">·</span>
          <span>Archive &amp; Notebook</span>
        </p>

        <div className="max-w-5xl">
          <h1 className="text-[length:var(--text-hero)] font-normal tracking-tight text-ink mb-[var(--spacing-fluid-sm)] leading-[1.12] text-balance">
            I am someone who notices, thinks, builds, photographs, reads, and writes.
          </h1>

          <p className="text-[length:var(--text-lg)] text-muted leading-relaxed mb-[var(--spacing-fluid-md)] max-w-3xl">
            Working drafts, code experiments, and study notes tracking my interests in creative
            computing, philosophy, history, and internet infrastructure.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-[var(--spacing-fluid-lg)]">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-canvas text-sm font-medium hover:bg-accent-strong active:scale-[0.98] transition-[background-color,transform] duration-150 ease-[var(--ease-soft)]"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="#inquiries"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line text-muted hover:text-ink hover:border-line-strong hover:bg-surface active:scale-[0.98] transition-[color,background-color,border-color,transform] duration-150 ease-[var(--ease-soft)] text-sm font-medium"
            >
              <span>Reading Archive</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Archive Directory Explorer Strip */}
        <div className="pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {BRANCHES.map((b) => (
            <Link
              key={b.path}
              to={b.path}
              className="group p-5 sm:p-6 rounded-xl border border-line bg-surface/40 hover:bg-surface hover:border-line-strong transition-colors duration-150 ease-[var(--ease-soft)] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-ink font-medium">
                  {b.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-ink transition-colors duration-150" aria-hidden="true" />
              </div>
              <p className="text-[13px] text-muted leading-relaxed line-clamp-2">{b.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
