import { useParams } from 'react-router'
import NotFound from '@/pages/NotFound.jsx'
import Breadcrumbs from '@/components/ui/Breadcrumbs.jsx'
import Container from '@/components/layout/Container.jsx'
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

      <article className="py-12 sm:py-16 md:py-20">
        <Container width="prose">
          <Breadcrumbs />

          <header>
            <div className="flex items-center gap-x-4 text-sm mb-4">
              <time dateTime={note.published_at} className="text-muted">
                {formatDate(note.published_at)}
              </time>
              <span className="rounded-full bg-raised px-3 py-1 font-medium text-ink">
                {note.category}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-ink">
              {note.title}
            </h1>
            {note.excerpt && (
              <p className="mt-6 text-xl leading-relaxed text-muted border-l-2 border-line pl-6">
                {note.excerpt}
              </p>
            )}
          </header>

          <div className="mt-12 sm:mt-16 prose-body whitespace-pre-wrap text-base leading-loose text-ink">
            {note.content}
          </div>

          <div className="mt-16 border-t border-line/40 pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Share Note
              </span>
              <CopyButton
                getText={() => window.location.href}
                label="Copy Link"
                copiedLabel="Link Copied!"
                showText={true}
              />
            </div>

            <OpenGraphPreview
              title={note.title}
              description={note.excerpt || note.title}
              url={typeof window !== 'undefined' ? window.location.href : 'https://advaitachandra.in'}
            />
          </div>
        </Container>
      </article>
    </>
  )
}
