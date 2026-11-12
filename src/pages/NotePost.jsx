import { useParams, Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import NotFound from '@/pages/NotFound.jsx'
import CopyButton from '@/components/ui/CopyButton.jsx'
import { ReadingProgressBar } from '@/components/features/notes'
import Seo from '@/components/meta/Seo.jsx'
import { SITE_URL } from '@/config/site.js'
import { useContent } from '@/lib/content.jsx'
import { formatDate, isoDateAttr, readingMinutes } from '@/lib/format'

// Paragraphs the author explicitly opens in the first person are their own reading, not a source.
const OWN_VIEW = /^(my (working )?hypothesis|my reading|my view|i think|i suspect|in my view)\b/i

export default function NotePost() {
  const { slug } = useParams()
  const { findNoteBySlug, philosophy } = useContent()
  const note = findNoteBySlug(slug)
  if (!note) return <NotFound />

  const minutes = readingMinutes(note.content || note.excerpt || '')
  const thinker = philosophy?.thinkers?.find((t) => t.id === note.thinker)?.name
  const paragraphs = (note.content || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const url = `${SITE_URL}/philosophy/${note.slug}`

  return (
    <>
      <ReadingProgressBar />
      <Seo
        title={note.title}
        description={note.excerpt || note.title}
        path={`/philosophy/${note.slug}`}
        type="article"
        publishedAt={note.published_at}
        updatedAt={note.updated_at}
      />

      <article className="shell folio pt-32 pb-24 lg:pt-40 lg:pb-36">
        <aside className="folio-margin mb-10 text-[15px] text-muted lg:mb-0">
          <Link to="/philosophy" className="group inline-flex items-center gap-2 text-ink print:hidden">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            <span className="pen-link">All notes</span>
          </Link>
          <dl className="mt-10 space-y-4 lg:sticky lg:top-28">
            {note.published_at && (
              <div><dt className="text-text-3">Written</dt><dd className="tabular-nums"><time dateTime={isoDateAttr(note.published_at)}>{formatDate(note.published_at)}</time></dd></div>
            )}
            {thinker && <div><dt className="text-text-3">Reading</dt><dd>{thinker}</dd></div>}
            {note.category && <div><dt className="text-text-3">Subject</dt><dd>{note.category}</dd></div>}
            <div><dt className="text-text-3">Length</dt><dd className="tabular-nums">{minutes} min</dd></div>
          </dl>
        </aside>

        <div className="folio-body lg:col-end-11">
          <h1 className="text-[length:var(--text-5xl)] leading-[1.02] tracking-[-0.04em] -ml-[0.03em]">{note.title}</h1>
          {note.excerpt && <p className="mt-8 text-[length:var(--text-xl)] leading-snug tracking-[-0.015em] text-muted">{note.excerpt}</p>}

          <div className="prose-body mt-14 max-w-[38rem] text-[18px] text-ink">
            {paragraphs.map((p, i) =>
              OWN_VIEW.test(p) ? (
                <div key={i} className="relative my-10 border-l-2 border-analysis pl-5" data-ink="analysis">
                  <p className="mark-label mb-2" data-ink="analysis">my inference</p>
                  <p>{p}</p>
                </div>
              ) : (
                <p key={i}>{p}</p>
              ),
            )}
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-[15px] text-muted print:hidden">
            <p>Disagree, or know a better source? <Link to="/contact" className="pen-link text-ink">Write to me</Link></p>
            <CopyButton
              getText={() => (typeof window !== 'undefined' ? window.location.href : url)}
              label="Copy link"
              copiedLabel="Copied"
              showText
            />
          </div>
        </div>
      </article>
    </>
  )
}
