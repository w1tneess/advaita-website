import { ExternalLink, FolderGit2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { EASE_OUT_EXPO } from '@/lib/animations.js'

import Badge from '@/components/ui/Badge.jsx'
import Card from '@/components/ui/Card.jsx'
import StatusBadge from '@/components/ui/StatusBadge.jsx'

/**
 * Project card.
 *
 * `full` variant uses a two-column editorial layout on lg: screens —
 * title + description on the left, metadata sidebar (status, tools, links)
 * on the right.
 *
 * `compact` variant stays single-column for featured grids.
 */
export default function ProjectCard({ project, variant = 'full', headingLevel = 3, index }) {
  const Heading = `h${headingLevel}`
  const isCompact = variant === 'compact'

  const hasRepo = project.links?.repository
  const hasLive = project.links?.live
  const hasTools = project.tools && project.tools.length > 0
  const hasMeta = hasRepo || hasLive || hasTools

  if (isCompact) {
    return (
      <Card
        as={motion.article}
        className="group relative overflow-hidden p-6 sm:p-7 flex h-full flex-col justify-between transform-gpu border border-line/80 hover:border-accent/40 transition-all duration-300 hover:shadow-card-hover"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div>
          <div className="flex items-center justify-between gap-2">
            <StatusBadge kind="project" value={project.status} />
            {index !== undefined && (
              <span className="font-mono text-xs font-semibold tracking-widest text-muted/40 group-hover:text-accent/70 transition-colors">
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
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <li key={tool}>
                  <Badge tone="neutral">{tool}</Badge>
                </li>
              ))}
            </ul>
          )}

          {(hasRepo || hasLive) && (
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm border-t border-line/40 pt-4">
              {hasRepo && (
                <motion.a
                  href={project.links.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-strong transition-colors"
                >
                  <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Repository
                  <span className="sr-only">(opens in a new tab)</span>
                </motion.a>
              )}
              {hasLive && (
                <motion.a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-strong transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  View project
                  <span className="sr-only">(opens in a new tab)</span>
                </motion.a>
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
      as={motion.article}
      className="group relative overflow-hidden p-6 sm:p-8 lg:p-10 transform-gpu border border-line/80 hover:border-accent/40 transition-all duration-300 hover:shadow-card-hover"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className={`flex flex-col ${hasMeta ? 'lg:flex-row lg:gap-10' : ''}`}>
        {/* Left: Editorial content */}
        <div className={hasMeta ? 'lg:flex-1 min-w-0' : ''}>
          <div className="flex items-center justify-between gap-2 lg:hidden">
            <StatusBadge kind="project" value={project.status} />
            {index !== undefined && (
              <span className="font-mono text-xs font-semibold tracking-widest text-muted/40 group-hover:text-accent/70 transition-colors">
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
                <ul className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <li key={tool}>
                      <Badge tone="neutral">{tool}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(hasRepo || hasLive) && (
              <div className="mt-5 lg:mt-6">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase mb-2 hidden lg:block">Links</p>
                <div className="flex flex-col gap-2.5 text-sm">
                  {hasRepo && (
                    <motion.a
                      href={project.links.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-strong transition-colors"
                    >
                      <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Repository
                      <span className="sr-only">(opens in a new tab)</span>
                    </motion.a>
                  )}
                  {hasLive && (
                    <motion.a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-1.5 font-medium text-accent hover:text-accent-strong transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      View project
                      <span className="sr-only">(opens in a new tab)</span>
                    </motion.a>
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

