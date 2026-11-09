import { ArrowUpRight } from 'lucide-react'
import { isSafeUrl } from '@/lib/url.ts'
import type { Project } from '@/types/content.ts'

interface ProjectCardProps {
  project: Project
  index?: number
}

const STATUS: Record<string, string> = {
  completed: 'Finished',
  'in-progress': 'In progress',
  concept: 'Idea',
}

const cap = (s?: string) => (s ? s[0].toUpperCase() + s.slice(1) : '')

/** One project as a notebook entry: what it is, how it works, and what it cannot do. */
export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, categories, status, summary, description, methodology, limitations, links, tools } = project

  const actions = [
    { href: links?.live, label: 'Open it' },
    { href: links?.repository, label: 'Source code' },
    { href: links?.writeup, label: 'Write-up' },
  ].filter((a) => isSafeUrl(a.href))

  return (
    <article className="folio gap-y-6 border-b border-line py-12 lg:py-16" data-reveal>
      <div className="folio-margin text-[14px] text-muted space-y-1">
        <p className="text-ink">{cap(categories?.[0]) || 'Project'}</p>
        {status && <p>{STATUS[status] || cap(status)}</p>}
        {tools && tools.length > 0 && <p className="pt-2 leading-relaxed">{tools.slice(0, 5).join(', ')}</p>}
      </div>

      <div className="lg:col-span-5 lg:col-start-4">
        <h3 className="text-[length:var(--text-3xl)] leading-[1.05] tracking-[-0.035em]">{title}</h3>
        <p className="mt-5 text-[17px] leading-relaxed text-muted">{summary || description}</p>

        {methodology && methodology.length > 0 && (
          <ul className="mt-8 space-y-4">
            {methodology.slice(0, 2).map((m, i) => (
              <li key={m.title || i} className="text-[15px] leading-relaxed text-muted">
                <span className="text-ink">{m.title}.</span> {m.detail}
              </li>
            ))}
          </ul>
        )}

        {actions.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {actions.map((a) => (
              <li key={a.label}>
                <a href={a.href as string} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-[15px] text-ink">
                  <span className="pen-link">{a.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {limitations && limitations.length > 0 && (
        <aside className="lg:col-span-3 lg:col-start-10 lg:pt-2" aria-label={`Limits of ${title}`}>
          <p className="mark-label" data-ink="limitation">limits</p>
          <ul className="mt-3 space-y-3">
            {limitations.slice(0, 3).map((limit) => (
              <li key={limit} data-ink="limitation" className="border-l border-dashed border-limitation/60 pl-3 text-[14px] leading-relaxed text-muted">
                {limit}
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  )
}
