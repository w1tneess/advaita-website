import { AlertTriangle } from 'lucide-react'
import { useEffect, useRef } from 'react'

import Button from '../Button.jsx'

/**
 * Modal confirmation for destructive actions.
 *
 * Deliberately hand-built rather than a native <dialog>, so the focus behaviour is
 * explicit: focus moves to Cancel (never straight to the destructive button), Tab is
 * trapped inside the panel, Escape cancels, and focus returns to whatever opened it.
 *
 * Driven by the useConfirm hook — see src/hooks/useConfirm.jsx.
 */
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  const panelRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    previouslyFocused.current = document.activeElement
    // Focus lands on Cancel, found by attribute so no ref has to be threaded through Button.
    panelRef.current?.querySelector('[data-autofocus]')?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancel()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!focusable || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused.current?.focus?.()
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Clicking the backdrop cancels — the same as Escape, never the same as confirming. */}
      <div
        className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={message ? 'confirm-message' : undefined}
        className="animate-rise relative w-full max-w-md rounded-card border border-border bg-surface p-6 shadow-raised"
      >
        <div className="flex gap-4">
          {tone === 'danger' && (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-limitation/12 text-danger"
              aria-hidden="true"
            >
              <AlertTriangle className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-lg font-semibold">
              {title}
            </h2>
            {message && (
              <p id="confirm-message" className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} data-autofocus="true">
            {cancelLabel}
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
