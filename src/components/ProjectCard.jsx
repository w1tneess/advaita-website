import { FileText, FolderGit2, Link2 } from 'lucide-react'

import Badge from './Badge.jsx'
import Callout from './Callout.jsx'
import Card from './Card.jsx'
import StatusBadge from './StatusBadge.jsx'
import { useContent } from '../lib/content.jsx'

/**
 * Project card.
 *
 * `variant="compact"` for the home page; `variant="full"` for the portfolio, where
 * methodology and limitations are rendered in full rather than hidden behind a
 * disclosure — the limitations are part of the claim, not a footnote.
 */

const LINK_META = {
  repository: { label: 'Repository', icon: FolderGit2 },
  live: { label: 'Live version', icon: Link2 },
  writeup: { label: 'Write-up', icon: FileText },
}

function ProjectLinks({ links = {} }) {
  const available = Object.entries(LINK_META).filter(([key]) => links[key])
  const unavailable = Object.entries(LINK_META).filter(([key]) => !links[key])

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {available.map(([key, meta]) => {
        const Icon = meta.icon
        return (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {meta.label}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )
      })}

      {/* Placeholders are stated rather than rendered as dead links. */}
      {unavailable.length > 0 && (
        <p className="text-muted">
          {available.length > 0 && <span aria-hidden="true">· </span>}
          No {unavailable.map(([, meta]) => meta.label.toLowerCase()).join(' or ')} link yet
        </p>
      )}
    </div>
  )
}

export default function ProjectCard({ project, variant = 'compact', headingLevel = 3 }) {
  const { projectCategories } = useContent()
  const Heading = `h${headingLevel}`

  const categoryNames = (project.categories || []).map(
    (slug) => projectCategories.find((category) => category.slug === slug)?.name ?? slug,
  )

  const isFull = variant === 'full'

  return (
    <Card
      as="article"
      interactive={!isFull}
      className={isFull ? 'p-6 sm:p-8' : 'flex h-full flex-col p-6'}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatusBadge kind="project" value={project.status} />
        {categoryNames.map((name) => (
          <Badge key={name}>{name}</Badge>
        ))}
      </div>

      <Heading className={`font-semibold ${isFull ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
        {project.title}
      </Heading>

      {project.coverImage && (
        <img
          src={project.coverImage}
          alt=""
          loading="lazy"
          className="mt-4 aspect-[16/7] w-full rounded-lg object-cover"
        />
      )}

      <p className="mt-3 text-sm leading-relaxed text-muted">
        {isFull ? project.description : project.summary}
      </p>

      {project.visibility && <p className="mt-3 text-xs text-muted italic">{project.visibility}</p>}

      {isFull ? (
        <>
          <dl className="mt-6 grid gap-x-8 gap-y-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold">Role</dt>
              <dd className="mt-1 text-muted">{project.role}</dd>
            </div>
            <div>
              <dt className="font-semibold">Tools</dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {(project.tools || []).length > 0 ? (
                  project.tools.map((tool) => <Badge key={tool}>{tool}</Badge>)
                ) : (
                  <span className="text-muted">Not applicable</span>
                )}
              </dd>
            </div>
          </dl>

          {(project.methodology || []).length > 0 && (
            <div className="mt-6 border-t border-line pt-5">
              <h4 className="text-sm font-semibold">Methodology</h4>
              <ol className="mt-3 space-y-3">
                {project.methodology.map((step, index) => (
                  <li key={step.title ?? index} className="flex gap-3 text-sm">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[0.625rem] text-muted"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span>
                      <span className="font-medium">{step.title}</span>
                      {step.detail && <span className="text-muted"> - {step.detail}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {(project.limitations || []).length > 0 && (
            <Callout variant="limitation" title="What this does not show" className="mt-6">
              <ul className="list-disc space-y-1.5 pl-4">
                {project.limitations.map((limitation, index) => (
                  <li key={index}>{limitation}</li>
                ))}
              </ul>
            </Callout>
          )}

          <ProjectLinks links={project.links} />
        </>
      ) : (
        <p className="mt-4 text-xs text-muted">
          <span className="font-medium">Role:</span> {project.role}
        </p>
      )}
    </Card>
  )
}
