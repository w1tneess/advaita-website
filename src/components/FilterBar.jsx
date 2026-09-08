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
  showLabel = false,
}) {
  const isArray = Array.isArray(value)
  const isAllActive = isArray ? value.length === 0 : value === allValue

  return (
    <div className={className} role="group" aria-label={label}>
      {showLabel ? (
        <p className="mb-2 text-sm font-medium text-muted">{label}</p>
      ) : (
        <span className="sr-only">{label}</span>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(allValue)}
          aria-pressed={isAllActive}
          className={`filter-pill ${isAllActive ? 'filter-pill-active' : ''}`}
        >
          <span>{allLabel}</span>
          {typeof counts?.[allValue] === 'number' && (
            <span className="text-[11px] opacity-75 tabular-nums">({counts[allValue]})</span>
          )}
        </button>
        {options.map((option) => {
          const isActive = isArray ? value.includes(option.value) : value === option.value
          const count = counts?.[option.value]

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
              className={`filter-pill ${isActive ? 'filter-pill-active' : ''}`}
            >
              <span>{option.label}</span>
              {typeof count === 'number' && (
                <span className="text-[11px] opacity-75 tabular-nums">({count})</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
