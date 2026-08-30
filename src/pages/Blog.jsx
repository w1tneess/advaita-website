import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Container from '@/components/layout/Container.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { pageLoadVariant, staggerContainer, staggerItem, scrollViewport } from '@/lib/animations.js'
import { formatDate } from '@/lib/format.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'blog')

export default function Blog() {
  const { publicBlogPosts } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/blog" />

      <Container>
        <motion.div
          className="py-12 sm:py-16 md:py-32"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <header className="max-w-2xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Writing
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Notes, research, and ideas as they develop.
            </p>
          </header>

          <motion.div
            className="mt-12 sm:mt-16 border-t border-line"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {publicBlogPosts.length === 0 ? (
              <p className="py-8 text-muted">No posts published yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {publicBlogPosts.map((post) => (
                  <motion.li key={post.id} variants={staggerItem} className="py-8 sm:py-10">
                    <article className="group relative max-w-3xl flex flex-col items-start justify-between">
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime={post.published_at} className="text-muted">
                          {formatDate(post.published_at)}
                        </time>
                        <span className="relative z-10 rounded-full bg-raised px-3 py-1.5 font-medium text-ink">
                          {post.category}
                        </span>
                      </div>
                      <div className="group relative">
                        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
                          <Link to={`/blog/${post.slug}`}>
                            <span className="absolute inset-0" />
                            {post.title}
                          </Link>
                        </h2>
                        <p className="mt-4 line-clamp-3 text-base leading-relaxed text-muted">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="relative mt-4 flex items-center gap-x-4">
                        <span className="text-sm font-semibold text-accent">Read more →</span>
                      </div>
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
