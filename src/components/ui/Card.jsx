/**
 * Surface container with a subtle border and shadow.
 * `interactive` adds the hover lift used by project and article cards.
 */
export default function Card({
  as: Tag = 'div',
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag
      className={[
        'rounded-card border border-zinc-200 dark:border-zinc-800 bg-surface shadow-sm sm:shadow-subtle',
        interactive
          ? 'transition-[background-color,box-shadow,border-color,transform] duration-200 active:scale-[0.98] active:bg-surface-hover active:border-accent/40 sm:hover:-translate-y-0.5 sm:hover:border-accent/40 sm:hover:bg-surface-hover sm:hover:shadow-raised motion-reduce:sm:hover:translate-y-0'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Tag>
  )
}
