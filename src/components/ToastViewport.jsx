import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

import { useToast } from '../lib/toast.jsx'

/**
 * Renders the active toasts.
 *
 * Mounted once in App.jsx rather than inside the admin layout: the content store can
 * report a storage problem on any page, and a warning nobody can see is not a warning.
 *
 * The container is a polite live region so a screen reader announces new messages
 * without interrupting whatever is being read.
 */

const VARIANTS = {
  info: { icon: Info, classes: 'border-line bg-surface text-ink', iconClass: 'text-muted' },
  success: {
    icon: CheckCircle2,
    classes: 'border-accent/40 bg-surface text-ink',
    iconClass: 'text-accent',
  },
  error: {
    icon: AlertCircle,
    classes: 'border-limitation/50 bg-surface text-ink',
    iconClass: 'text-limitation',
  },
}

export default function ToastViewport() {
  const { toasts, dismiss } = useToast()

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map((toast) => {
        const variant = VARIANTS[toast.variant] ?? VARIANTS.info
        const ToastIcon = variant.icon

        return (
          <div
            key={toast.id}
            role={toast.variant === 'error' ? 'alert' : undefined}
            className={`animate-rise pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-raised ${variant.classes}`}
          >
            <ToastIcon className={`mt-0.5 h-4 w-4 shrink-0 ${variant.iconClass}`} aria-hidden="true" />
            <p className="flex-1 text-sm">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="-m-1 rounded p-1 text-muted transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
