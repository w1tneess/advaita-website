import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { formatDate } from '@/lib/format.js'
import { preloadRoute } from '@/lib/preload.js'
import { ArrowRight } from 'lucide-react'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'blog')

export default function Blog() {
  const { publicBlogPosts, settings } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/blog" />

      <PageHeader
        eyebrow="Writing"
        title="Notes &amp; Logs"
        lead="Notes and observations on philosophy, history, politics, and technology."
      />

      <section className="shell pb-[clamp(2rem,4vw,3.5rem)]">
        {publicBlogPosts.length === 0 ? (
          <div className="py-10 border border-line bg-surface p-6 text-center font-mono text-muted">
            <p className="text-ink mb-2 text-sm">No articles yet</p>
            <p className="text-sm text-muted font-display italic">{settings?.blogEmptyState || 'Articles and notes will be published here.'}</p>
          </div>
        ) : (
          <ul className="border-t border-line">
            {publicBlogPosts.map((post) => (
              <li key={post.id} className="grid gap-3 sm:gap-6 border-b border-line py-[clamp(1.25rem,2.5vw,2rem)] sm:grid-cols-[10rem_minmax(0,1fr)] items-start">
                {/* Left Metadata Column */}
                <div className="font-mono text-xs text-muted space-y-2">
                  <time dateTime={post.published_at} className="block text-ink">
                    {formatDate(post.published_at)}
                  </time>
                  {post.category && (
                    <span className="inline-block bg-surface border border-line px-2 py-0.5 text-ink text-[11px]">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Right Content Column */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-normal text-ink leading-snug hover:text-accent transition-colors duration-200 text-balance">
                    <Link
                      to={`/blog/${post.slug}`}
                      onPointerEnter={() => preloadRoute(`/blog/${post.slug}`)}
                      onFocus={() => preloadRoute(`/blog/${post.slug}`)}
                      onTouchStart={() => preloadRoute(`/blog/${post.slug}`)}
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm sm:text-base text-muted font-sans leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-ink hover:text-accent transition-colors"
                    >
                      <span>Read note</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
