/**
 * Smooth scrolling with Lenis.
 *
 * Provides a buttery-smooth native-feel scroll experience. Automatically disabled
 * when the user has prefers-reduced-motion enabled.
 */

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

let lenisInstance = null

/**
 * Initialize Lenis smooth scrolling. Call once in the app shell (PublicLayout).
 * Automatically tears down on unmount and respects prefers-reduced-motion.
 */
export function useSmoothScroll() {
  const rafId = useRef(null)

  useEffect(() => {
    // Respect the user's motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) return

    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenisInstance?.raf(time)
      rafId.current = requestAnimationFrame(raf)
    }

    rafId.current = requestAnimationFrame(raf)

    // Listen for motion preference changes at runtime
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = (e) => {
      if (e.matches) {
        lenisInstance?.destroy()
        lenisInstance = null
        if (rafId.current) cancelAnimationFrame(rafId.current)
      }
    }
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      if (rafId.current) cancelAnimationFrame(rafId.current)
      lenisInstance?.destroy()
      lenisInstance = null
    }
  }, [])
}

/**
 * Scroll to the top of the page, using Lenis if available, native otherwise.
 * @param {object} [options]
 * @param {boolean} [options.immediate=false]
 */
export function scrollToTop(options = {}) {
  const { immediate = false } = options
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate })
  } else {
    window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
  }
}

/**
 * Scroll smoothly or immediately to a target element or selector.
 * @param {string|HTMLElement} target
 * @param {object} [options]
 * @param {boolean} [options.immediate=false]
 * @param {number} [options.offset=0]
 */
export function scrollToElement(target, options = {}) {
  const { immediate = false, offset = 0 } = options
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { immediate, offset })
  } else if (typeof target === 'string') {
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' })
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' })
  }
}

/**
 * Pause Lenis scrolling (e.g. when mobile nav or lightbox modal is open).
 */
export function stopScroll() {
  lenisInstance?.stop()
}

/**
 * Resume Lenis scrolling.
 */
export function startScroll() {
  lenisInstance?.start()
}

