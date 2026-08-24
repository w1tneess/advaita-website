import { ArrowLeft, Clock, RefreshCw } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import Container from '../components/Container.jsx'
import EmptyState from '../components/EmptyState.jsx'
import EpistemicLegend from '../components/EpistemicLegend.jsx'
import Prose from '../components/Prose.jsx'
import Seo from '../components/Seo.jsx'
import SourceList from '../components/SourceList.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import Tag from '../components/Tag.jsx'
import { useContent } from '../lib/content.jsx'
import { formatDate, isoDateAttr, readingMinutes } from '../lib/format.js'

export default function Article() {
  const { slug } = useParams()
  const { findPostBySlug, blogCategories, settings, profile, previewDrafts } = useContent()

  const post = findPostBySlug(slug)

  if (!post) {
    return (
      <>
        {/* A missing article is a real miss: do not let it be indexed. */}
        <Seo
          title="Article not found"
          description="This article does not exist, or is not published."
          path={`/blog/${slug ?? ''}`}
          noindex
        />
        <Container>
          <div className="py-20">
            <EmptyState
              title="Article not found"
              message="This article does not exist, or it has not been published. Nothing has been removed — it may simply never have been written."
              action={
                <Button to="/blog" variant="secondary">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  All writing
                </Button>
              }
            />
          </div>
        </Container>
      </>
    )
  }

  const minutes = post.readingTimeOverride || readingMinutes(post)
  const wasUpdated = post.updatedAt && post.updatedAt !== post.publishedAt
  const category = blogCategories.find((item) => item.slug === post.category)

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        publishedAt={isoDateAttr(post.publishedAt)}
        updatedAt={isoDateAttr(post.updatedAt)}
        noindex={post.status !== 'published'}
      />

      <Container width="prose">
        <article className="py-14 sm:py-20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All writing
          </Link>

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              {category && <Badge tone="accent">{category.name}</Badge>}
              {/* Visible only in preview mode, where drafts are shown deliberately. */}
              {previewDrafts && post.status !== 'published' && (
                <StatusBadge kind="post" value={post.status} />
              )}
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>

            {post.excerpt && <p className="mt-5 text-lg text-muted">{post.excerpt}</p>}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-5 text-sm text-muted">
              <span>{profile.name}</span>

              {post.publishedAt && (
                <span>
                  Published{' '}
                  <time dateTime={isoDateAttr(post.publishedAt)}>
                    {formatDate(post.publishedAt)}
                  </time>
                </span>
              )}

              {wasUpdated && (
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Last updated{' '}
                  <time dateTime={isoDateAttr(post.updatedAt)}>{formatDate(post.updatedAt)}</time>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {minutes} min read <span className="sr-only">(estimated)</span>
              </span>
            </div>
          </header>

          <Prose blocks={post.body} className="mt-10" />

          <SourceList sources={post.sources} />

          {(post.tags || []).length > 0 && (
            <div className="mt-10 border-t border-line pt-6">
              <h2 className="text-sm font-semibold">Tags</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Tag label={`#${tag}`} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {settings.showEpistemicLegend && (
            <EpistemicLegend className="mt-10" id="article-legend" />
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/blog" variant="secondary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All writing
            </Button>
            <Button to="/contact" variant="ghost">
              Found an error? Tell me
            </Button>
          </div>
        </article>
      </Container>
    </>
  )
}
