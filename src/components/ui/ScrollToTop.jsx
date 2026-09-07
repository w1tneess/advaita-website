import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

/**
 * Route-change behaviour that a multi-page site gets from the browser for free but a
 * single-page app has to do itself:
 *
 *   1. scroll back to the top
 *   2. move focus to <main>, so a screen reader announces the new page instead of
 *      leaving the user stranded where the old page's link was
 *
 * Skipped on first render, so it never steals focus on initial load. When the URL has a
 * hash, the target element is scrolled into view instead — a browser does this natively
 * for a real page load, but not for a client-side navigation.
 */
import { scrollToTop } from '../../lib/smooth-scroll.js'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
      const timer = setTimeout(() => {
        const delayedTarget = document.getElementById(id)
        if (delayedTarget) {
          delayedTarget.scrollIntoView({ block: 'start' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }

    scrollToTop()

    const focusTimer = setTimeout(() => {
      const main = document.getElementById('main-content')
      if (main) main.focus({ preventScroll: true })
    }, 60)

    return () => clearTimeout(focusTimer)
  }, [pathname, hash])

  return null
}
