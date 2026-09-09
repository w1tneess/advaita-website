import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
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
        title="Essays &amp; Writing"
        lead="Articles, notes, and observations on philosophy, history, politics, and technology."
      />

      <section className="shell pb-24 md:pb-32">
        {publicBlogPosts.length === 0 ? (
          <div className="py-12 border border-line bg-surface/40 p-8">
            <EmptyState
              title="No articles yet"
              message={settings?.blogEmptyState || 'Articles and notes will be published here.'}
            />
          </div>
        ) : (
          <ul className="border-t border-line">
            {publicBlogPosts.map((post, index) => (
              <Reveal key={post.id} delay={index * 0.04}>
                <li className="grid gap-4 border-b border-line py-8 sm:grid-cols-[11rem_minmax(0,1fr)] items-start">
                  {/* Left Metadata Column */}
                  <div className="font-mono text-xs text-text-3 space-y-2">
                    <time dateTime={post.published_at} className="block text-copper">
                      {formatDate(post.published_at)}
                    </time>
                    {post.category && (
                      <span className="inline-block border border-line bg-surface px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-text-2">
                        {post.category}
                      </span>
                    )}
                  </div>

                  {/* Right Content Column */}
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl text-text font-normal leading-snug hover:text-copper transition-colors duration-300">
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
                      <p className="mt-3 text-lead text-text-2 font-light leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-4">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-copper hover:text-copper-strong transition-colors"
                      >
                        <span>Read essay</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        )}

        {/* Colophon Footnote */}
        <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-text-3">
          <span>Articles &amp; Reading Notes</span>
          <span className="text-copper">Location: India</span>
        </div>
      </section>
    </>
  )
}
