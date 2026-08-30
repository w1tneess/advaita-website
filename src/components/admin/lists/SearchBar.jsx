import { Search, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Reusable search bar for admin list pages.
 *
 * Provides consistent search UI with clear button and debouncing support.
 * Used across ProjectsPage, PostsPage, SkillsPage, etc.
 */

export default function SearchBar({
  id,
  value,
  onChange,
  placeholder = 'Search...',
  hint,
  debounce = 300,
}) {
  const [timer, setTimer] = useState(null)

  const handleChange = (newValue) => {
    if (timer) clearTimeout(timer)

    const newTimer = setTimeout(() => {
      onChange(newValue)
    }, debounce)

    setTimer(newTimer)
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-line bg-surface py-2.5 pr-9 pl-9 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-muted hover:text-ink"
            title="Clear search"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
