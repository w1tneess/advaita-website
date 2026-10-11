import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

const BRANCHES = [
  { label: 'Philosophy', desc: 'Krishnamurti, Camus, inquiry notes', path: '/philosophy' },
  { label: 'Projects & Tools', desc: 'Data analysis, code experiments', path: '/projects' },
  { label: 'Photography', desc: 'Visual documentation & geometry', path: '/photography' },
  { label: 'Notes & Logs', desc: 'Working essays & observations', path: '/blog' },
]

export default function HeroSection({ profile = {} }) {
  return (
    <section className="shell relative pt-[clamp(7.5rem,13vw,11.5rem)] pb-[clamp(2.5rem,5vw,4.5rem)] overflow-hidden">
      {/* Atmospheric Ambient Glow */}
      <div
        className="ambient-glow top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(48rem,95vw)] h-[min(48rem,95vw)] opacity-20"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full">
        {/* Top Status Eyebrow */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-line bg-surface/60 text-muted font-mono text-[11px] mb-6 sm:mb-8 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-ink font-medium">{profile?.name || 'Advaita Chandra'}</span>
          <span className="text-line">•</span>
          <span>Archive &amp; Notebook</span>
        </div>

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
              className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-accent text-canvas text-sm font-semibold hover:bg-accent-strong active:scale-[0.97] transition-all duration-500 ease-[var(--ease-out-expo)] shadow-subtle"
            >
              <span>Explore Projects</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas/15 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:translate-x-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
            <a
              href="#inquiries"
              className="group inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full border border-line bg-surface/50 text-muted hover:text-ink hover:border-line-strong hover:bg-surface active:scale-[0.97] transition-all duration-500 ease-[var(--ease-out-expo)] text-sm font-semibold"
            >
              <span>Reading Archive</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:translate-y-0.5">
                <span aria-hidden="true">&darr;</span>
              </div>
            </a>
          </div>
        </div>

        {/* Archive Directory Explorer Strip */}
        <div className="pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {BRANCHES.map((b) => (
            <Link
              key={b.path}
              to={b.path}
              className="group p-4 sm:p-6 rounded-xl border border-line/60 bg-surface/30 hover:bg-surface/70 hover:border-line-strong hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-250 ease-[var(--ease-out-quart)] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-ink group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)] font-medium">
                  {b.label}
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted group-hover:text-ink transition-colors duration-150 ease-[var(--ease-out-quart)] opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-xs text-muted leading-relaxed line-clamp-2">{b.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
