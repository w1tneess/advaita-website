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
        title="Longer pieces"
        lead="Essays on philosophy, history, politics and technology, written when a note outgrows a page."
      >
        {/* Nothing to search until something is published. */}
        {publicBlogPosts.length > 0 && (
          <div className="space-y-4 mt-6">
            {/* Search Input Bar */}
            <div className="relative max-w-md">
              <Search
                className="pointer-events-none absolute top-1/2 left-0 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search writing"
                aria-label="Filter blog notes"
                className="w-full border-0 border-b border-line bg-transparent py-2 pr-8 pl-6 text-[15px] text-ink placeholder:text-text-3 focus:border-ink focus:outline-none transition-colors"
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
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                    {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      aria-pressed={activeCategory === cat}
                      className={`pen-link min-w-6 py-1 text-[15px] ${activeCategory === cat ? 'text-ink [background-size:100%_1px]' : 'text-muted hover:text-ink'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-[15px] text-text-3 tabular-nums">
                  Showing {filteredPosts.length} of {publicBlogPosts.length}
                </div>
              </div>
            )}
          </div>
        )}
      </PageHeader>

      <section className="shell pb-24 pt-8">
        {publicBlogPosts.length === 0 ? (
          <div className="folio"><div className="folio-body">
            <EmptyState
            icon={FileText}
            title="No articles yet"
            message={settings?.blogEmptyState || 'Articles and notes will be published here.'}
            action={
              <Link
                to="/philosophy"
                className="btn-ink is-ghost"
              >
                Read the philosophy notes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          </div></div>
        ) : filteredPosts.length === 0 ? (
          <div className="border-t border-line py-16 text-center text-[15px] text-muted">
            No articles match the filter "{searchQuery}".
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {filteredPosts.map((post) => {
              const estMinutes = readingMinutes(post.content || post.excerpt || '')

              return (
                <li
                  key={post.id}
                  className="group folio gap-y-4 py-10"
                >
                  {/* Left Metadata Column */}
                  <div className="folio-margin text-[14px] text-muted space-y-1 tabular-nums">
                    <time dateTime={post.published_at} className="block text-ink">
                      {formatDate(post.published_at)}
                    </time>
                    {post.category && (
                      <span className="block">
                        {post.category}
                      </span>
                    )}
                    <span className="block">{estMinutes} min</span>
                  </div>

                  <div className="folio-body">
                    <h2 className="text-[length:var(--text-3xl)] leading-[1.05] tracking-[-0.035em] transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-2">
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
                      <p className="mt-4 max-w-2xl text-[17px] text-muted leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
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
