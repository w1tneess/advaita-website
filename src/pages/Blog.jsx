import { motion } from 'framer-motion'
import { Link } from 'react-router'
import Container from '@/components/layout/Container.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { pageLoadVariant, staggerContainer, staggerItem, scrollViewport } from '@/lib/animations.js'
import { formatDate } from '@/lib/format.js'
import { preloadRoute } from '@/lib/preload.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'blog')

export default function Blog() {
  const { publicBlogPosts, settings } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/blog" />

      <Container>
        <motion.div
          className="py-12 sm:py-16 md:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <div className="border-b border-line/40 pb-8 sm:pb-10">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent uppercase mb-3">
              <span>⟐</span>
              <span>ESSAYS & WORKING PAPERS</span>
            </div>

            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-ink">
                Writing
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">
                Notes, research, and ideas as they develop.
              </p>
            </div>
          </div>

          <motion.div
            className="mt-12 sm:mt-16 border-t border-line"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {publicBlogPosts.length === 0 ? (
              <div className="py-12">
                <EmptyState
                  title="No articles yet"
                  message={settings?.blogEmptyState || 'No public articles published yet.'}
                />
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {publicBlogPosts.map((post) => (
                  <motion.li key={post.id} variants={staggerItem} className="py-8 sm:py-10">
                    <article className="group relative max-w-3xl flex flex-col items-start justify-between">
                      <div className="flex items-center gap-x-3 text-xs">
                        <time dateTime={post.published_at} className="font-mono text-muted">
                          {formatDate(post.published_at)}
                        </time>
                        <span className="text-line">/</span>
                        <span className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs font-medium text-muted">
                          {post.category}
                        </span>
                      </div>
                      <h2 className="mt-3 font-display text-xl sm:text-2xl font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
                        <Link
                          to={`/blog/${post.slug}`}
                          onPointerEnter={() => preloadRoute(`/blog/${post.slug}`)}
                          onFocus={() => preloadRoute(`/blog/${post.slug}`)}
                          onTouchStart={() => preloadRoute(`/blog/${post.slug}`)}
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-2.5 line-clamp-3 text-sm sm:text-base leading-relaxed text-muted">
                        {post.excerpt}
                      </p>
                    </article>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </>
  )
}
