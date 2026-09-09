import PageHeader from "@/components/ui/PageHeader.jsx"
import Pending from "@/components/ui/Pending.jsx"
import Reveal from "@/components/ui/Reveal.jsx"
import SectionIntro from "@/components/ui/SectionIntro.jsx"
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
		// New data format uses category instead of thinker id, so we'll do our best to map or just use empty arrays
        // If note has a thinker field (legacy), use it.
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
				lead={philosophy.intro || "Books I'm reading."}
			/>

			<section className="shell">
				<SectionIntro eyebrow="Reading notes" title="By writer" />
				<div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{thinkers.map((thinker, index) => {
						const thinkerNotes = notesByThinker.get(thinker.id) ?? []
						return (
							<Reveal key={thinker.id} delay={index * 0.04}>
								<article className="flex h-full flex-col border border-line bg-surface p-6">
									<h3 className="text-h3 text-text">{thinker.name}</h3>
									<p className="mt-1 text-meta text-text-3">{thinker.description}</p>
									<div className="mt-5 flex-1">
										{thinkerNotes.length === 0 ? (
											<Pending>No notes written yet</Pending>
										) : (
											<ul className="space-y-3">
												{thinkerNotes.map((note) => (
													<li key={note.id}>
														<p className="text-text-2">{note.title}</p>
														<p className="mt-1 text-meta text-text-3">
															{formatDate(note.published_at || note.noted_on)}
														</p>
													</li>
												))}
											</ul>
										)}
									</div>
								</article>
							</Reveal>
						)
					})}
				</div>
			</section>

			<section className="shell pt-20 md:pt-28 pb-20 md:pb-28">
				<SectionIntro eyebrow="Notes and observations" title="Dated log" />
				<div className="mt-8">
					{notes.length === 0 ? (
						<Reveal>
							<div className="border border-dashed border-line-strong bg-surface/60 px-6 py-10">
								<Pending>The log is empty</Pending>
								<p className="mt-4 max-w-[36rem] text-meta text-text-3">
									Entries are added from the admin panel.
								</p>
							</div>
						</Reveal>
					) : (
						<ul className="border-t border-line">
							{notes.map((note, index) => (
								<Reveal key={note.id} delay={index * 0.03}>
									<li className="grid gap-2 border-b border-line py-6 sm:grid-cols-[9rem_minmax(0,1fr)]">
										<p className="text-meta text-text-3">
											{formatDate(note.published_at || note.noted_on)}
										</p>
										<div>
											<h3 className="text-h3 text-text">{note.title}</h3>
											{note.content ? (
												<p className="mt-2 whitespace-pre-line text-text-2">
													{note.content}
												</p>
											) : null}
										</div>
									</li>
								</Reveal>
							))}
						</ul>
					)}
				</div>
			</section>
		</>
	)
}
