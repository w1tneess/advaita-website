import { ExternalLink, FolderGit2 } from 'lucide-react'
import { motion } from 'framer-motion'

import Badge from '@/components/ui/Badge.jsx'
import Card from '@/components/ui/Card.jsx'
import StatusBadge from '@/components/ui/StatusBadge.jsx'

/**
 * Project card.
 *
 * Simplified for the new site. Displays: title, status, description, and links.
 * No methodology, no limitations, no categories, no metrics.
 */
export default function ProjectCard({ project, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`

  const hasRepo = project.links?.repository
  const hasLive = project.links?.live

  return (
    <Card 
      as={motion.article} 
      className="p-6 sm:p-8 transform-gpu origin-left"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge kind="project" value={project.status} />
      </div>

      <Heading className="mt-3 font-display text-xl font-semibold tracking-tight sm:text-2xl">
        {project.title}
      </Heading>

      <p className="mt-3 max-w-prose text-base leading-relaxed text-muted">
        {project.description}
      </p>

      {project.tools && project.tools.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <li key={tool}>
              <Badge>{tool}</Badge>
            </li>
          ))}
        </ul>
      )}

      {(hasRepo || hasLive) && (
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          {hasRepo && (
            <motion.a
              href={project.links.repository}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
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
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-1.5 font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              View project
              <span className="sr-only">(opens in a new tab)</span>
            </motion.a>
          )}
        </div>
      )}
    </Card>
  )
}
