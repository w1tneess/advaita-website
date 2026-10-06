// src/lib/animations.js
// Shared motion presets. Only presets that are actually consumed live here;
// reduced-motion is handled by the consuming components.

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]

// Lightbox overlay fade
export const lightboxOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE_OUT_EXPO } },
}
