/**
 * Labelled switch.
 *
 * A real <input type="checkbox"> under a styled track, so it is keyboard-operable and
 * announced correctly without any ARIA of its own.
 */
export default function Toggle({ id, label, description, checked, onChange, className = '' }) {
  const descriptionId = description ? `${id}-description` : undefined

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <label className="relative mt-0.5 inline-flex shrink-0 cursor-pointer items-center">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(checked)}
          onChange={(event) => onChange(event.target.checked)}
          aria-describedby={descriptionId}
          className="peer sr-only"
        />
        <span
          className="h-5 w-9 rounded-full border border-border bg-surface-elevated transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-surface shadow-subtle transition-transform peer-checked:translate-x-4"
          aria-hidden="true"
        />
      </label>

      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium">
          {label}
        </label>
        {description && (
          <p id={descriptionId} className="mt-0.5 text-xs text-foreground-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
