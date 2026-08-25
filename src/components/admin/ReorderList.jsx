import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

/**
 * Reorderable list with move-up / move-down buttons.
 *
 * Buttons rather than drag-and-drop, deliberately: dragging is unusable by keyboard and
 * awkward on touch, and this list is never long enough for dragging to be faster. Each
 * move is announced in a live region, because a visual reshuffle is invisible to a screen
 * reader otherwise.
 */
export default function ReorderList({
  items = [],
  labelFor,
  onMove,
  renderItem,
  renderActions,
  emptyMessage = 'Nothing here yet.',
  className = '',
}) {
  const [announcement, setAnnouncement] = useState('')

  if (items.length === 0) {
    return (
      <p className={`rounded-card border border-dashed border-line p-6 text-sm text-muted ${className}`}>
        {emptyMessage}
      </p>
    )
  }

  const move = (item, delta, index) => {
    onMove(item.id, delta)
    const label = labelFor ? labelFor(item) : 'Item'
    setAnnouncement(
      `${label} moved to position ${index + 1 + delta} of ${items.length}.`,
    )
  }

  return (
    <div className={className}>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-card border border-line bg-surface p-4"
          >
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => move(item, -1, index)}
                disabled={index === 0}
                aria-label={`Move ${labelFor ? labelFor(item) : 'item'} up`}
                className="rounded-md border border-line p-1 text-muted transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(item, 1, index)}
                disabled={index === items.length - 1}
                aria-label={`Move ${labelFor ? labelFor(item) : 'item'} down`}
                className="rounded-md border border-line p-1 text-muted transition-colors hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="min-w-0 flex-1">{renderItem(item, index)}</div>

            {renderActions && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {renderActions(item, index)}
              </div>
            )}
          </li>
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
