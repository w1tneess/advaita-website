import { BookOpen, HelpCircle, Info, MessageSquare, Search } from 'lucide-react'

/**
 * A labelled claim.
 *
 * The point of this component is that the reader never has to guess which kind of
 * statement they are reading. The label is always rendered — it is not decoration.
 *
 * VARIANT_META is exported so <EpistemicLegend> explains exactly the same labels,
 * icons and colours that appear in the content.
 */

export const VARIANT_META = {
  fact: {
    label: 'Sourced fact',
    icon: BookOpen,
    explanation: 'Comes from a cited source, listed in the references.',
    classes: 'border-fact/30 bg-fact/8',
    accent: 'text-fact',
  },
  analysis: {
    label: 'Analysis',
    icon: Search,
    explanation: 'My inference from the evidence. Reasoning, not reporting.',
    classes: 'border-analysis/30 bg-analysis/8',
    accent: 'text-analysis',
  },
  opinion: {
    label: 'Opinion',
    icon: MessageSquare,
    explanation: 'What I think. Not evidence, and not presented as such.',
    classes: 'border-opinion/30 bg-opinion/8',
    accent: 'text-opinion',
  },
  limitation: {
    label: 'Limitation',
    icon: HelpCircle,
    explanation: 'Something unknown, unresolved, or outside what this work can show.',
    classes: 'border-limitation/30 bg-limitation/8',
    accent: 'text-limitation',
  },
  note: {
    label: 'Note',
    icon: Info,
    explanation: 'A neutral aside or clarification.',
    classes: 'border-line bg-raised',
    accent: 'text-muted',
  },
}

export default function Callout({ variant = 'note', title, children, className = '' }) {
  const meta = VARIANT_META[variant] ?? VARIANT_META.note
  const Icon = meta.icon

  return (
    <aside
      className={`rounded-card border px-4 py-4 sm:px-5 ${meta.classes} ${className}`}
      aria-label={`${meta.label}${title ? `: ${title}` : ''}`}
    >
      <p
        className={`mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide uppercase ${meta.accent}`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {meta.label}
      </p>
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="text-sm leading-relaxed text-ink/90">{children}</div>
    </aside>
  )
}
