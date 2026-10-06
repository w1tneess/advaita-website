/**
 * Standard admin page frame.
 */
export default function AdminPage({ title, description, actions, children }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-display font-normal text-ink tracking-tight">{title}</h1>
          {description && <p className="mt-1.5 max-w-3xl text-sm font-sans text-muted leading-relaxed">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>}
      </div>

      <div>{children}</div>
    </div>
  )
}
