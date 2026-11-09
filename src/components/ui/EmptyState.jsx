/**
 * Honest empty state, written in the graphite "unknown" ink: nothing here yet, and it says so.
 * `icon` is accepted for compatibility with existing callers but not drawn.
 */
// eslint-disable-next-line no-unused-vars
export default function EmptyState({ icon, title, message, description, action, className = '' }) {
  const content = message || description

  return (
    <div className={`border-t border-dashed border-limitation/40 py-14 sm:py-20 ${className}`} data-ink="limitation">
      <p className="mark-label" data-ink="limitation">nothing here yet</p>
      {title && <h2 className="mt-4 text-[length:var(--text-3xl)] leading-tight tracking-[-0.035em]">{title}</h2>}
      {content && <div className="mt-4 max-w-lg text-[17px] leading-relaxed text-muted">{content}</div>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  )
}
