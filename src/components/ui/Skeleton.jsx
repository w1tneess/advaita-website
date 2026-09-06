/**
 * Reusable Skeleton Loader component with smooth shimmer animations.
 * Provides accessible, loading placeholders matching the site design tokens.
 */
export function Skeleton({ className = '', variant = 'rectangular', width, height, ...props }) {
  const baseClasses = 'relative overflow-hidden rounded-md bg-raised/70 animate-shimmer'
  
  const variantClasses = {
    circular: 'rounded-full',
    rectangular: 'rounded-md',
    card: 'rounded-card border border-line/40',
    text: 'h-4 rounded',
  }

  const style = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  }

  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
      style={style}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-4/5' : 'w-full'}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-card border border-line bg-surface/60 p-6 space-y-4 ${className}`}>
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-6 w-3/4 rounded" />
      <SkeletonText lines={2} />
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 3, className = '' }) {
  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default Skeleton
