import { FileText } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import Button from '../components/Button.jsx'
import Container from '../components/Container.jsx'
import EmptyState from '../components/EmptyState.jsx'
import EpistemicLegend from '../components/EpistemicLegend.jsx'
import FilterBar from '../components/FilterBar.jsx'
import PostCard from '../components/PostCard.jsx'
import SearchInput from '../components/SearchInput.jsx'
import Seo from '../components/Seo.jsx'
import Tag from '../components/Tag.jsx'
import { useContent } from '../lib/content.jsx'
import { matchesQuery, pluralize } from '../lib/format.js'
import { PUBLIC_ROUTES } from '../lib/routes.js'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { useFilters } from '../hooks/useFilters.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'blog')

const INITIAL_FILTERS = { query: '', category: 'all', tag: null }

const SEARCH_FIELDS = ['title', 'excerpt', 'tags']

export default function Blog() {
  const { publicPosts, blogCategories, activeTags, settings } = useContent()
  const { values, setValue, toggleValue, reset, hasActiveFilters } = useFilters(INITIAL_FILTERS)
  const debouncedQuery = useDebouncedValue(values.query, 200)

  const perPage = settings.postsPerPage || 6
  const [shown, setShown] = useState(perPage)

  // A narrowed result set should start from the top of the list, not mid-way.
  useEffect(() => {
    setShown(perPage)
  }, [debouncedQuery, values.category, values.tag, perPage])

  const counts = useMemo(() => {
    const result = { all: publicPosts.length }
    for (const category of blogCategories) {
      result[category.slug] = publicPosts.filter((post) => post.category === category.slug).length
    }
    return result
  }, [publicPosts, blogCategories])

  const filtered = useMemo(
    () =>
      publicPosts.filter((post) => {
        if (values.category !== 'all' && post.category !== values.category) return false
        if (values.tag && !(post.tags || []).includes(values.tag)) return false
        return matchesQuery(post, debouncedQuery, SEARCH_FIELDS)
      }),
    [publicPosts, values.category, values.tag, debouncedQuery],
  )

  const visible = filtered.slice(0, shown)
  const hasPosts = publicPosts.length > 0

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/blog" />

      <Container>
        <div className="py-14 sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Writing</h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-foreground-muted">
            Notes, research and unfinished thinking. Sources are cited, and each claim is
            labelled by the kind of claim it is.
          </p>

          {/* Search and filters are only useful once something exists to filter. */}
          {hasPosts && (
            <div className="mt-10 space-y-6">
              <SearchInput
                id="blog-search"
                label="Search writing"
                value={values.query}
                onChange={(value) => setValue('query', value)}
                placeholder="Search titles, summaries and tags…"
                hint="Filters the list below as you type."
                className="max-w-md"
              />

              <FilterBar
                label="Filter by category"
                options={blogCategories.map((category) => ({
                  value: category.slug,
                  label: category.name,
                }))}
                value={values.category}
                onChange={(value) => setValue('category', value)}
                counts={counts}
              />

              {activeTags.length > 0 && (
                <div role="group" aria-label="Filter by tag">
                  <p className="mb-2 text-sm font-medium">Filter by tag</p>
                  <div className="flex flex-wrap gap-2">
                    {activeTags.map((tag) => (
                      <Tag
                        key={tag.id}
                        label={`#${tag.name}`}
                        count={tag.count}
                        active={values.tag === tag.slug}
                        onClick={() => toggleValue('tag', tag.slug)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <p className="text-sm text-foreground-muted" role="status">
                  {filtered.length} {pluralize(filtered.length, 'article')}
                  {filtered.length !== publicPosts.length && ` of ${publicPosts.length}`}.
                </p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={reset}>
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {!hasPosts ? (
            /* Required empty state. No sample or fictional articles ship with this site. */
            <EmptyState
              className="mt-10"
              icon={FileText}
              title="Nothing published yet"
              message={settings.blogEmptyState}
              action={
                <Button to="/portfolio" variant="secondary" size="sm">
                  See the project work instead
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={FileText}
              title="No articles match those filters"
              message="Try a different category or tag, or clear the filters to see everything."
              action={
                <Button variant="secondary" size="sm" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                {visible.map((post) => (
                  <li key={post.id} className="h-full">
                    <PostCard post={post} headingLevel={2} />
                  </li>
                ))}
              </ul>

              {visible.length < filtered.length && (
                <div className="mt-8 flex justify-center">
                  <Button variant="secondary" onClick={() => setShown((count) => count + perPage)}>
                    Show more ({filtered.length - visible.length} remaining)
                  </Button>
                </div>
              )}
            </>
          )}

          {settings.showEpistemicLegend && (
            <EpistemicLegend className="mt-14" id="blog-legend" />
          )}
        </div>
      </Container>
    </>
  )
}
