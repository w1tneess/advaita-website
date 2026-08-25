/** Small inline pill for metadata: categories, tools, counts. */

const TONES = {
  neutral: 'bg-surface-elevated text-foreground-muted border-border',
  accent: 'bg-accent-soft text-accent border-accent/30',
  fact: 'bg-fact/10 text-fact border-fact/30',
  analysis: 'bg-analysis/10 text-analysis border-analysis/30',
  opinion: 'bg-opinion/10 text-opinion border-opinion/30',
  limitation: 'bg-limitation/10 text-danger border-limitation/30',
}

export default function Badge({ tone = 'neutral', className = '', children, ...rest }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}
