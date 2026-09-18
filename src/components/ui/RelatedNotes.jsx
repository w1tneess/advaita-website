import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

export default function RelatedNotes({ currentSlug, posts = [] }) {
  // Simple related notes logic: pick 2 other posts, prefer those with same category if available
  const otherPosts = posts.filter(post => post.slug !== currentSlug)
  
  if (otherPosts.length === 0) return null

  // Grab up to 2 posts
  const related = otherPosts.slice(0, 2)

  return (
    <div className="mt-16 border-t border-line pt-8">
      <h3 className="font-mono text-xs text-text-3 uppercase tracking-wider mb-6">
        Related Notes & Projects
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group block p-4 border border-line bg-surface hover:border-copper/60 transition-colors"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] text-text-3 mb-2 uppercase tracking-wider">
              <span>{post.category || 'Monograph'}</span>
            </div>
            <h4 className="font-display text-lg text-text group-hover:text-copper transition-colors leading-tight mb-2">
              {post.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-text-2 group-hover:text-text transition-colors">
              <span>Read note</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
