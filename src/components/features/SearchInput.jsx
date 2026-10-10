import { Search, X } from 'lucide-react'

/** Labelled search field with a clear button. The label is required, not optional. */
export default function SearchInput({
  id,
  label = 'Search',
  value,
  onChange,
  placeholder = 'Search…',
  hint,
  className = '',
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="w-full rounded-lg border border-line bg-surface py-2.5 pr-10 pl-9 text-sm placeholder:text-muted/70 focus:border-accent focus:outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}
