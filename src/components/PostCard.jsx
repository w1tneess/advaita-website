import { Clock, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from './Badge.jsx'
import Card from './Card.jsx'
import StatusBadge from './StatusBadge.jsx'
import { useContent } from '../lib/content.jsx'
import { formatDate, isoDateAttr, readingMinutes } from '../lib/format.js'

/** Article summary card for the blog index and the home page. */
export default function PostCard({ post, headingLevel = 3, showStatus = false }) {
  const { blogCategories } = useContent()
  const Heading = `h${headingLevel}`

  const category = blogCategories.find((item) => item.slug === post.category)
  const minutes = readingMinutes(post)

  return (
    <Card as="article" interactive className="flex h-full flex-col p-6">
      {/* Metadata badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {category && <Badge tone="accent">{category.name}</Badge>}
        {showStatus && <StatusBadge kind="post" value={post.status} />}
      </div>

      {/* Heading */}
      <Heading className="font-semibold text-lg leading-snug">
        <Link
          to={`/blog/${post.slug}`}
          className="text-foreground hover:text-accent transition-colors"
        >
          {post.title}
        </Link>
      </Heading>

      {/* Excerpt */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted">{post.excerpt}</p>

      {/* Footer: date, updated, reading time */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-foreground-subtle border-t border-border pt-4">
        <time dateTime={isoDateAttr(post.publishedAt)}>{formatDate(post.publishedAt)}</time>

        {post.updatedAt && post.updatedAt !== post.publishedAt && (
          <span className="inline-flex items-center gap-1">
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            Updated <time dateTime={isoDateAttr(post.updatedAt)}>{formatDate(post.updatedAt)}</time>
          </span>
        )}

        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {minutes} min read
          <span className="sr-only"> (estimated)</span>
        </span>
      </div>

      {/* Tags */}
      {(post.tags || []).length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag} className="text-xs text-foreground-subtle">
              #{tag}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
