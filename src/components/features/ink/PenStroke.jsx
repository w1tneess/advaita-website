// A few hand-drawn underline shapes, picked by a stable seed so each heading keeps its own stroke.
const PATHS = [
  'M2 9 C 38 4, 82 11, 124 6 S 186 9, 198 5',
  'M2 7 C 44 10, 90 3, 132 8 S 182 4, 198 8',
  'M3 8 C 30 5, 70 10, 110 7 C 140 5, 170 9, 197 6',
]

/**
 * Pen underline that draws itself when its section scrolls into view (or at once with `auto`).
 * Purely decorative: aria-hidden, and fully drawn under reduced motion.
 */
export default function PenStroke({ seed = 0, auto = false, width, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      style={width ? { width } : undefined}
      className={`pen-stroke ${auto ? 'is-auto' : ''} block h-[0.5em] w-[min(100%,9em)] text-ink/60 ${className}`}
    >
      <path d={PATHS[seed % PATHS.length]} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
