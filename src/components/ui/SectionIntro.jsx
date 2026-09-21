

/**
 * Section heading. One optional eyebrow word, a confident serif heading, and
 * an optional lead line. No running section numbers.
 */
export default function SectionIntro({
	eyebrow,
	title,
	lead,
	className = "",
	id,
}) {
	return (
		<div className={`max-w-[46rem] ${className}`}>
			{eyebrow ? <p className="text-sm font-medium text-muted">{eyebrow}</p> : null}
			<h2
				id={id}
				className={`text-2xl sm:text-3xl font-semibold text-ink ${eyebrow ? "mt-3" : ""}`}
			>
				{title}
			</h2>
			{lead ? (
				<p className="mt-4 max-w-[40rem] text-lg leading-relaxed text-muted">
					{lead}
				</p>
			) : null}
		</div>
	)
}
