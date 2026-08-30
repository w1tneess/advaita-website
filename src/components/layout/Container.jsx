export default function Container({
  as: Tag = 'div',
  width = 'default',
  className = '',
  children,
}) {
  const widths = {
    default: 'max-w-6xl 2xl:max-w-7xl',
    wide: 'max-w-7xl 2xl:max-w-[1500px]',
    prose: 'max-w-3xl lg:max-w-4xl',
  }

  return (
    <Tag
      className={`mx-auto w-full ${widths[width] || widths.default} px-5 sm:px-8 md:px-12 lg:px-16 ${className}`}
    >
      {children}
    </Tag>
  )
}
