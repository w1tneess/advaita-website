import PageHeader from "@/components/ui/PageHeader.jsx"
import { useContent } from "@/lib/content.jsx"
import Seo from "@/components/meta/Seo.jsx"
import { PUBLIC_ROUTES } from "@/config/nav.js"

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'philosophy')

function formatDate(value) {
	if (!value) return ""
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return ""
	return date.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	})
}

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
				<div className="flex items-center justify-between border-b border-line pb-2 sm:pb-3 mb-4 sm:mb-6 pt-[clamp(1.5rem,3.5vw,2.75rem)]">
					<h2 className="text-xl sm:text-2xl font-normal text-ink text-balance">Reading Focus</h2>
				</div>
				<div className="divide-y divide-line border-t border-b border-line">
					{thinkers.map((thinker) => {
						const thinkerNotes = notesByThinker.get(thinker.id) ?? []
						return (
							<article key={thinker.id || thinker.name} className="py-[clamp(1.25rem,2.5vw,2rem)] grid gap-3 sm:grid-cols-[1fr_2.2fr] items-baseline">
								<div className="font-mono text-xs tracking-widest uppercase text-muted">
									{thinker.name}
								</div>
								<div>
									<h3 className="text-base sm:text-lg font-normal text-ink mb-2 sm:mb-3 text-balance leading-snug">{thinker.description}</h3>
									
									<div className="mt-3 sm:mt-4">
										{thinkerNotes.length === 0 ? (
											<div className="text-xs sm:text-sm text-muted font-sans tracking-wide">No notes published yet</div>
										) : (
											<ul className="space-y-3 sm:space-y-4">
												{thinkerNotes.map((note) => (
													<li key={note.id} className="group">
														<p className="text-sm sm:text-base text-ink leading-snug group-hover:text-accent transition-colors text-balance">{note.title}</p>
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

			<section className="shell py-[clamp(2rem,4vw,3.5rem)]">
				<div className="flex items-center justify-between border-b border-line pb-2 sm:pb-3 mb-4 sm:mb-6">
					<h2 className="text-xl sm:text-2xl font-normal text-ink text-balance">Dated Log</h2>
				</div>
				<div className="mt-4 sm:mt-6">
					{notes.length === 0 ? (
						<div className="border border-line py-8 sm:py-10 text-center">
							<p className="text-sm text-muted font-display italic">The log is empty</p>
						</div>
					) : (
						<ul className="divide-y divide-line border-t border-b border-line">
							{notes.map((note) => (
								<li key={note.id} className="grid gap-2 sm:gap-3 py-[clamp(1.25rem,2.5vw,2rem)] sm:grid-cols-[1fr_2.2fr] items-baseline">
									<p className="font-mono text-xs tracking-wider uppercase text-muted">
										{formatDate(note.published_at || note.noted_on)}
									</p>
									<div>
										<h3 className="text-base sm:text-lg font-normal text-ink mb-2 text-balance">{note.title}</h3>
										{note.content ? (
											<div className="prose prose-invert prose-p:text-muted prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base max-w-none font-sans whitespace-pre-line">
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
