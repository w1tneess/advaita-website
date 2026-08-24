import Card from './Card.jsx'
import Icon from './Icon.jsx'

/**
 * Research-interest card.
 *
 * The note under each interest deliberately frames it as an interest rather than an
 * area of expertise.
 */
export default function InterestCard({ interest, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`

  return (
    <Card as="li" className="flex gap-4 p-5">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-accent"
        aria-hidden="true"
      >
        <Icon name={interest.icon} className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0">
        <Heading className="text-base font-semibold">{interest.name}</Heading>
        {interest.note && <p className="mt-1 text-sm text-muted">{interest.note}</p>}
      </div>
    </Card>
  )
}
