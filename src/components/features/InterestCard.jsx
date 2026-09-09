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

export default function InterestCard({ interest, headingLevel = 3, index }) {
  const Heading = `h${headingLevel}`
  const IconComponent = interest.icon ? ICON_MAP[interest.icon] : null

  return (
    <div className="group relative flex flex-col justify-between p-6 border border-line bg-surface transition-all duration-300 hover:border-copper/50">
      <div>
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-line/50 font-mono text-[11px]">
          <div className="flex items-center gap-2.5 min-w-0">
            {IconComponent && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-line bg-canvas text-copper">
                <IconComponent className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
              </span>
            )}
            <Heading className="font-display text-base font-normal tracking-tight text-text group-hover:text-copper transition-colors truncate">
              {interest.name}
            </Heading>
          </div>
          {index !== undefined && (
            <span className="font-mono text-[10px] text-text-3 group-hover:text-copper transition-colors shrink-0">
              [{String(index + 1).padStart(2, '0')}]
            </span>
          )}
        </div>
        {interest.note && (
          <p className="text-xs sm:text-sm leading-relaxed text-text-2 font-light">
            {interest.note}
          </p>
        )}
      </div>
    </div>
  )
}
