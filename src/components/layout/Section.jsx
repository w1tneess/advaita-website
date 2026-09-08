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
      className={`py-16 sm:py-20 lg:py-24 ${tones[tone] || ''} ${className}`}
    >
      <Container width={width}>
        {(title || intro || kicker || actions) && (
          <header className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 max-w-2xl">
                {kicker && (
                  <p className="mb-2 font-mono text-xs font-semibold tracking-widest text-accent uppercase">
                    {kicker}
                  </p>
                )}
                {title && (
                  <Heading
                    id={id ? `${id}-heading` : undefined}
                    className="font-display text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl text-ink"
                  >
                    {title}
                  </Heading>
                )}
                {intro && (
                  <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-muted">
                    {intro}
                  </p>
                )}
              </div>
              {actions && (
                <div className="w-full shrink-0 sm:w-auto sm:self-start pt-1 sm:pt-1.5">{actions}</div>
              )}
            </div>
          </header>
        )}
        {children}
      </Container>
    </section>
  )
}
