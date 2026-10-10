/**
 * Double-bezel surface: an outer hairline tray holding an inner core with its own
 * highlight, using concentric radii. `interactive` adds a soft lift on hover.
 */
const OUTER_CLASS = /^(-?m[trblxy]?-|col-|row-|self-|justify-self-|order-|w-|max-w-|min-w-|[a-z]+:(-?m[trblxy]?|col|row|w)-)/

export default function Card({
  as: Tag = 'div',
  interactive = false,
  className = '',
  children,
  ...rest
}) {
  const tokens = className.split(/\s+/).filter(Boolean)
  const outer = tokens.filter((t) => OUTER_CLASS.test(t))
  const inner = tokens.filter((t) => !OUTER_CLASS.test(t))

  return (
    <Tag
      className={[
        'rounded-[1.25rem] border border-line/70 bg-surface/60 p-1 shadow-subtle',
        'transition-[border-color,box-shadow,transform] duration-500 ease-[var(--ease-out-expo)]',
        interactive
          ? 'cursor-pointer hover:-translate-y-1 hover:border-line-strong hover:shadow-card-hover active:scale-[0.99] motion-reduce:hover:translate-y-0'
          : '',
        ...outer,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <div
        className={[
          'h-full rounded-[calc(1.25rem-0.25rem)] bg-surface shadow-[inset_0_1px_0_rgba(248,246,240,0.06)]',
          ...inner,
        ].join(' ')}
      >
        {children}
      </div>
    </Tag>
  )
}
