import { Loader } from 'lucide-react'

/**
 * Loading state indicator for async operations.
 *
 * Shows spinner with message while loading data or processing.
 * Can be full-screen overlay or inline.
 */

export default function LoadingState({
  message = 'Loading...',
  variant = 'default', // 'default' | 'overlay'
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader className="h-6 w-6 animate-spin text-accent" aria-hidden="true" />
      <p className="text-sm text-muted">{message}</p>
    </div>
  )

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/20 backdrop-blur-sm">
        <div className="rounded-lg bg-surface p-8 shadow-lg">
          {content}
        </div>
      </div>
    )
  }

  return <div className="flex min-h-96 items-center justify-center">{content}</div>
}
