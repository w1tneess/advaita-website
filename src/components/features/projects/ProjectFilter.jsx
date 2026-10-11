import { Search, X } from 'lucide-react'

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
    <div className="space-y-4 pt-4">
      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by title, tools, or description…"
          aria-label="Filter projects"
          className="w-full rounded-full border border-line bg-surface/70 py-2.5 pr-10 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear filter"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted hover:text-ink hover:bg-raised transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills & Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-utility">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="text-muted mr-1 text-xs">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 min-h-[32px] text-xs transition-all duration-150 cursor-pointer rounded-full active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                activeCategory === cat
                  ? 'bg-ink text-canvas font-medium shadow-subtle'
                  : 'bg-surface border border-line/60 text-muted hover:text-ink hover:border-line-strong hover:bg-surface/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="font-mono text-xs text-muted">
          Showing {filteredCount} of {totalCount}
        </div>
      </div>
    </div>
  )
}
