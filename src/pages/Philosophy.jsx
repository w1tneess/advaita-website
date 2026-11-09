import { Link } from 'react-router'
import { BookOpen } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { useContent } from '@/lib/content.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { formatDate, isoDateAttr } from '@/lib/format'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'philosophy')

export default function Philosophy() {
	const { philosophy, publicNotes } = useContent()
	const thinkers = [...(philosophy?.thinkers || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
	const notes = publicNotes || []
	const notesFor = (id) => notes.filter((note) => note.thinker === id)

	return (
		<>
			<Seo title={ROUTE.title} description={ROUTE.description} path="/philosophy" />
			<PageHeader eyebrow="Philosophy" title="Reading, slowly" lead={philosophy?.intro || 'Books I am reading.'} />

			<section className="shell pb-24 lg:pb-32" aria-labelledby="thinkers-heading">
				<h2 id="thinkers-heading" className="sr-only">Who I am reading</h2>
				<ul className="border-t border-line">
					{thinkers.map((thinker) => {
						const own = notesFor(thinker.id)
						return (
							<li key={thinker.id || thinker.name} className="folio gap-y-4 border-b border-line py-10 lg:py-14">
								<h3 className="folio-margin text-[length:var(--text-2xl)] leading-tight tracking-[-0.03em]">{thinker.name}</h3>
								<div className="folio-body grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
									<p className="text-[length:var(--text-lg)] leading-relaxed text-muted max-w-xl">{thinker.description}</p>
									<div>
										{own.length === 0 ? (
											<p className="text-[15px] text-text-3">No note yet</p>
										) : (
											<ul className="space-y-4">
												{own.map((note) => (
													<li key={note.id}>
														<Link to={`/philosophy/${note.slug}`} className="group block">
															<span className="pen-link text-[17px] leading-snug text-ink">{note.title}</span>
															<span className="mt-1 block text-[14px] text-muted tabular-nums">{formatDate(note.published_at)}</span>
														</Link>
													</li>
												))}
											</ul>
										)}
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			</section>

			<section className="shell folio pb-28 lg:pb-40" aria-labelledby="log-heading">
				<div className="folio-margin mb-8 lg:mb-0">
					<h2 id="log-heading" className="text-[length:var(--text-2xl)] tracking-[-0.03em]">All notes</h2>
					<p className="mt-3 max-w-[16rem] text-[15px] leading-snug text-muted">Newest first</p>
				</div>
				<div className="folio-body">
					{notes.length === 0 ? (
						<EmptyState icon={BookOpen} title="No notes yet" message="Notes appear here as they are published." />
					) : (
						<ol className="border-t border-line">
							{notes.map((note) => (
								<li key={note.id} className="border-b border-line">
									<Link to={`/philosophy/${note.slug}`} className="group grid gap-3 py-8 sm:grid-cols-[minmax(0,1fr)_8rem] sm:gap-8">
										<span>
											<span className="block text-[length:var(--text-xl)] leading-tight tracking-[-0.025em] transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-2">
												{note.title}
											</span>
											{note.excerpt && <span className="mt-3 block max-w-2xl text-[16px] leading-relaxed text-muted">{note.excerpt}</span>}
										</span>
										<time dateTime={isoDateAttr(note.published_at)} className="text-[14px] text-muted tabular-nums sm:text-right">
											{formatDate(note.published_at)}
										</time>
									</Link>
								</li>
							))}
						</ol>
					)}
				</div>
			</section>
		</>
	)
}
