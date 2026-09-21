import { ArrowUpRight, Github, Globe } from 'lucide-react'

export default function ProjectCard({ project, index }) {
	const { title, categories, status, summary, description, methodology, links } = project
	const kind = categories && categories.length > 0 ? categories[0] : (status || "Research & Tool")
	// Sanitize links to allow only safe protocols (http, https, or relative paths)
	const isSafeUrl = (url) => {
		if (!url || typeof url !== 'string') return false
		const trimmed = url.trim().toLowerCase()
		return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/')
	}

	const rawLink = links?.live || links?.repository
	const link = isSafeUrl(rawLink) ? rawLink : null
	const repoLink = isSafeUrl(links?.repository) ? links.repository : null
	const liveLink = isSafeUrl(links?.live) ? links.live : null

	const indexStr = index !== undefined ? String(index + 1).padStart(2, '0') : null

	return (
		<article className="group flex h-full flex-col justify-between p-5 sm:p-6 rounded-sm border border-line bg-surface/30 hover:bg-surface/70 hover:border-line-strong transition-all duration-300 shadow-subtle hover:shadow-card-hover">
			<div>
				{/* Top Card Catalog Bar */}
				<div className="flex items-center justify-between border-b border-line pb-3 mb-4 font-mono text-[11px] tracking-widest uppercase text-muted">
					<div className="flex items-center gap-2">
						<span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
						<span className="text-ink font-medium">{kind}</span>
					</div>
					{indexStr && (
						<span className="text-muted/70">
							#{indexStr}
						</span>
					)}
				</div>

				{/* Title */}
				<h3 className="text-lg sm:text-xl font-normal text-ink group-hover:text-accent transition-colors duration-200 leading-snug text-balance">
					{link ? (
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-baseline gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-sm"
						>
							<span>{title}</span>
							<ArrowUpRight className="inline-block h-4 w-4 opacity-50 transition-all duration-200 group-hover:opacity-100 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</a>
					) : (
						title
					)}
				</h3>

				{/* Summary & Description */}
				<div className="mt-4">
					{summary || description ? (
						<p className="text-[length:var(--text-base)] text-muted font-sans leading-relaxed">
							{summary || description}
						</p>
					) : (
						<p className="text-base text-muted font-display italic">Methodology and documentation pending transcription.</p>
					)}

					{/* Methodology Snippets */}
					{methodology && methodology.length > 0 && (
						<ul className="mt-5 space-y-2.5 border-t border-line pt-4 text-[length:var(--text-label)] font-sans text-muted leading-relaxed">
							{methodology.slice(0, 2).map((m, i) => (
								<li key={m.title || i} className="flex items-start gap-2.5">
									<span className="text-accent">—</span>
									<span>
										<strong className="text-ink font-medium">{m.title}:</strong> {m.detail}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			{/* Card Footer Actions */}
			{(repoLink || liveLink) && (
				<div className="mt-6 pt-4 border-t border-line flex items-center justify-between font-mono text-[11px] tracking-wide uppercase">
					<div className="flex items-center gap-4 text-muted">
						{repoLink && (
							<a
								href={repoLink}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-sm"
							>
								<Github className="h-3.5 w-3.5" />
								<span>Source</span>
							</a>
						)}
						{liveLink && (
							<a
								href={liveLink}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-sm"
							>
								<Globe className="h-3.5 w-3.5" />
								<span>Live</span>
							</a>
						)}
					</div>
				</div>
			)}
		</article>
	)
}
