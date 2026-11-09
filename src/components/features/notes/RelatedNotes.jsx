import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

export default function RelatedNotes({ currentSlug, posts = [] }) {
  const otherPosts = (posts || []).filter((post) => post.slug !== currentSlug)

  if (otherPosts.length === 0) return null

  // Grab up to 2 posts
  const related = otherPosts.slice(0, 2)

  return (
    <div className="mt-16 border-t border-line pt-8 print:hidden">
      <h2 className="text-[15px] text-muted mb-6">
        Related Notes &amp; Projects
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block border-t border-line pt-4"
          >
            <div className="flex items-center gap-2 text-[13px] text-text-3 mb-2 tabular-nums">
              <span>{post.category || 'Monograph'}</span>
            </div>
            <h3 className="text-[length:var(--text-lg)] tracking-[-0.02em] text-ink leading-tight mb-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted group-hover:text-ink transition-colors">
              <span>Read note</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
