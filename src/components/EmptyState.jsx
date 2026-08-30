import { Inbox } from 'lucide-react'

/**
 * Honest empty state. Used wherever a collection is genuinely empty — most visibly on
 * the blog, which ships with no articles rather than with invented ones.
 */
export default function EmptyState({ icon: Icon = Inbox, title, message, action, className = '' }) {
  return (
    <div
      className={`rounded-card border border-dashed border-line bg-surface/60 px-6 py-14 text-center ${className}`}
    >
      <Icon className="mx-auto mb-4 h-8 w-8 text-muted" aria-hidden="true" />
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {message && <p className="mx-auto mt-2 max-w-md text-sm text-muted">{message}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  )
}
