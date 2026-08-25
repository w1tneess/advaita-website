import { ExternalLink } from 'lucide-react'

import { formatDateShort } from '../lib/format.js'

/**
 * Numbered reference list for an article or project.
 *
 * Renders nothing when there are no sources, rather than an empty "Sources" heading —
 * an article with no references should not imply that it has some.
 */
export default function SourceList({ sources = [], headingLevel = 2, id = 'sources' }) {
  if (!sources.length) return null

  const Heading = `h${headingLevel}`

  return (
    <section aria-labelledby={`${id}-heading`} className="mt-12 border-t border-border pt-8">
      <Heading id={`${id}-heading`} className="text-lg font-semibold">
        Sources and references
      </Heading>
      <p className="mt-1 mb-5 text-sm text-foreground-muted">
        Every sourced claim above traces back to one of these.
      </p>

      <ol className="space-y-4">
        {sources.map((source, index) => (
          <li key={source.id ?? index} className="flex gap-3 text-sm">
            <span
              className="mt-0.5 shrink-0 font-mono text-xs text-foreground-muted tabular-nums"
              aria-hidden="true"
            >
              [{index + 1}]
            </span>
            <div className="min-w-0">
              <p className="font-medium">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-baseline gap-1 text-accent underline underline-offset-3 hover:text-accent-strong"
                  >
                    {source.title}
                    <ExternalLink className="h-3 w-3 shrink-0 self-center" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  source.title
                )}
              </p>

              {(source.publisher || source.accessedAt) && (
                <p className="mt-0.5 text-foreground-muted">
                  {source.publisher}
                  {source.publisher && source.accessedAt && ' · '}
                  {source.accessedAt && `accessed ${formatDateShort(source.accessedAt)}`}
                </p>
              )}

              {source.note && <p className="mt-1 text-foreground-muted italic">{source.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
