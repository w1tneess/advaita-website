/**
 * Surface container with a subtle border and shadow.
 * `interactive` adds the hover lift and border effects for cards like projects and articles.
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
        'rounded-lg border border-border bg-surface shadow-subtle',
        interactive
          ? 'transition-[background-color,box-shadow,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/50 hover:bg-surface-elevated hover:shadow-raised motion-reduce:hover:translate-y-0'
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
