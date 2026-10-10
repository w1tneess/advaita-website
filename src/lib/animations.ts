// src/lib/animations.ts
// Shared motion presets with TypeScript type inference.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

// Lightbox overlay fade
export const lightboxOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT_EXPO } },
} as const
