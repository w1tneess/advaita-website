import PenStroke from '@/components/features/ink/PenStroke.jsx'

/**
 * Header for inner pages, on the notebook grid: the margin names the section,
 * the body carries a large title and the lead.
 */
export default function PageHeader({ eyebrow, title, lead, registry, children }) {
	return (
		<header className="shell pt-32 pb-12 lg:pt-40 lg:pb-16">
			<div className="folio gap-y-6">
				<div className="folio-margin text-[15px] text-muted lg:pt-3">
					{eyebrow && <p>{eyebrow}</p>}
					{eyebrow && <PenStroke seed={1} auto className="mt-1" />}
					{registry && <p className="mt-1 tabular-nums text-text-3">{registry}</p>}
				</div>

				<div className="folio-body">
					<h1 className="settle text-[length:var(--text-6xl)] leading-[1] tracking-[-0.045em] -ml-[0.04em] max-w-[18ch]">
						{title}
					</h1>

					{lead && (
						<p className="settle mt-6 max-w-2xl text-[length:var(--text-lg)] leading-relaxed text-muted" style={{ '--settle-delay': '120ms' }}>
							{lead}
						</p>
					)}

					{children && <div className="mt-10">{children}</div>}
				</div>
			</div>
		</header>
	)
}
