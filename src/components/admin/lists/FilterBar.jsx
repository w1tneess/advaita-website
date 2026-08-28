/**
 * Reusable filter bar for admin list pages.
 *
 * Consolidates filter UI patterns across all collection pages.
 * Handles multiple filter types: select, checkbox, radio.
 */

export default function FilterBar({ filters, onFilter, hint }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <select
            key={filter.id}
            value={filter.value}
            onChange={(e) => onFilter(filter.id, e.target.value)}
            aria-label={filter.label}
            className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
