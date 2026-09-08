import { ArrowUpRight, ExternalLink, FolderGit2 } from 'lucide-react'
import { Link } from 'react-router'

import Badge from '@/components/ui/Badge.jsx'
import Card from '@/components/ui/Card.jsx'
import Callout from '@/components/ui/Callout.jsx'
import StatusBadge from '@/components/ui/StatusBadge.jsx'

/**
 * Project card.
 *
 * `full` variant uses a two-column editorial layout on lg: screens —
 * title + description + methodology + limitations on the left,
 * metadata sidebar (status, tools, visibility, links) on the right.
 *
 * `editorial` variant provides an in-depth research showcase for the Home page.
 *
 * `compact` variant stays single-column for grid listings.
 */
export default function ProjectCard({ project, variant = 'full', headingLevel = 3, index }) {
  const Heading = `h${headingLevel}`
  const isCompact = variant === 'compact'

  const hasRepo = project.links?.repository
  const hasLive = project.links?.live
  const hasTools = project.tools && project.tools.length > 0
  const hasVisibility = Boolean(project.visibility)
  const hasMeta = hasRepo || hasLive || hasTools || hasVisibility

  if (variant === 'editorial') {
    return (
      <Card
        as="article"
        className="group relative rounded-2xl p-6 sm:p-8 md:p-9 border border-line/70 bg-surface transition-all duration-300 hover:border-ink/25 hover:shadow-card-hover flex flex-col justify-between"
      >
        <div>
          {/* Header meta line: Index + Status + Categories */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/40 pb-3.5">
            <div className="flex items-center gap-2.5">
              {index !== undefined && (
                <span className="font-mono text-xs font-semibold tracking-widest text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
              <span className="text-muted/30">/</span>
              <StatusBadge kind="project" value={project.status} />
            </div>

            {project.categories && project.categories.length > 0 && (
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted/70">
                {project.categories.join(' · ')}
              </span>
            )}
          </div>

          {/* Title */}
          <Heading className="mt-4 font-display text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-ink group-hover:text-accent transition-colors duration-200">
            {project.title}
          </Heading>

          {/* Research Summary */}
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted/90">
            {project.summary || project.description}
          </p>

          {/* Methodological approach highlight */}
          {project.methodology && project.methodology.length > 0 && (
            <div className="mt-5 rounded-xl bg-raised/50 p-4 border border-line/40">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold mb-2">
                Methodological Approach
              </p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-muted/90">
                {project.methodology.slice(0, 2).map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent mt-0.5 font-mono text-xs">›</span>
                    <span>
                      <strong className="text-ink/80 font-medium">{m.title}:</strong> {m.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer: Tools + Floating Circular Action */}
        <div className="mt-6 pt-4 border-t border-line/40 flex flex-wrap items-center justify-between gap-3">
          {hasTools && (
            <ul className="flex flex-wrap gap-1.5">
              {project.tools.map((tool) => (
                <li key={tool}>
                  <Badge tone="neutral">{tool}</Badge>
                </li>
              ))}
            </ul>
          )}

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-accent hover:text-accent-strong transition-colors ml-auto group-hover:translate-x-0.5 transition-transform"
          >
            <span>Methodology & limitations</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line bg-raised/80 text-ink shadow-sm transition-all duration-200 group-hover:bg-ink group-hover:text-canvas group-hover:scale-105">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </Card>
    )
  }

  if (isCompact) {
    return (
      <Card
        as="article"
        className="group relative rounded-2xl p-6 sm:p-7 flex h-full flex-col justify-between border border-line/70 bg-surface transition-all duration-300 hover:border-ink/25 hover:shadow-card-hover"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <StatusBadge kind="project" value={project.status} />
            {index !== undefined && (
              <span className="font-mono text-xs font-semibold tracking-widest text-muted/40 group-hover:text-muted transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </div>

          <Heading
            className="mt-4 font-display text-lg font-semibold tracking-tight text-ink group-hover:text-accent transition-colors duration-200 sm:text-xl"
          >
            {project.title}
          </Heading>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted/90">
            {project.summary || project.description}
          </p>
        </div>

        <div>
          {hasTools && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.tools.map((tool) => (
                <li key={tool}>
                  <Badge tone="neutral">{tool}</Badge>
                </li>
              ))}
            </ul>
          )}

          {(hasRepo || hasLive) && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm border-t border-line/40 pt-4">
              {hasRepo && (
                <a
                  href={project.links.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-strong transition-colors"
                >
                  <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Repository
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              {hasLive && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-strong transition-colors ml-auto"
                >
                  <span>View project</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-line bg-raised/70 text-ink shadow-sm transition-all group-hover:bg-ink group-hover:text-canvas">
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
            </div>
          )}
        </div>
      </Card>
    )
  }

  /* ─── Full variant: two-column editorial layout ─── */
  return (
    <Card
      as="article"
      className="group relative rounded-2xl p-6 sm:p-8 lg:p-10 border border-line/70 bg-surface transition-all duration-300 hover:border-ink/25 hover:shadow-card-hover"
    >
      <div className={`flex flex-col ${hasMeta ? 'lg:flex-row lg:gap-10' : ''}`}>
        {/* Left: Editorial content */}
        <div className={hasMeta ? 'lg:flex-1 min-w-0' : ''}>
          <div className="flex items-center justify-between gap-2 lg:hidden">
            <StatusBadge kind="project" value={project.status} />
            {index !== undefined && (
              <span className="font-mono text-xs font-semibold tracking-widest text-muted/40 group-hover:text-muted transition-colors">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
          </div>

          <Heading
            className="mt-4 font-display text-xl font-semibold tracking-tight text-ink group-hover:text-accent transition-colors duration-200 sm:text-2xl lg:mt-0"
          >
            {project.title}
          </Heading>

          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted/90">
            {project.description}
          </p>

          {project.role && (
            <p className="mt-3 text-xs text-muted/80">
              <span className="font-semibold text-muted uppercase tracking-wider">Role:</span> {project.role}
            </p>
          )}

          {project.methodology && project.methodology.length > 0 && (
            <div className="mt-6 border-t border-line/40 pt-5">
              <h4 className="text-xs font-semibold tracking-wider text-muted uppercase">Methodology</h4>
              <ol className="mt-3 space-y-2.5">
                {project.methodology.map((step, sIdx) => (
                  <li key={sIdx} className="text-sm">
                    <span className="font-medium text-ink">{step.title}</span>
                    {step.detail && <span className="text-muted/90 ml-1.5">— {step.detail}</span>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {project.limitations && project.limitations.length > 0 && (
            <div className="mt-6">
              <Callout variant="limitation" title="What this work does not show">
                <ul className="list-disc pl-4 space-y-1 mt-1 text-sm text-muted/90">
                  {project.limitations.map((item, lIdx) => (
                    <li key={lIdx}>{item}</li>
                  ))}
                </ul>
              </Callout>
            </div>
          )}
        </div>

        {/* Right: Metadata sidebar (desktop only — mobile shows inline) */}
        {hasMeta && (
          <aside className="mt-6 shrink-0 border-t border-line/40 pt-6 lg:mt-0 lg:w-56 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0">
            {/* Status — desktop only (mobile shows above title) */}
            <div className="hidden lg:block">
              <p className="text-xs font-semibold tracking-wide text-muted uppercase mb-2">Status</p>
              <StatusBadge kind="project" value={project.status} />
            </div>

            {hasTools && (
              <div className={`${project.status ? 'lg:mt-6' : ''}`}>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase mb-2 hidden lg:block">Stack</p>
                <ul className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool) => (
                    <li key={tool}>
                      <Badge tone="neutral">{tool}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {hasVisibility && (
              <div className="mt-5 lg:mt-6">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase mb-1.5 hidden lg:block">Access</p>
                <p className="text-xs text-muted/80 leading-relaxed">{project.visibility}</p>
              </div>
            )}

            {(hasRepo || hasLive) && (
              <div className="mt-5 lg:mt-6">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase mb-2 hidden lg:block">Links</p>
                <div className="flex flex-col gap-2 text-sm">
                  {hasRepo && (
                    <a
                      href={project.links.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center justify-between gap-2 rounded-xl border border-line/70 bg-raised/40 px-3 py-2 text-xs font-semibold text-ink hover:border-accent/40 hover:bg-raised transition-all"
                    >
                      <span className="inline-flex items-center gap-2">
                        <FolderGit2 className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        Repository
                      </span>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted group-hover/link:text-ink">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                  {hasLive && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center justify-between gap-2 rounded-xl border border-line/70 bg-raised/40 px-3 py-2 text-xs font-semibold text-ink hover:border-accent/40 hover:bg-raised transition-all"
                    >
                      <span className="inline-flex items-center gap-2">
                        <ExternalLink className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        Live Project
                      </span>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted group-hover/link:text-ink">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </Card>
  )
}

