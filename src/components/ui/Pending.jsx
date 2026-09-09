/**
 * Marks content that only the owner can write. Nothing here is ever filled in
 * with generated prose — an empty slot stays visibly empty until it is written
 * in the admin panel.
 */
export default function Pending({ children = "Not written yet", className = "" }) {
	return (
		<span className={`pending ${className}`}>
			<span
				aria-hidden="true"
				className="inline-block h-1 w-1 rounded-full bg-copper/70"
			/>
			{children}
		</span>
	)
}
