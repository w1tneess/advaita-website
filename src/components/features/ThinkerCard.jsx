import { BookOpen, Sparkles, ArrowRight } from 'lucide-react'

/**
 * Thinker card for the Philosophy page.
 *
 * Implements the reference composition:
 * - Top row: Monospace index ('01') on left, subtle 'Inquiry' badge on right
 * - Title: High-contrast Playfair Display serif
 * - Body: Disciplined, comfortable line-height for reading
 * - Bottom row: Pinned 'Primary source →' on left, 'Explore note →' on right
 * - Consistent internal padding and crisp hairline geometry.
 */
export default function ThinkerCard({
  thinker,
  isSelected = false,
  onClick,
  index,
}) {
  const isClickable = Boolean(onClick)

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <article
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group relative rounded-card border p-6 sm:p-7 transition-all duration-200 text-left h-full flex flex-col justify-between ${
        isClickable ? 'cursor-pointer select-none' : ''
      } ${
        isSelected
          ? 'border-accent bg-raised/90 shadow-md ring-1 ring-accent/30'
          : 'border-line bg-surface hover:border-ink/25 hover:bg-raised/30 shadow-subtle'
      }`}
    >
      <div>
        {/* Top meta row: Index on left, badge on right */}
        <div className="flex items-center justify-between gap-3 border-b border-line/30 pb-3">
          <span className="font-mono text-xs tracking-widest text-muted/60 group-hover:text-accent transition-colors font-medium">
            {index !== undefined ? String(index + 1).padStart(2, '0') : 'NOTE'}
          </span>
          {isSelected ? (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-accent">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted/60 group-hover:text-muted transition-colors">
              <BookOpen className="h-3 w-3 text-muted/50" aria-hidden="true" />
              Inquiry
            </span>
          )}
        </div>

        {/* Thinker Name */}
        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
          {thinker.name}
        </h3>

        {/* Thought / Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted/90">
          {thinker.description}
        </p>
      </div>

      {/* Pinned Bottom Row: Actions */}
      <div className="mt-6 pt-4 border-t border-line/40 flex items-center justify-between text-xs font-mono text-muted/70">
        <span className="text-[11px] flex items-center gap-1">
          Primary source
          <ArrowRight className="h-3 w-3 text-muted/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
        </span>
        <span className={`text-[11px] font-medium flex items-center gap-1 transition-colors ${
          isSelected ? 'text-accent' : 'text-muted/80 group-hover:text-ink'
        }`}>
          {isSelected ? 'Viewing note ↓' : 'Explore note →'}
        </span>
      </div>
    </article>
  )
}
