import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X, Check } from 'lucide-react'

const CONSENT_KEY = 'advaita-site.cookie-consent'

/**
 * Non-intrusive Cookie & Privacy Consent Banner.
 * Remembers consent status in localStorage.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const consent = window.localStorage.getItem(CONSENT_KEY)
        if (!consent) {
          // Delay display slightly so it doesn't pop up instantly on page load
          const timer = setTimeout(() => setVisible(true), 1200)
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
        window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: value, time: new Date().toISOString() }))
      }
    } catch {
      // Ignore
    }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Cookie consent banner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-surface/90 p-4 sm:p-5 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full border border-line bg-raised p-2 text-accent shrink-0">
                <Cookie className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold tracking-tight text-ink">Cookie & Privacy Notice</h4>
                <p className="text-xs text-muted leading-relaxed">
                  We use essential local storage to remember your theme preferences and preview settings. No tracking or third-party advertising cookies are used.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChoice('essential')}
              aria-label="Close cookie notice"
              className="rounded-lg p-1 text-muted transition-colors hover:bg-raised hover:text-ink shrink-0"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-line/40">
            <button
              type="button"
              onClick={() => handleChoice('essential')}
              className="rounded-full border border-line/80 px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-line hover:bg-raised hover:text-ink"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => handleChoice('accepted')}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-on-accent transition-transform hover:bg-accent-strong active:scale-95 shadow-sm"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
