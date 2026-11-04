// src/lib/animations.ts
// Shared motion presets with TypeScript type inference.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// Springs: critically damped by default; bounce only when a gesture carried momentum.
export const SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const
export const SPRING_MOMENTUM = { type: 'spring', bounce: 0.2, duration: 0.4 } as const

// Where a release velocity (px/s) will come to rest, using iOS scroll deceleration.
export const project = (velocity: number, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate)

// Lightbox overlay fade
export const lightboxOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT_EXPO } },
} as const
