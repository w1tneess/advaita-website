import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from '../lib/theme.jsx'
import { scrollToTop } from '../lib/smooth-scroll.js'

/**
 * Hook to handle site-wide keyboard shortcuts modal and navigation chords.
 *
 * Supported shortcuts:
 * - '?' or 'Shift+/' or 'Cmd/Ctrl+K': Toggle shortcuts helper modal
 * - 'T': Toggle light/dark theme
 * - 'Esc': Close shortcuts helper modal
 * - 'Shift + ↑': Smooth scroll to top
 * - 'G' then 'H': Go to Home ('/')
 * - 'G' then 'A': Go to About ('/about')
 * - 'G' then 'P': Go to Projects ('/projects')
 * - 'G' then 'B': Go to Blog ('/blog')
 */
export function useShortcuts() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const chordPendingRef = useRef(false)
  const chordTimerRef = useRef(null)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing inside an input/textarea/select
      const tag = e.target.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) {
        return
      }

      // Check for ? key (Shift + /)
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        toggle()
        return
      }

      // Check for Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggle()
        return
      }

      // Escape closes
      if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault()
          close()
        }
        chordPendingRef.current = false
        clearTimeout(chordTimerRef.current)
        return
      }

      // Shift + ArrowUp: Scroll to top
      if (e.shiftKey && e.key === 'ArrowUp') {
        e.preventDefault()
        scrollToTop()
        const main = document.getElementById('main-content')
        if (main) main.focus({ preventScroll: true })
        return
      }

      const key = e.key.toLowerCase()

      // 'T' toggles theme
      if (!e.ctrlKey && !e.metaKey && !e.altKey && key === 't' && !chordPendingRef.current) {
        e.preventDefault()
        toggleTheme()
        return
      }

      if (chordPendingRef.current) {
        chordPendingRef.current = false
        clearTimeout(chordTimerRef.current)

        if (key === 'h') {
          e.preventDefault()
          navigate('/')
          return
        }
        if (key === 'a') {
          e.preventDefault()
          navigate('/about')
          return
        }
        if (key === 'p') {
          e.preventDefault()
          navigate('/projects')
          return
        }
        if (key === 'b') {
          e.preventDefault()
          navigate('/blog')
          return
        }
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && key === 'g') {
        chordPendingRef.current = true
        clearTimeout(chordTimerRef.current)
        chordTimerRef.current = setTimeout(() => {
          chordPendingRef.current = false
        }, 1200)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(chordTimerRef.current)
    }
  }, [toggle, close, isOpen, navigate])

  return { isOpen, open, close, toggle }
}
