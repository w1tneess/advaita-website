import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, isoDateAttr } from '@/lib/format'
import PenStroke from '@/components/features/ink/PenStroke.jsx'

/** Index list of the latest notes: title, what it is about, date. */
export default function NotesSection({ notes = [], thinkers = [] }) {
  if (!notes.length) return null
  const nameOf = (id) => thinkers.find((t) => t.id === id)?.name

  return (
    <section className="shell folio py-24 lg:py-32" aria-labelledby="notes-heading">
      <div className="folio-margin mb-8 lg:mb-0" data-reveal>
        <h2 id="notes-heading" className="text-[length:var(--text-2xl)] tracking-[-0.03em]">Notes</h2>
        <PenStroke seed={0} className="mt-1" />
        <p className="mt-3 max-w-[16rem] text-[15px] leading-snug text-muted">
          Short entries where a book meets something I noticed
        </p>
        <Link to="/philosophy" className="pen-link mt-6 inline-block text-[15px] text-ink">
          All notes
        </Link>
      </div>

      <ol className="folio-body border-t border-line">
        {notes.slice(0, 5).map((note, i) => (
          <li key={note.id} className="border-b border-line" data-reveal style={{ '--i': i }}>
            <Link
              to={`/philosophy/${note.slug}`}
              className="group grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline lg:py-7"
            >
              <span className="flex items-baseline gap-3">
                <span className="text-[length:var(--text-xl)] leading-tight tracking-[-0.025em] transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-2">
                  {note.title}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
              </span>
              <span className="flex gap-4 text-[14px] text-muted tabular-nums sm:justify-end">
                {nameOf(note.thinker) && <span>{nameOf(note.thinker)}</span>}
                {note.published_at && <time dateTime={isoDateAttr(note.published_at)}>{formatDate(note.published_at)}</time>}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
