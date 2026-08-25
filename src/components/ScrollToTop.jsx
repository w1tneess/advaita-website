import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

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
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView({ block: 'start' })
        return
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    const main = document.getElementById('main-content')
    if (main) main.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}
