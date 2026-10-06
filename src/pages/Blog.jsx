import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { formatDate } from '@/lib/format.js'
import { preloadRoute } from '@/lib/preload.js'
import { ArrowRight, FileText } from 'lucide-react'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'blog')

export default function Blog() {
  const { publicBlogPosts, settings } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/blog" />

      <PageHeader
        eyebrow="Writing"
        title="Notes & Logs"
        lead="Notes and observations on philosophy, history, politics, and technology."
      />

      <section className="shell pb-24 pt-8">
        {publicBlogPosts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No articles yet"
            message={settings?.blogEmptyState || 'Articles and notes will be published here.'}
          />
        ) : (
          <ul className="divide-y divide-line border-t border-b border-line lg:border-t-0 lg:border-b-0">
            {publicBlogPosts.map((post) => (
              <li key={post.id} className="group grid gap-4 sm:gap-6 py-8 sm:py-10 sm:grid-cols-[10rem_minmax(0,1fr)] items-start -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl hover:bg-surface/40 hover:shadow-subtle hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-250 ease-[var(--ease-out-quart)] first:pt-4">
                {/* Left Metadata Column */}
                <div className="font-mono text-xs text-muted space-y-2">
                  <time dateTime={post.published_at} className="block text-ink font-medium">
                    {formatDate(post.published_at)}
                  </time>
                  {post.category && (
                    <span className="inline-block bg-surface border border-line/60 px-2 py-0.5 text-ink text-[11px] rounded-sm shadow-subtle group-hover:border-line-strong transition-colors duration-150">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Right Content Column */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-normal text-ink leading-snug group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)] text-balance">
                    <Link
                      to={`/blog/${post.slug}`}
                      onPointerEnter={() => preloadRoute(`/blog/${post.slug}`)}
                      onFocus={() => preloadRoute(`/blog/${post.slug}`)}
                      onTouchStart={() => preloadRoute(`/blog/${post.slug}`)}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-sm block"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  {post.excerpt && (
                    <p className="mt-3 text-base sm:text-lg text-muted font-sans leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-5">
                    <span
                      className="inline-flex items-center gap-2 font-mono text-xs text-ink group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)]"
                    >
                      <span>Read note</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-250 ease-[var(--ease-out-quart)] -translate-x-2 group-hover:translate-x-0" />
                    </span>
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
