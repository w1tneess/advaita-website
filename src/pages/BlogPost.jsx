import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import NotFound from '@/pages/NotFound.jsx'
import CopyButton from '@/components/ui/CopyButton.jsx'
import { RelatedNotes, ReadingProgressBar } from '@/components/features/notes'
import Seo from '@/components/meta/Seo.jsx'
import { SITE_URL } from '@/config/site.js'
import { useContent } from '@/lib/content.jsx'
import { formatDate, isoDateAttr, readingMinutes } from '@/lib/format'

export default function BlogPost() {
  const { slug } = useParams()
  const { findBlogPostBySlug, blog = [] } = useContent()
  const post = findBlogPostBySlug(slug)
  if (!post) return <NotFound />

  const minutes = readingMinutes(post.content || post.excerpt || '')
  const url = `${SITE_URL}/blog/${post.slug}`

  return (
    <>
      <ReadingProgressBar />
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
      />

      <article className="shell folio pt-32 pb-24 lg:pt-40 lg:pb-36">
        <aside className="folio-margin mb-10 text-[15px] text-muted lg:mb-0">
          <Link to="/blog" className="group inline-flex items-center gap-2 text-ink print:hidden">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            <span className="pen-link">All writing</span>
          </Link>
          <dl className="mt-10 space-y-4 lg:sticky lg:top-28">
            {post.published_at && (
              <div><dt className="text-text-3">Written</dt><dd className="tabular-nums"><time dateTime={isoDateAttr(post.published_at)}>{formatDate(post.published_at)}</time></dd></div>
            )}
            {post.category && <div><dt className="text-text-3">Subject</dt><dd>{post.category}</dd></div>}
            <div><dt className="text-text-3">Length</dt><dd className="tabular-nums">{minutes} min</dd></div>
          </dl>
        </aside>

        <div className="folio-body lg:col-end-11">
          <h1 className="text-[length:var(--text-5xl)] leading-[1.02] tracking-[-0.04em] -ml-[0.03em]">{post.title}</h1>
          {post.excerpt && <p className="mt-8 text-[length:var(--text-xl)] leading-snug tracking-[-0.015em] text-muted">{post.excerpt}</p>}

          <div className="prose-body mt-14 max-w-[38rem] whitespace-pre-wrap text-[18px] text-ink">{post.content}</div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[15px] text-muted print:hidden">
            <p>Disagree, or know a better source? <Link to="/contact" className="pen-link text-ink">Write to me</Link></p>
            <CopyButton getText={() => (typeof window !== 'undefined' ? window.location.href : url)} label="Copy link" copiedLabel="Copied" showText />
          </div>

          <RelatedNotes currentSlug={post.slug} posts={blog} />
        </div>
      </article>
    </>
  )
}
