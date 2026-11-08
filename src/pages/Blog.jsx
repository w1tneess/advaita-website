import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { formatDate, matchesQuery, readingMinutes } from '@/lib/format'
import { preloadRoute } from '@/lib/preload'
import { ArrowRight, FileText, Search, X } from 'lucide-react'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'blog')

export default function Blog() {
  const { publicBlogPosts = [], settings } = useContent()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    const cats = new Set()
    publicBlogPosts.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    return ['All', ...Array.from(cats)]
  }, [publicBlogPosts])

  const filteredPosts = useMemo(() => {
    return publicBlogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' ||
        post.category?.toLowerCase() === activeCategory.toLowerCase()

      if (!matchesCategory) return false

      if (!searchQuery.trim()) return true

      return matchesQuery(post, searchQuery, ['title', 'excerpt', 'category', 'content'])
    })
  }, [publicBlogPosts, activeCategory, searchQuery])

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/blog" noindex={publicBlogPosts.length === 0} />

      <PageHeader
        eyebrow="Writing"
        title="Notes &amp; Logs"
        lead="Notes and observations on philosophy, history, politics, and technology."
      >
        {/* Nothing to search until something is published. */}
        {publicBlogPosts.length > 0 && (
          <div className="space-y-4 mt-6">
            {/* Search Input Bar */}
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes and observations…"
                aria-label="Filter blog notes"
                className="w-full rounded-full border border-line bg-surface/70 py-2.5 pr-10 pl-10 text-xs sm:text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear filter"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted hover:text-ink hover:bg-raised transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            {categories.length > 2 && (
              <div className="flex flex-wrap items-center justify-between gap-3 font-utility">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <span className="text-muted mr-1 text-xs">Categories:</span>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 min-h-[32px] text-xs transition duration-150 cursor-pointer rounded-full active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${
                        activeCategory === cat
                          ? 'bg-ink text-canvas font-medium shadow-subtle'
                          : 'bg-surface border border-line/60 text-muted hover:text-ink hover:border-line-strong hover:bg-surface/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="font-mono text-xs text-muted">
                  Showing {filteredPosts.length} of {publicBlogPosts.length}
                </div>
              </div>
            )}
          </div>
        )}
      </PageHeader>

      <section className="shell pb-24 pt-8">
        {publicBlogPosts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No articles yet"
            message={settings?.blogEmptyState || 'Articles and notes will be published here.'}
            action={
              <Link
                to="/philosophy"
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-strong underline-offset-4 hover:underline"
              >
                Read the philosophy notes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
        ) : filteredPosts.length === 0 ? (
          <div className="bg-surface p-[clamp(1.5rem,3vw,2.5rem)] text-center text-sm font-utility text-muted border border-line rounded-xl">
            No articles match the filter "{searchQuery}".
          </div>
        ) : (
          <ul className="divide-y divide-line border-t border-b border-line lg:border-t-0 lg:border-b-0">
            {filteredPosts.map((post) => {
              const estMinutes = readingMinutes(post.content || post.excerpt || '')

              return (
                <li
                  key={post.id}
                  className="group grid gap-4 sm:gap-6 py-8 sm:py-10 sm:grid-cols-[10rem_minmax(0,1fr)] items-start -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl hover:bg-surface/40 hover:shadow-subtle hover:-translate-y-0.5 active:scale-[0.98] transition duration-250 ease-[var(--ease-out-quart)] first:pt-4"
                >
                  {/* Left Metadata Column */}
                  <div className="font-mono text-xs text-muted space-y-2">
                    <time dateTime={post.published_at} className="block text-ink font-medium">
                      {formatDate(post.published_at)}
                    </time>
                    {post.category && (
                      <span className="inline-block bg-surface border border-line/60 px-2 py-0.5 text-ink text-[0.75rem] rounded-sm shadow-subtle group-hover:border-line-strong transition-colors duration-150">
                        {post.category}
                      </span>
                    )}
                    <span className="block text-[0.75rem] text-muted">{estMinutes} min read</span>
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
                      <span className="inline-flex items-center gap-2 font-mono text-xs text-ink group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)]">
                        <span>Read note</span>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition duration-250 ease-[var(--ease-out-quart)] -translate-x-2 group-hover:translate-x-0" />
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
