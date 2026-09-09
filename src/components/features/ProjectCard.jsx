import { ArrowUpRight, Github, Globe } from 'lucide-react'
import Pending from '@/components/ui/Pending.jsx'

export default function ProjectCard({ project, index }) {
	const { title, categories, status, summary, description, methodology, links } = project
	const kind = categories && categories.length > 0 ? categories[0] : (status || "Research & Tool")
	const link = links?.live || links?.repository

	const indexStr = index !== undefined ? String(index + 1).padStart(2, '0') : null

	return (
		<article className="group relative flex h-full flex-col justify-between border border-line bg-surface p-6 sm:p-8 transition-all duration-300 hover:border-copper/50">
			<div>
				{/* Top Card Catalog Bar */}
				<div className="flex items-center justify-between border-b border-line/50 pb-3 mb-5 font-mono text-[11px]">
					<div className="flex items-center gap-2">
						<span className="h-1.5 w-1.5 bg-copper" />
						<span className="text-copper uppercase tracking-wider font-medium">{kind}</span>
					</div>
					{indexStr && (
						<span className="text-text-3 tracking-widest font-mono">
							REF // {indexStr}
						</span>
					)}
				</div>

				{/* Title */}
				<h3 className="font-display text-xl sm:text-2xl text-text group-hover:text-copper transition-colors duration-300 leading-snug">
					{link ? (
						<a
							href={link}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-baseline gap-1.5 focus:outline-none"
						>
							<span>{title}</span>
							<ArrowUpRight className="inline-block h-4 w-4 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-copper" />
						</a>
					) : (
						title
					)}
				</h3>

				{/* Summary & Description */}
				<div className="mt-4">
					{summary || description ? (
						<p className="text-sm sm:text-[0.95rem] text-text-2 leading-relaxed font-light">
							{summary || description}
						</p>
					) : (
						<Pending>Methodology and documentation pending transcription.</Pending>
					)}

					{/* Methodology Snippets */}
					{methodology && methodology.length > 0 && (
						<ul className="mt-5 space-y-2 border-t border-line/40 pt-4 font-mono text-xs text-text-3">
							{methodology.slice(0, 2).map((m, i) => (
								<li key={i} className="flex items-start gap-2">
									<span className="text-copper">›</span>
									<span>
										<strong className="text-text-2 font-normal">{m.title}:</strong> {m.detail}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			{/* Card Footer Actions */}
			<div className="mt-8 pt-4 border-t border-line/50 flex items-center justify-between font-mono text-xs">
				<div className="flex items-center gap-4 text-text-3">
					{links?.repository && (
						<a
							href={links.repository}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 hover:text-copper transition-colors"
						>
							<Github className="h-3.5 w-3.5" />
							<span>SOURCE</span>
						</a>
					)}
					{links?.live && (
						<a
							href={links.live}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 hover:text-copper transition-colors"
						>
							<Globe className="h-3.5 w-3.5" />
							<span>LIVE</span>
						</a>
					)}
				</div>

				<span
					aria-hidden="true"
					className="h-px w-8 bg-copper/40 transition-[width] duration-300 group-hover:w-14 group-hover:bg-copper"
				/>
			</div>
		</article>
	)
}
