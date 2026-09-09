import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X, Check } from 'lucide-react'
import { Link } from 'react-router'

const CONSENT_KEY = 'advaita-site.cookie-consent'

/**
 * Non-intrusive Cookie & Privacy Notice Banner.
 * Darkroom journal / cinematic editorial styling.
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
          aria-label="Privacy and storage consent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg border border-line bg-surface/95 p-5 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-6 relative overflow-hidden"
        >
          {/* Optical darkroom corner bracket */}
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-copper/40 pointer-events-none" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 border border-line bg-canvas p-1.5 text-copper shrink-0">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-copper uppercase tracking-widest font-semibold">
                    SYS.NOTICE // PRIVACY
                  </span>
                </div>
                <h3 className="font-display text-base font-normal text-text">
                  Essential Storage Only
                </h3>
                <p className="text-xs text-text-2 leading-relaxed">
                  This archive relies on essential local storage for rate limiting and theme preferences. No tracking pixels, cross-site telemetry, or advertising cookies are employed.{' '}
                  <Link
                    to="/privacy"
                    className="text-copper underline underline-offset-4 hover:text-copper-strong"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleChoice('dismissed')}
              aria-label="Close privacy notice"
              className="p-1 text-text-3 transition-colors hover:text-text shrink-0 cursor-pointer"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-line">
            <button
              type="button"
              onClick={() => handleChoice('essential')}
              className="border border-line bg-surface px-3 py-1.5 font-mono text-[11px] text-text-3 hover:text-text hover:border-line-strong transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => handleChoice('acknowledged')}
              className="inline-flex items-center gap-1.5 border border-copper bg-copper px-3.5 py-1.5 font-mono text-[11px] font-semibold text-black hover:bg-copper-strong transition-all cursor-pointer"
            >
              <Check className="h-3 w-3" aria-hidden="true" />
              <span>Acknowledge</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
