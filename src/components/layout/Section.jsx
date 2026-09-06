import Container from '@/components/layout/Container.jsx'

/**
 * A titled page section.
 *
 * `tone="raised"` gives the elevated surface that alternates against the
 * page base colour — the main structural rhythm of the site.
 */
export default function Section({
  id,
  title,
  intro,
  kicker,
  tone = 'base',
  width = 'default',
  headingLevel = 2,
  actions,
  className = '',
  children,
}) {
  const Heading = `h${headingLevel}`
  const tones = {
    base: '',
    raised: 'border-t border-line/40',
    surface: 'border-t border-line/40',
  }

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-heading` : undefined}
      className={`py-20 md:py-28 ${tones[tone] || ''} ${className}`}
    >
      <Container width={width}>
        {(title || intro || kicker) && (
          <header className="mb-10 sm:mb-14">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 max-w-2xl">
                {kicker && (
                  <p className="mb-2 text-sm font-medium tracking-wide text-accent uppercase">
                    {kicker}
                  </p>
                )}
                {title && (
                  <Heading
                    id={id ? `${id}-heading` : undefined}
                    className="font-display text-3xl font-semibold tracking-tight sm:text-4xl"
                  >
                    {title}
                  </Heading>
                )}
                {intro && <p className="mt-3 text-muted">{intro}</p>}
              </div>
              {actions && <div className="w-full shrink-0 sm:w-auto">{actions}</div>}
            </div>
          </header>
        )}
        {children}
      </Container>
    </section>
  )
}
