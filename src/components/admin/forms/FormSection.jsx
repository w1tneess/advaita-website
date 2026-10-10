import Card from '@/components/ui/Card.jsx'

/**
 * Standardized form section wrapper for admin editors.
 *
 * Provides consistent layout: heading, optional description, and content area.
 * Replaces inline Card + heading patterns across all editors.
 */

export default function FormSection({ title, description, children, className = '' }) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description && <p className="mt-1.5 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </Card>
  )
}
