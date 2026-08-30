import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button.jsx'

/**
 * Pagination component for large collections.
 *
 * Provides consistent pagination UI with previous/next navigation.
 * Prepared for future use when collections grow large.
 */

export default function Pagination({ page, pageSize, total, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  const hasPrev = page > 1
  const hasNext = page < totalPages

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted">
        Page {page} of {totalPages} ({total} total)
      </p>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasPrev}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasNext}
          onClick={() => onChange(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
