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
        'rounded-card border border-line/80 bg-surface/85 backdrop-blur-md shadow-subtle transition-[background-color,border-color,box-shadow,transform] duration-250',
        interactive
          ? 'card-interactive cursor-pointer hover:border-accent/40 active:scale-[0.99] motion-reduce:hover:translate-y-0'
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
