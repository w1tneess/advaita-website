import { Link } from 'react-router-dom'

/**
 * The site's only button component.
 *
 * Renders a react-router <Link> when given `to`, a plain <a> when given `href`, and a
 * <button> otherwise — so a link is always a real link and stays keyboard- and
 * middle-click-friendly.
 */

const VARIANTS = {
  primary:
    'bg-accent text-on-accent border border-transparent hover:bg-accent-strong shadow-subtle',
  secondary: 'bg-surface text-ink border border-line hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-raised',
  danger: 'bg-transparent text-limitation border border-limitation/40 hover:bg-limitation/10',
  link: 'bg-transparent text-accent border-0 p-0 underline underline-offset-4 hover:text-accent-strong',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
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
  const sizeClasses = variant === 'link' ? '' : SIZES[size]
  const classes = [
    'inline-flex max-w-full items-center justify-center rounded-lg font-medium break-words text-center transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses,
    VARIANTS[variant],
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
