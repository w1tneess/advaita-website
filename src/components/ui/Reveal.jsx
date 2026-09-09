import { motion, useReducedMotion } from "framer-motion"

const EASE = [0.22, 1, 0.36, 1]

/**
 * Scroll-triggered reveal. Returns a plain element when the visitor prefers
 * reduced motion, so nothing depends on an animation having run.
 */
export default function Reveal({
	children,
	className = "",
	delay = 0,
	y = 16,
	style,
}) {
	const reduce = useReducedMotion()

	if (reduce) {
		return (
			<div className={className} style={style}>
				{children}
			</div>
		)
	}

	return (
		<motion.div
			className={className}
			style={style}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "0px 0px -10% 0px" }}
			transition={{ duration: 0.65, delay, ease: EASE }}
		>
			{children}
		</motion.div>
	)
}
