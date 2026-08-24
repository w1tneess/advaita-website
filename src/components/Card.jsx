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
        'rounded-card border border-line bg-surface shadow-subtle',
        interactive
          ? 'transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-raised motion-reduce:hover:translate-y-0'
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
