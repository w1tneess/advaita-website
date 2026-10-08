import { ArrowUpRight, Github, Globe } from 'lucide-react'
import type { Project } from '@/types/content.ts'

// Allow only safe protocols (http, https) or relative paths.
const isSafeUrl = (url?: string | null): boolean => {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim().toLowerCase()
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/')
  )
}

interface ProjectCardProps {
  project: Project
  index?: number
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { title, categories, status, summary, description, methodology, links, tools } = project
  const kind = categories && categories.length > 0 ? categories[0] : status || 'Research & Tool'

  const repoLink = isSafeUrl(links?.repository) ? links?.repository : null
  const liveLink = isSafeUrl(links?.live) ? links?.live : null
  const writeupLink = isSafeUrl(links?.writeup) ? links?.writeup : null
  const rawLink =
    liveLink || repoLink || writeupLink || (isSafeUrl(project.link) ? project.link : null)
  const link = rawLink

  return (
    <article className="group flex h-full flex-col justify-between p-6 sm:p-8 rounded-[1.5rem] border border-line/60 bg-surface/40 shadow-[inset_0_1px_0_rgba(248,246,240,0.05)] hover:bg-surface/70 hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover active:scale-[0.99] motion-reduce:hover:translate-y-0 transition-[background-color,border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)]">
      <div>
        {/* Top Card Catalog Bar */}
        <div className="flex items-center justify-between border-b border-line pb-4 mb-5 font-mono text-[11px] tracking-widest uppercase text-muted">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-muted" />
            <span className="text-ink font-medium">{kind}</span>
          </div>
          {status && (
            <span className="text-[10px] text-muted/80 bg-raised px-2 py-0.5 rounded border border-line/60">
              {status}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-normal text-ink group-hover:text-accent-strong transition-colors duration-500 ease-[var(--ease-out-expo)] leading-snug text-balance">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-baseline gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-sm hover:underline underline-offset-4 decoration-line-strong"
            >
              <span>{title}</span>
              <ArrowUpRight className="inline-block h-4 w-4 opacity-50 transition-all duration-150 ease-[var(--ease-out-quart)] group-hover:opacity-100 text-muted group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            title
          )}
        </h3>

        {/* Summary & Description */}
        <div className="mt-4">
          {summary || description ? (
            <p className="text-[length:var(--text-base)] text-muted font-sans leading-relaxed">
              {summary || description}
            </p>
          ) : (
            <p className="text-base text-muted font-display italic">
              Methodology and documentation pending transcription.
            </p>
          )}

          {/* Methodology Snippets */}
          {methodology && methodology.length > 0 && (
            <ul className="mt-5 space-y-2 border-t border-line pt-4 text-[length:var(--text-label)] font-sans text-muted leading-relaxed">
              {methodology.slice(0, 2).map((m, i) => (
                <li key={m.title || i} className="flex items-start gap-2">
                  <span className="text-muted/60">—</span>
                  <span>
                    <strong className="text-ink font-medium">{m.title}:</strong> {m.detail}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Card Footer with Tools & Actions */}
      <div className="mt-8 pt-5 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[11px] tracking-wide">
        {/* Tools Tags */}
        {tools && tools.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tools.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="code-badge border-line/60 bg-surface/50 group-hover:border-line-strong transition-colors duration-150"
              >
                {tool}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}

        {/* Action Links */}
        {repoLink || liveLink || writeupLink ? (
          <div className="flex items-center gap-3 shrink-0">
            {repoLink && (
              <a
                href={repoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-line/60 text-muted hover:border-line-strong hover:text-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas uppercase text-[10px] tracking-wider"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Source</span>
              </a>
            )}
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-raised border border-line hover:border-accent text-ink hover:text-accent font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas uppercase text-[10px] tracking-wider shadow-2xs"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Live Project &rarr;</span>
              </a>
            )}
            {writeupLink && (
              <a
                href={writeupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-line/60 text-muted hover:border-line-strong hover:text-ink transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas uppercase text-[10px] tracking-wider"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>Writeup</span>
              </a>
            )}
          </div>
        ) : (
          <span className="text-muted/60 text-[10px] tracking-wider uppercase font-mono">
            {status === 'concept' ? 'Design Concept' : 'Internal Archive'}
          </span>
        )}
      </div>
    </article>
  )
}
