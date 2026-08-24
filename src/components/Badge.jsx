/** Small inline pill for metadata: categories, tools, counts. */

const TONES = {
  neutral: 'bg-raised text-muted border-line',
  accent: 'bg-accent/10 text-accent border-accent/25',
  fact: 'bg-fact/10 text-fact border-fact/25',
  analysis: 'bg-analysis/10 text-analysis border-analysis/25',
  opinion: 'bg-opinion/10 text-opinion border-opinion/25',
  limitation: 'bg-limitation/10 text-limitation border-limitation/25',
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
