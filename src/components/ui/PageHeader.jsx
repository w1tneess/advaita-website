import Reveal from "./Reveal.jsx"

/** 
 * Standardized high-editorial page header for inner routes.
 * Follows the Home and Philosophy design system with copper rules,
 * Playfair Display serif title, and generous editorial lead text.
 */
export default function PageHeader({ eyebrow, title, lead, registry, children }) {
	return (
		<header className="shell pt-10 pb-8 md:pt-16 md:pb-12 border-b border-line mb-10 md:mb-14">
			<Reveal y={12}>
				<div className="flex flex-wrap items-center justify-between gap-3 pb-2">
					<div className="flex items-center gap-3">
						<span aria-hidden="true" className="h-px w-8 bg-copper" />
						<p className="eyebrow text-copper font-mono text-[11px] tracking-widest uppercase">
							{eyebrow}
						</p>
					</div>
					{registry && (
						<span className="font-mono text-[10px] text-text-3 tracking-widest uppercase">
							{registry}
						</span>
					)}
				</div>

				<h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text font-normal tracking-tight leading-[1.05]">
					{title}
				</h1>

				{lead && (
					<p className="mt-4 max-w-[44rem] text-lead leading-relaxed text-text-2 font-light">
						{lead}
					</p>
				)}

				{children && (
					<div className="mt-8 pt-6 border-t border-line/40">
						{children}
					</div>
				)}
			</Reveal>
		</header>
	)
}
