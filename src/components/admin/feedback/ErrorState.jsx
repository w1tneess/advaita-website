import { AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button.jsx'

/**
 * Error state display for failed operations.
 *
 * Shows error message with optional retry action.
 * Used when data loading or mutations fail.
 */

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred. Please try again.',
  action,
  onRetry,
  icon: Icon = AlertCircle,
}) {
  return (
    <div className="rounded-lg border border-limitation/30 bg-limitation/10 p-8 text-center">
      <Icon className="mx-auto h-12 w-12 text-limitation" aria-hidden="true" />
      <h3 className="mt-4 font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-4">
          {action || 'Try again'}
        </Button>
      )}
    </div>
  )
}
