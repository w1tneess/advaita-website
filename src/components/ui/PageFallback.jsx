import { motion } from 'framer-motion'
import { SkeletonGrid } from './Skeleton.jsx'

export default function PageFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-dvh flex-col bg-canvas"
    >
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-24 sm:py-32">
        <div className="max-w-2xl space-y-6">
          <div className="h-12 w-3/4 animate-pulse rounded-xl bg-raised/70" />
          <div className="h-5 w-full animate-pulse rounded-lg bg-raised/50" />
          <div className="h-5 w-5/6 animate-pulse rounded-lg bg-raised/50" />
        </div>
        <div className="mt-20">
          <SkeletonGrid count={6} />
        </div>
      </div>
    </motion.div>
  )
}
