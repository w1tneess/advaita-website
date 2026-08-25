import { VARIANT_META } from './Callout.jsx'

/**
 * Explains the four labels used across the site.
 *
 * Rendered on About and Blog (and at the foot of each article) so the labelling system
 * is documented wherever a reader is likely to first meet it.
 */

const ORDER = ['fact', 'analysis', 'opinion', 'limitation']

export default function EpistemicLegend({
  compact = false,
  headingLevel = 2,
  id = 'labels',
  className = '',
}) {
  const Heading = `h${headingLevel}`

  return (
    <section
      aria-labelledby={`${id}-heading`}
      className={`rounded-card border border-border bg-surface p-5 sm:p-6 ${className}`}
    >
      <Heading id={`${id}-heading`} className="text-base font-semibold">
        How claims are labelled here
      </Heading>
      <p className="mt-1 text-sm text-foreground-muted">
        Four different kinds of statement, kept visually distinct so you never have to
        guess which one you are reading.
      </p>

      <dl className={`mt-5 grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
        {ORDER.map((variant) => {
          const meta = VARIANT_META[variant]
          const Icon = meta.icon
          return (
            <div key={variant} className="flex gap-3">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${meta.classes} ${meta.accent}`}
                aria-hidden="true"
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <dt className={`text-sm font-semibold ${meta.accent}`}>{meta.label}</dt>
                <dd className="mt-0.5 text-sm text-foreground-muted">{meta.explanation}</dd>
              </div>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
