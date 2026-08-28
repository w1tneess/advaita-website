import { Check, AlertCircle, Loader } from 'lucide-react'

/**
 * Save status feedback indicator.
 *
 * Shows current state: idle, saving, saved, or error.
 * Typically displayed near save button or form footer.
 */

export default function SaveStatus({ status = 'idle', message }) {
  const icons = {
    idle: null,
    saving: <Loader className="h-4 w-4 animate-spin text-accent" aria-hidden="true" />,
    saved: <Check className="h-4 w-4 text-analysis" aria-hidden="true" />,
    error: <AlertCircle className="h-4 w-4 text-limitation" aria-hidden="true" />,
  }

  const labels = {
    idle: '',
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Error saving',
  }

  const colors = {
    idle: 'text-muted',
    saving: 'text-accent',
    saved: 'text-analysis',
    error: 'text-limitation',
  }

  const label = message || labels[status]

  if (status === 'idle' || !label) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${colors[status]}`}>
      {icons[status]}
      <span>{label}</span>
    </div>
  )
}
