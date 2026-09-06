import { motion } from 'framer-motion'
import { SkeletonGrid } from './Skeleton.jsx'

export default function PageFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mx-auto max-w-6xl px-6 py-16 text-ink"
    >
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-md bg-raised/70 animate-shimmer" />
        <SkeletonGrid count={3} />
      </div>
    </motion.div>
  )
}
