/**
 * Profile image, with an honest placeholder.
 *
 * When no photograph is configured this renders initials and is marked as a
 * placeholder — it does not fabricate a likeness or use a stock portrait.
 */
export default function Avatar({ profile, size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-12 w-12 text-base',
    md: 'h-20 w-20 text-2xl',
    lg: 'h-28 w-28 text-3xl',
  }

  const initials = (profile?.name || 'A')
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  if (profile?.photo) {
    return (
      <img
        src={profile.photo}
        alt={profile.photoAlt || `Photograph of ${profile.name}.`}
        width={112}
        height={112}
        loading="lazy"
        decoding="async"
        className={`${sizes[size]} rounded-full border border-line object-cover ${className}`}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={`Placeholder avatar showing the initials ${initials.split('').join(' ')}. No photograph has been added yet.`}
      className={`${sizes[size]} inline-flex shrink-0 items-center justify-center rounded-full border border-dashed border-line bg-raised font-display font-semibold text-muted ${className}`}
    >
      {initials}
    </span>
  )
}
