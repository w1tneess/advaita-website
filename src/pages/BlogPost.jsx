import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import NotFound from '@/pages/NotFound.jsx'
import CopyButton from '@/components/ui/CopyButton.jsx'
import OpenGraphPreview from '@/components/ui/OpenGraphPreview.jsx'
import RelatedNotes from '@/components/ui/RelatedNotes.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { formatDate } from '@/lib/format.js'

export default function BlogPost() {
  const { slug } = useParams()
  const { findBlogPostBySlug, blog = [] } = useContent()

  const post = findBlogPostBySlug(slug)

  if (!post) {
    return <NotFound />
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        publishedAt={post.published_at}
        updatedAt={post.updated_at}
      />

      <article className="shell max-w-[52rem] mx-auto pt-10 pb-20 md:pt-16 md:pb-28">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-utility text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Notes &amp; Logs</span>
          </Link>
        </div>

        <header className="border-b border-line pb-10 mb-10">
          <div className="flex flex-wrap items-center gap-3 font-utility text-muted mb-4">
            <time dateTime={post.published_at} className="text-ink">
              {formatDate(post.published_at)}
            </time>
            <span>|</span>
            <span className="border border-line bg-surface px-2.5 py-0.5 text-ink">
              {post.category || 'Note'}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-ink font-normal leading-[1.1]">
            {post.title}
          </h1>

          {post.excerpt && (
            <div className="mt-6 border-l border-ink pl-6 py-1">
              <p className="font-sans text-xl sm:text-2xl text-muted italic leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}
        </header>

        {/* Content Body */}
        <div className="prose-body whitespace-pre-wrap text-base sm:text-lg font-sans leading-relaxed text-ink space-y-6">
          {post.content}
        </div>

        {/* Colophon & Share Registry */}
        <div className="mt-16 border-t border-line pt-8 space-y-6 font-utility">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-muted">
              CITATION &amp; PROVENANCE
            </span>
            <CopyButton
              getText={() => (typeof window !== 'undefined' ? window.location.href : `https://advaitachandra.in/blog/${post.slug}`)}
              label="Copy URL"
              copiedLabel="URL Copied!"
              showText={true}
              className="py-1 px-3 border border-line bg-surface text-muted hover:text-ink"
            />
          </div>

          <OpenGraphPreview
            title={post.title}
            description={post.excerpt}
            url={typeof window !== 'undefined' ? window.location.href : 'https://advaitachandra.in'}
          />
        </div>

        {/* Related Notes for Internal Linking */}
        <RelatedNotes currentSlug={post.slug} posts={blog} />
      </article>
    </>
  )
}
