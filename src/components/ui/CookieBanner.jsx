import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'

const CONSENT_KEY = 'advaita-site.cookie-consent'

/**
 * Quiet privacy note shown once. The site sets no cookies; this only says so.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const consent = window.localStorage.getItem(CONSENT_KEY)
        if (!consent) {
          // Delay display slightly so it doesn't disrupt initial reading
          const timer = setTimeout(() => setVisible(true), 1500)
          return () => clearTimeout(timer)
        }
      }
    } catch {
      // Storage unavailable
    }
  }, [])

  const handleChoice = (value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          CONSENT_KEY,
          JSON.stringify({ status: value, time: new Date().toISOString() }),
        )
      }
    } catch {
      // Ignore
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="region"
          aria-label="Privacy notice"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas pb-[env(safe-area-inset-bottom)]"
        >
          <div className="shell flex items-center justify-between gap-4 py-2.5 text-[13px] text-muted">
            <p>
              No cookies, no tracking.{' '}
              <Link to="/privacy" className="inline-block py-1 underline underline-offset-4 hover:text-ink">Privacy</Link>
            </p>
            <button type="button" onClick={() => handleChoice('acknowledged')} className="pen-link py-1 text-ink">
              Got it
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
