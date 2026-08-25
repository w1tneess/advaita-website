import Callout from './Callout.jsx'

/**
 * Renders an article body from typed blocks.
 *
 * Bodies are structured data, not markup or markdown. Two consequences worth knowing:
 *
 *   1. Nothing here uses dangerouslySetInnerHTML, so stored content cannot inject
 *      script — there is no HTML parsing step to exploit.
 *   2. "Sourced fact / Analysis / Opinion / Limitation" is a property of the block
 *      rather than a convention the writer has to remember, so the labelling cannot
 *      drift out of sync with the styling.
 *
 * Text is rendered verbatim with line breaks preserved. There is no inline markup.
 */

function Heading({ block }) {
  const level = Math.min(Math.max(Number(block.level) || 2, 2), 4)
  const Tag = `h${level}`
  const sizes = {
    2: 'text-2xl mt-12 mb-4',
    3: 'text-xl mt-10 mb-3',
    4: 'text-lg mt-8 mb-2',
  }

  return <Tag className={`font-semibold ${sizes[level]}`}>{block.text}</Tag>
}

function Block({ block }) {
  switch (block.type) {
    case 'heading':
      return <Heading block={block} />

    case 'paragraph':
      return <p className="my-5 whitespace-pre-line">{block.text}</p>

    case 'list': {
      const items = (block.items || []).filter((item) => String(item).trim() !== '')
      if (!items.length) return null
      const Tag = block.style === 'ordered' ? 'ol' : 'ul'
      return (
        <Tag
          className={`my-5 space-y-2 pl-6 ${
            block.style === 'ordered' ? 'list-decimal' : 'list-disc'
          }`}
        >
          {items.map((item, index) => (
            <li key={index} className="whitespace-pre-line">
              {item}
            </li>
          ))}
        </Tag>
      )
    }

    case 'quote':
      return (
        <figure className="my-7 border-l-2 border-accent/50 pl-5">
          <blockquote className="text-lg leading-relaxed italic">{block.text}</blockquote>
          {block.attribution && (
            <figcaption className="mt-2 text-sm text-foreground-muted not-italic">
              — {block.attribution}
            </figcaption>
          )}
        </figure>
      )

    case 'callout':
      return (
        <Callout variant={block.variant} title={block.title} className="my-7">
          <p className="whitespace-pre-line">{block.text}</p>
        </Callout>
      )

    case 'code':
      return (
        <div className="my-7">
          {block.language && (
            <p className="mb-1 font-mono text-xs text-foreground-muted">{block.language}</p>
          )}
          <pre className="overflow-x-auto rounded-card border border-border bg-surface-elevated p-4 text-sm">
            <code className="font-mono">{block.code}</code>
          </pre>
        </div>
      )

    case 'image': {
      if (!block.src) return null
      return (
        <figure className="my-8">
          <img
            src={block.src}
            alt={block.alt || ''}
            loading="lazy"
            decoding="async"
            className="w-full rounded-card border border-border"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-foreground-muted">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    default:
      return null
  }
}

export default function Prose({ blocks = [], className = '' }) {
  if (!blocks.length) return null

  return (
    <div className={`prose-body ${className}`}>
      {blocks.map((block, index) => (
        <Block key={block.id ?? index} block={block} />
      ))}
    </div>
  )
}
