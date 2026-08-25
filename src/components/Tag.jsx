/**
 * A tag chip. Interactive when `onClick` is supplied (blog filtering), otherwise a
 * plain label.
 */
export default function Tag({ label, count, active = false, onClick, className = '' }) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors'
  const state = active
    ? 'border-accent bg-accent/12 text-accent'
    : 'border-line bg-surface text-muted hover:border-accent hover:text-accent'

  if (!onClick) {
    return <span className={`${base} border-line bg-surface text-muted ${className}`}>{label}</span>
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${base} ${state} ${className}`}
    >
      {label}
      {typeof count === 'number' && (
        <span className="text-[0.6875rem] opacity-70" aria-hidden="true">
          {count}
        </span>
      )}
      {typeof count === 'number' && (
        <span className="sr-only">
          {count} {count === 1 ? 'article' : 'articles'}
        </span>
      )}
    </button>
  )
}
