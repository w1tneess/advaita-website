import { Link } from 'react-router'

/**
 * Unified Button component adhering to site design tokens.
 *
 * Renders:
 * - <Link> when `to` is provided
 * - <a> when `href` is provided (auto-detects external links)
 * - <button> otherwise
 */

const VARIANTS = {
  primary:
    'bg-accent text-on-accent border border-transparent hover:bg-accent-strong shadow-subtle hover:shadow-[0_0_22px_-4px_var(--color-accent)]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  secondary:
    'bg-raised text-ink border border-line hover:border-accent/60 hover:bg-surface shadow-subtle hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
  ghost:
    'bg-transparent text-ink border border-transparent hover:bg-raised hover:text-accent active:scale-[0.98]',
  danger:
    'bg-transparent text-limitation border border-limitation/40 hover:bg-limitation/10 hover:border-limitation active:scale-[0.98]',
  link: 'bg-transparent text-accent border-0 p-0 underline underline-offset-4 hover:text-accent-strong',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-lg',
  lg: 'px-5 py-3 text-base gap-2 rounded-xl',
}

export default function Button({
  to,
  href,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const sizeClasses = variant === 'link' ? '' : SIZES[size] || SIZES.md
  const variantClasses = VARIANTS[variant] || VARIANTS.primary

  const classes = [
    'inline-flex max-w-full items-center justify-center font-semibold break-words text-center transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    variant === 'link' ? 'motion-reduce:hover:text-accent' : 'motion-reduce:hover:-translate-y-0',
    sizeClasses,
    variantClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href && !disabled) {
    const isExternal = /^https?:\/\//i.test(href)
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
