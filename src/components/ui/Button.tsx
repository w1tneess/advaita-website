import React, { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router'
import { preloadRoute } from '../../lib/preload'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  to?: string
  href?: string
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  className?: string
  target?: string
  rel?: string
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-on-accent border border-accent hover:bg-accent-strong hover:border-accent-strong shadow-subtle hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
  secondary:
    'bg-surface text-ink border border-line hover:border-ink/25 hover:bg-raised shadow-subtle hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
  ghost:
    'bg-transparent text-muted border border-transparent hover:bg-surface hover:text-ink active:scale-[0.97]',
  danger:
    'bg-transparent text-limitation border border-limitation/30 hover:bg-limitation/10 hover:border-limitation active:scale-[0.97]',
  link: 'bg-transparent text-accent border-0 p-0 underline underline-offset-4 hover:text-accent-strong',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-sm gap-1.5 rounded-full',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-full',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-full',
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
  target,
  rel,
  onPointerEnter,
  onFocus,
  onTouchStart,
  ...rest
}: ButtonProps) {
  const sizeClasses = variant === 'link' ? '' : SIZES[size] || SIZES.md
  const variantClasses = VARIANTS[variant] || VARIANTS.primary

  const classes = [
    'inline-flex max-w-full items-center justify-center font-semibold break-words text-center transition-[background-color,border-color,color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)]',
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
      <Link
        to={to}
        className={classes}
        target={target}
        rel={rel}
        onPointerEnter={(e) => {
          preloadRoute(to)
          onPointerEnter?.(e as unknown as React.PointerEvent<HTMLButtonElement>)
        }}
        onFocus={(e) => {
          preloadRoute(to)
          onFocus?.(e as unknown as React.FocusEvent<HTMLButtonElement>)
        }}
        onTouchStart={(e) => {
          preloadRoute(to)
          onTouchStart?.(e as unknown as React.TouchEvent<HTMLButtonElement>)
        }}
        {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    )
  }

  if (href && !disabled) {
    const trimmed = typeof href === 'string' ? href.trim() : ''
    const isSafe = /^(?:https?:\/\/|\/|#|mailto:|tel:)/i.test(trimmed)
    const safeHref = isSafe ? trimmed : '#'
    const isExternal = /^https?:\/\//i.test(safeHref)
    return (
      <a
        href={safeHref}
        className={classes}
        target={isExternal ? '_blank' : target}
        rel={isExternal ? 'noopener noreferrer' : rel}
        {...(rest as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
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
