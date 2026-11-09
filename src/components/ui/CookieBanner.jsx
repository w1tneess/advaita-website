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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-4 z-50 mx-auto max-w-md rounded-[8px] border border-line bg-raised p-4 sm:left-auto sm:right-6 sm:w-[24rem]"
        >
          <p className="text-[14px] leading-relaxed text-ink">
            No cookies and no tracking. Your browser keeps two small settings: the contact form timer
            and your theme.{' '}
            <Link to="/privacy" className="text-muted underline underline-offset-4 hover:text-ink">
              Privacy
            </Link>
          </p>
          <div className="mt-3 flex justify-end">
            <button type="button" onClick={() => handleChoice('acknowledged')} className="btn-ink !px-4 !py-2 text-[14px]">
              OK
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
