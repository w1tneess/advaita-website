import {
  BarChart3,
  BookOpen,
  Brain,
  Cpu,
  GraduationCap,
  Landmark,
  Newspaper,
  Scale,
  ScrollText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

const ICON_MAP = {
  BookOpen,
  Brain,
  TrendingUp,
  Cpu,
  Landmark,
  ScrollText,
  Newspaper,
  Scale,
  BarChart3,
  ShieldCheck,
  GraduationCap,
}

/**
 * Research-interest card.
 *
 * Designed as a quiet, authoritative editorial index entry — balancing clean
 * typography with bespoke hairline iconography.
 */
export default function InterestCard({ interest, headingLevel = 3, index }) {
  const Heading = `h${headingLevel}`
  const IconComponent = interest.icon ? ICON_MAP[interest.icon] : null

  return (
    <div
      className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-card border border-line/60 bg-surface/50 transition-all duration-200 hover:border-accent/40 hover:bg-surface shadow-subtle"
    >
      <div>
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-line/30">
          <div className="flex items-center gap-2.5 min-w-0">
            {IconComponent && (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-line/50 bg-raised/60 text-accent/90 transition-colors group-hover:border-accent/40 group-hover:text-accent">
                <IconComponent className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </span>
            )}
            <Heading className="font-display text-base font-semibold tracking-tight text-ink group-hover:text-accent transition-colors duration-200 truncate">
              {interest.name}
            </Heading>
          </div>
          {index !== undefined && (
            <span className="font-mono text-[11px] font-medium text-muted/40 group-hover:text-accent/80 transition-colors shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>
        {interest.note && (
          <p className="text-sm leading-relaxed text-muted/90">
            {interest.note}
          </p>
        )}
      </div>
    </div>
  )
}

