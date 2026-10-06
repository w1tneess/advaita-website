/** 
 * Standardized high-editorial page header for inner routes.
 * Follows the broadsheet design system with delicate rules,
 * Playfair Display serif title, and generous editorial lead text.
 */
export default function PageHeader({ eyebrow, title, lead, registry, children }) {
	return (
		<header className="shell pt-[clamp(6.5rem,10vw,8.5rem)] pb-[clamp(1.5rem,3vw,2.5rem)] mb-[clamp(1.5rem,3.5vw,2.75rem)] border-b border-line">
			<div className="flex flex-wrap items-center justify-between gap-2 pb-2 sm:pb-3">
				<p className="font-utility text-[length:var(--text-label)] text-muted">
					{eyebrow}
				</p>
				{registry && (
					<span className="font-utility text-[length:var(--text-label)] text-muted">
						{registry}
					</span>
				)}
			</div>

			<h1 className="mt-1 text-[clamp(1.75rem,1.25rem+2vw,2.85rem)] text-ink font-normal tracking-tight leading-[1.15]">
				{title}
			</h1>

			{lead && (
				<p className="mt-2.5 sm:mt-3 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
					{lead}
				</p>
			)}

			{children && (
				<div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-line">
					{children}
				</div>
			)}
		</header>
	)
}
