import { Link } from 'react-router-dom'

/**
 * The site's only button component.
 *
 * Renders a react-router <Link> when given `to`, a plain <a> when given `href`, and a
 * <button> otherwise — so a link is always a real link and stays keyboard- and
 * middle-click-friendly.
 *
 * Variants:
 * - primary: Accent color, for primary actions
 * - secondary: Surface variant, for secondary actions
 * - ghost: Transparent with border, for tertiary actions
 * - danger: Red for destructive actions
 * - link: Unstyled link with underline
 *
 * Sizes: sm, md, lg
 */

const VARIANTS = {
  primary:
    'bg-accent text-on-accent border border-transparent hover:bg-accent-hover shadow-subtle hover:shadow-raised hover:-translate-y-px active:translate-y-0',
  secondary:
    'bg-surface-elevated text-foreground border border-border hover:bg-accent-soft hover:border-accent shadow-subtle hover:shadow-raised hover:-translate-y-px active:translate-y-0',
  ghost:
    'bg-transparent text-foreground border border-border hover:bg-surface-elevated hover:border-accent hover:text-accent shadow-none hover:shadow-subtle hover:-translate-y-px active:translate-y-0',
  danger:
    'bg-transparent text-danger border border-danger/40 hover:bg-danger/8 hover:border-danger shadow-none hover:-translate-y-px active:translate-y-0',
  link: 'bg-transparent text-accent border-0 p-0 underline underline-offset-4 hover:text-accent-hover',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-md',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-md',
  lg: 'px-5 py-3 text-base gap-2 rounded-lg',
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
    'inline-flex max-w-full items-center justify-center font-semibold break-words text-center transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out',
    'disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    variant === 'link' ? 'motion-reduce:hover:text-accent' : 'motion-reduce:hover:-translate-y-0',
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
