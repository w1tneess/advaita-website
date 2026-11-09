import { Search, X } from 'lucide-react'

const label = (cat) => (cat === 'All' ? 'All' : cat[0].toUpperCase() + cat.slice(1).replace(/-/g, ' '))

export default function ProjectFilter({
  categories = [],
  activeCategory = 'All',
  onCategoryChange,
  searchQuery = '',
  onSearchChange,
  totalCount = 0,
  filteredCount = 0,
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-x-5 gap-y-2">
        {categories.map((cat) => {
          const active = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => onCategoryChange(cat)}
              className={`pen-link py-1 text-[15px] ${active ? 'text-ink [background-size:100%_1px]' : 'text-muted hover:text-ink'}`}
            >
              {label(cat)}
            </button>
          )
        })}
        <span className="py-1 text-[15px] text-text-3 tabular-nums" aria-live="polite">
          {filteredCount} of {totalCount}
        </span>
      </div>

      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects"
          aria-label="Search projects"
          className="w-full border-0 border-b border-line bg-transparent py-2 pr-8 pl-6 text-[15px] text-ink placeholder:text-text-3 focus:border-ink focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-0 -translate-y-1/2 p-1 text-muted hover:text-ink transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
