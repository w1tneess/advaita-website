/**
 * A hand-drawn loop, the way a reader circles a word. Sits around its parent (which must be
 * position: relative) and draws itself in when it mounts. Decorative only.
 */
export default function PenCircle({ className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 44"
      preserveAspectRatio="none"
      className={`pen-stroke is-auto pointer-events-none absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] max-w-none overflow-visible text-accent/80 ${className}`}
    >
      <path
        d="M70 4 C 30 2, 4 10, 4 22 C 4 36, 40 41, 64 40 C 96 39, 117 32, 116 20 C 115 8, 88 3, 58 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
