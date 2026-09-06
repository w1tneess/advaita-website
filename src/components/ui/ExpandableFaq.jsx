import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Search } from 'lucide-react'
import { EASE_OUT_EXPO } from '@/lib/animations.js'

/**
 * Reusable Expandable FAQ Accordion Component.
 * Supports smooth expansion animations, search filtering, and clean accessibility.
 */
export default function ExpandableFaq({ items = [], title = 'Frequently Asked Questions', className = '' }) {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const query = (searchQuery || '').trim().toLowerCase()
  const filteredItems = items.filter((item) => {
    if (!query) return true
    const q = String(item.question || '').toLowerCase()
    const a = String(item.answer || '').toLowerCase()
    return q.includes(query) || a.includes(query)
  })

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/40 pb-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="h-5 w-5 text-accent" aria-hidden="true" />
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{title}</h3>
        </div>

        {items.length > 3 && (
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-xl border border-line bg-canvas/60 py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-muted/60 transition-all focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        )}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-6 text-center text-xs text-muted">
            No matching questions found.
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-line/60 bg-surface/60 transition-colors hover:border-line"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-raised/40 focus:outline-none focus:bg-raised/40"
                >
                  <span className="font-display text-base font-medium tracking-tight text-ink">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-accent' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                    >
                      <div className="border-t border-line/40 px-4 pb-4 pt-3 text-sm text-muted leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
