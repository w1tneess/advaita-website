import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import NotFound from '@/pages/NotFound.jsx'
import CopyButton from '@/components/ui/CopyButton.jsx'
import OpenGraphPreview from '@/components/ui/OpenGraphPreview.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { formatDate } from '@/lib/format.js'

export default function BlogPost() {
  const { slug } = useParams()
  const { findBlogPostBySlug } = useContent()

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
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-3 hover:text-copper transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Monographs</span>
          </Link>
        </div>

        <header className="border-b border-line pb-10 mb-10">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs mb-4">
            <time dateTime={post.published_at} className="text-copper">
              {formatDate(post.published_at)}
            </time>
            <span className="text-line-strong">|</span>
            <span className="border border-line bg-surface px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-text-2">
              {post.category || 'Monograph'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-text font-normal tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          {post.excerpt && (
            <div className="mt-6 border-l-2 border-copper pl-6 py-1">
              <p className="font-display text-xl sm:text-2xl text-text-2/95 font-light italic leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}
        </header>

        {/* Content Body */}
        <div className="prose-body whitespace-pre-wrap text-base sm:text-lg leading-relaxed text-text-2 font-light space-y-6">
          {post.content}
        </div>

        {/* Colophon & Share Registry */}
        <div className="mt-16 border-t border-line pt-8 space-y-6 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-text-3 uppercase tracking-wider">
              CITATION &amp; PROVENANCE
            </span>
            <CopyButton
              getText={() => window.location.href}
              label="Copy Monograph URL"
              copiedLabel="URL Copied!"
              showText={true}
              className="py-1 px-3 text-xs font-mono border border-line bg-surface hover:border-copper/60 hover:text-copper"
            />
          </div>

          <OpenGraphPreview
            title={post.title}
            description={post.excerpt}
            url={typeof window !== 'undefined' ? window.location.href : 'https://advaitachandra.in'}
          />
        </div>
      </article>
    </>
  )
}
