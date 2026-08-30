import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

/**
 * Thinker card for the Philosophy page.
 *
 * Designed to feel like a small intellectual note — name and a truncated description
 * that expands on click. No Wikipedia biography, no external links, no pretence of expertise.
 */

const TRUNCATE_LENGTH = 120

export default function ThinkerCard({ thinker }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = thinker.description && thinker.description.length > TRUNCATE_LENGTH

  const displayText =
    !isLong || expanded
      ? thinker.description
      : thinker.description.slice(0, TRUNCATE_LENGTH).trim() + '…'

  return (
    <motion.div
      className="card-interactive cursor-pointer rounded-xl border border-line bg-surface p-6 shadow-subtle h-full"
      onClick={() => isLong && setExpanded((prev) => !prev)}
      onKeyDown={(e) => {
        if (isLong && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          setExpanded((prev) => !prev)
        }
      }}
      tabIndex={isLong ? 0 : undefined}
      role={isLong ? 'button' : undefined}
      aria-expanded={isLong ? expanded : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight">{thinker.name}</h3>
        {isLong && (
          <motion.span
            className="mt-1 shrink-0 text-muted"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={expanded ? 'full' : 'truncated'}
          className="mt-2 text-sm leading-relaxed text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {displayText}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}
