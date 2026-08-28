/**
 * Horizontal page gutter and max width. Every page section sits inside one of these
 * so the measure stays consistent across the site.
 */
export default function Container({ as: Tag = 'div', width = 'default', className = '', children }) {
  const widths = {
    default: 'max-w-5xl',
    wide: 'max-w-6xl',
    prose: 'max-w-prose',
  }

  return (
    <Tag className={`mx-auto w-full ${widths[width]} px-5 sm:px-6 md:px-12 lg:px-24 ${className}`}>{children}</Tag>
  )
}
