import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import NotFound from '@/pages/NotFound.jsx'
import CopyButton from '@/components/ui/CopyButton.jsx'
import OpenGraphPreview from '@/components/ui/OpenGraphPreview.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { formatDate } from '@/lib/format.js'

export default function NotePost() {
  const { slug } = useParams()
  const { findNoteBySlug } = useContent()

  const note = findNoteBySlug(slug)

  if (!note) {
    return <NotFound />
  }

  return (
    <>
      <Seo
        title={note.title}
        description={note.excerpt || note.title}
        path={`/philosophy/${note.slug}`}
        type="article"
        publishedAt={note.published_at}
        updatedAt={note.updated_at}
      />

      <article className="shell max-w-[52rem] mx-auto pt-10 pb-20 md:pt-16 md:pb-28">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            to="/philosophy"
            className="inline-flex items-center gap-2 font-utility text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Philosophy</span>
          </Link>
        </div>

        <header className="border-b border-line pb-10 mb-10">
          <div className="flex flex-wrap items-center gap-3 font-utility text-muted mb-4">
            <time dateTime={note.published_at} className="text-ink">
              {formatDate(note.published_at)}
            </time>
            <span>|</span>
            <span className="border border-line bg-surface px-2.5 py-0.5 text-ink">
              {note.category || 'Reading Note'}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-ink font-normal leading-[1.1]">
            {note.title}
          </h1>

          {note.excerpt && (
            <div className="mt-6 border-l border-ink pl-6 py-1">
              <p className="font-sans text-xl sm:text-2xl text-muted italic leading-relaxed">
                {note.excerpt}
              </p>
            </div>
          )}
        </header>

        {/* Content Body */}
        <div className="prose-body whitespace-pre-wrap text-base sm:text-lg font-sans leading-relaxed text-ink space-y-6">
          {note.content}
        </div>

        {/* Colophon & Share Registry */}
        <div className="mt-16 border-t border-line pt-8 space-y-6 font-utility">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-muted">
              PHILOSOPHICAL CITATION
            </span>
            <CopyButton
              getText={() => (typeof window !== 'undefined' ? window.location.href : `https://advaitachandra.in/philosophy/${note.slug}`)}
              label="Copy Note URL"
              copiedLabel="URL Copied!"
              showText={true}
              className="py-1 px-3 border border-line bg-surface text-muted hover:text-ink"
            />
          </div>

          <OpenGraphPreview
            title={note.title}
            description={note.excerpt || note.title}
            url={typeof window !== 'undefined' ? window.location.href : 'https://advaitachandra.in'}
          />
        </div>
      </article>
    </>
  )
}
