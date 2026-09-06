import { motion, AnimatePresence } from 'framer-motion'
import { Command, X } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useTheme } from '@/lib/theme.jsx'
import { scrollToTop } from '@/lib/smooth-scroll.js'

/**
 * Keyboard Shortcuts Modal Dialog.
 * Triggered by pressing '?' or 'Cmd/Ctrl + K' or clicking the shortcut hint in header/footer.
 */
export default function ShortcutsModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()

  const shortcutsList = [
    {
      category: 'Navigation',
      items: [
        { keys: ['G', 'H'], label: 'Go to Home', action: () => navigate('/') },
        { keys: ['G', 'A'], label: 'Go to About', action: () => navigate('/about') },
        { keys: ['G', 'P'], label: 'Go to Projects', action: () => navigate('/projects') },
        { keys: ['G', 'B'], label: 'Go to Blog', action: () => navigate('/blog') },
      ],
    },
    {
      category: 'Actions & Controls',
      items: [
        {
          keys: ['T'],
          label: 'Toggle Light / Dark Theme',
          action: () => toggleTheme(),
        },
        {
          keys: ['Shift', '↑'],
          label: 'Scroll to Top',
          action: () => scrollToTop(),
        },
        { keys: ['?'], label: 'Toggle Shortcuts Menu', action: () => {} },
        { keys: ['Esc'], label: 'Close Dialogs / Menus', action: () => onClose() },
      ],
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-canvas/80 backdrop-blur-md"
          />

          {/* Dialog Content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard Shortcuts"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line/40 pb-4">
              <div className="flex items-center gap-2.5 text-ink">
                <Command className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold tracking-tight">Keyboard Shortcuts</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-muted transition-colors hover:bg-raised hover:text-ink"
                aria-label="Close shortcuts modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="space-y-5 text-sm">
              {shortcutsList.map((group) => (
                <div key={group.category} className="space-y-2.5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                    {group.category}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {group.items.map((item) => (
                      <div
                        key={item.label}
                        onClick={() => {
                          item.action()
                          onClose()
                        }}
                        className="flex items-center justify-between rounded-xl border border-line/40 bg-raised/40 p-2.5 transition-colors hover:bg-raised hover:border-line cursor-pointer"
                      >
                        <span className="text-ink font-medium text-xs sm:text-sm">{item.label}</span>
                        <div className="flex items-center gap-1">
                          {item.keys.map((k) => (
                            <kbd
                              key={k}
                              className="inline-flex min-w-[24px] items-center justify-center rounded-md border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] font-semibold text-ink shadow-xs"
                            >
                              {k}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer note */}
            <div className="border-t border-line/40 pt-4 text-center">
              <p className="text-xs text-muted">
                Press <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink">?</kbd> anytime to open this helper overlay.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
