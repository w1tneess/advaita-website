import { Inbox } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * Honest empty state. Used wherever a collection is genuinely empty — most visibly on
 * the blog, photography, or filtered searches.
 */
export default function EmptyState({ icon: Icon = Inbox, title, message, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-card border border-dashed border-line/80 bg-surface/60 px-6 py-16 text-center backdrop-blur-sm ${className}`}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-raised/50 text-muted shadow-inner">
        <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
      </div>
      {title && <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h3>}
      {message && <p className="mx-auto mt-2 max-w-md text-sm text-muted leading-relaxed">{message}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </motion.div>
  )
}
