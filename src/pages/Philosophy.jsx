import { Link } from "react-router"
import PageHeader from "@/components/ui/PageHeader.jsx"
import EmptyState from "@/components/ui/EmptyState.jsx"
import { useContent } from "@/lib/content.jsx"
import Seo from "@/components/meta/Seo.jsx"
import { PUBLIC_ROUTES } from "@/config/nav.js"
import { BookOpen } from "lucide-react"

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'philosophy')

import { formatDate } from "@/lib/format"

export default function Philosophy() {
	const { philosophy, publicNotes } = useContent()
	const thinkers = philosophy?.thinkers || []
	const notes = publicNotes || []

	const notesByThinker = new Map()
	for (const note of notes) {
		if (note.thinker) {
			const list = notesByThinker.get(note.thinker) ?? []
			list.push(note)
			notesByThinker.set(note.thinker, list)
		}
	}

	return (
		<>
			<Seo title={ROUTE.title} description={ROUTE.description} path="/philosophy" />
			<PageHeader
				eyebrow="Philosophy"
				title="Reading"
				lead={philosophy?.intro || "Books I'm reading."}
			/>

			<section className="shell border-t border-line">
				<div className="flex items-center justify-between border-b border-line pb-4 mb-8 pt-[var(--spacing-fluid-section)]">
					<h2 className="text-2xl sm:text-3xl font-normal text-ink text-balance">Reading Focus</h2>
				</div>
				<div className="divide-y divide-line border-t border-b border-line lg:border-t-0 lg:border-b-0">
					{thinkers.map((thinker) => {
						const thinkerNotes = notesByThinker.get(thinker.id) ?? []
						return (
							<article key={thinker.id || thinker.name} className="py-8 sm:py-10 grid gap-4 sm:grid-cols-[1fr_2.2fr] items-baseline -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl hover:bg-surface/60 transition-all duration-250 ease-[var(--ease-out-quart)] first:pt-4">
								<div className="font-mono text-xs tracking-widest uppercase text-muted font-medium">
									{thinker.name}
								</div>
								<div>
									<h3 className="text-lg sm:text-xl font-normal text-ink mb-3 text-balance leading-snug">{thinker.description}</h3>
									
									<div className="mt-4 sm:mt-5">
										{thinkerNotes.length === 0 ? (
											<div className="text-sm text-muted font-sans tracking-wide">No notes published yet</div>
										) : (
											<ul className="space-y-4">
												{thinkerNotes.map((note) => (
													<li key={note.id} className="group">
														{note.slug ? (
															<Link to={`/philosophy/${note.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-250 ease-[var(--ease-out-quart)]">
																<p className="text-base sm:text-lg text-ink leading-snug group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)] text-balance underline decoration-line hover:decoration-line-strong underline-offset-4">{note.title}</p>
															</Link>
														) : (
															<p className="text-base sm:text-lg text-ink leading-snug text-balance">{note.title}</p>
														)}
														<p className="mt-1 font-mono text-xs text-muted">
															{formatDate(note.published_at || note.noted_on)}
														</p>
													</li>
												))}
											</ul>
										)}
									</div>
								</div>
							</article>
						)
					})}
				</div>
			</section>

			<section className="shell pt-[var(--spacing-fluid-section)] pb-24">
				<div className="flex items-center justify-between border-b border-line pb-4 mb-8">
					<h2 className="text-2xl sm:text-3xl font-normal text-ink text-balance">Dated Log</h2>
				</div>
				<div className="mt-6 sm:mt-8">
					{notes.length === 0 ? (
					<EmptyState
						icon={BookOpen}
						title="The log is empty"
						message="Notes and reading observations will appear here as they are published."
					/>
					) : (
						<ul className="divide-y divide-line border-t border-b border-line lg:border-t-0 lg:border-b-0">
							{notes.map((note) => (
								<li key={note.id} className="grid gap-4 sm:gap-6 py-8 sm:py-10 sm:grid-cols-[1fr_2.2fr] items-baseline -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl hover:bg-surface/40 transition-colors duration-250 ease-[var(--ease-out-quart)] first:pt-4">
									<p className="font-mono text-xs tracking-wider uppercase text-muted font-medium">
										{formatDate(note.published_at || note.noted_on)}
									</p>
									<div>
										<h3 className="text-lg sm:text-xl font-normal text-ink mb-3 text-balance">
											{note.slug ? (
												<Link to={`/philosophy/${note.slug}`} className="hover:text-muted transition-colors underline decoration-line/60 hover:decoration-line-strong underline-offset-4">
													{note.title}
												</Link>
											) : (
												note.title
											)}
										</h3>
										{note.content ? (
											<div className="prose prose-invert prose-p:text-muted prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg max-w-none font-sans whitespace-pre-line">
												{note.content}
											</div>
										) : null}
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</section>
		</>
	)
}
