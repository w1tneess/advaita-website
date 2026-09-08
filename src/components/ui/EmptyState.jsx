import { Inbox } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Honest empty state. Used wherever a collection is genuinely empty — most visibly on
 * the blog, photography, or filtered searches.
 */
export default function EmptyState({ icon: Icon = Inbox, title, message, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-card border border-line/60 bg-surface/40 px-6 py-12 text-center sm:py-16 ${className}`}
    >
      {Icon && (
        <div className="mx-auto mb-3 flex items-center justify-center text-muted/60">
          <Icon className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
        </div>
      )}
      {title && (
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
          {title}
        </h3>
      )}
      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm text-muted/90 leading-relaxed">
          {message}
        </p>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </motion.div>
  )
}

