/**
 * A group of mutually exclusive filter buttons.
 *
 * Uses aria-pressed toggle buttons inside a labelled group rather than a <select>, so
 * the available options and the active one are both visible without interaction.
 */
export default function FilterBar({
  label,
  options,
  value,
  onChange,
  allLabel = 'All',
  allValue = 'all',
  counts,
  className = '',
}) {
  const items = [{ value: allValue, label: allLabel }, ...options]

  return (
    <div className={className} role="group" aria-label={label}>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((option) => {
          const isActive = value === option.value
          const count = counts?.[option.value]

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-accent bg-accent/12 text-accent'
                  : 'border-line bg-surface text-muted hover:border-accent hover:text-accent'
              }`}
            >
              {option.label}
              {typeof count === 'number' && (
                <span className="text-xs tabular-nums opacity-70">{count}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
