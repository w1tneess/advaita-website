// src/lib/animations.js
// Editorial-grade animation presets for advaitachandra.in
// All animations respect prefers-reduced-motion via the useReducedMotion hook in components.

// ─── Shared easing curves ──────────────────────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1]
const EASE_OUT_QUART = [0.25, 1, 0.5, 1]

// ─── 1. Page Load ──────────────────────────────────────────────────────────────
export const pageLoadVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT_EXPO,
    },
  },
}

// ─── 2. Hero entrance — staggered typography reveal ────────────────────────────
export const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

export const heroLine = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.7,
      ease: EASE_OUT_EXPO,
    },
  },
}

// ─── 3. Staggered containers & items ───────────────────────────────────────────
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_OUT_QUART,
    },
  },
}

// ─── 4. Scroll-driven section reveal ───────────────────────────────────────────
export const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_OUT_EXPO,
    },
  },
}

// Default viewport config for scroll-triggered animations
export const scrollViewport = {
  once: true,
  margin: '-80px',
  amount: 0.15,
}

// ─── 5. Card hover ─────────────────────────────────────────────────────────────
export const cardHover = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  hover: {
    y: -3,
    scale: 1.005,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

// ─── 6. Image reveal (clip-path wipe) ──────────────────────────────────────────
export const imageReveal = {
  hidden: {
    opacity: 0,
    scale: 1.05,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: EASE_OUT_QUART,
    },
  },
}

// ─── 7. Button press ───────────────────────────────────────────────────────────
export const buttonPress = {
  tap: { scale: 0.97 },
}

// ─── 8. Expand/collapse content ────────────────────────────────────────────────
export const expandCollapse = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: EASE_OUT_QUART },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.35, ease: EASE_OUT_QUART },
  },
}

// ─── 9. Lightbox overlay ───────────────────────────────────────────────────────
export const lightboxOverlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const lightboxContent = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: EASE_OUT_EXPO },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

// ─── 10. Mobile menu slide ─────────────────────────────────────────────────────
export const mobileMenuVariants = {
  closed: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT_QUART,
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

export const mobileMenuItemVariants = {
  closed: { opacity: 0, x: -10 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}
