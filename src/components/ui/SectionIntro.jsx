import Reveal from "./Reveal"

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
		<Reveal className={`max-w-[46rem] ${className}`}>
			{eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
			<h2
				id={id}
				className={`text-h2 ${eyebrow ? "mt-3" : ""} text-text`}
			>
				{title}
			</h2>
			{lead ? (
				<p className="mt-4 max-w-[40rem] text-lead leading-relaxed text-text-2">
					{lead}
				</p>
			) : null}
		</Reveal>
	)
}
