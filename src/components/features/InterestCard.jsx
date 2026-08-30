import Card from '@/components/ui/Card.jsx'
import Icon from '@/components/meta/Icon.jsx'

import { motion } from 'framer-motion'

/**
 * Research-interest card.
 *
 * The note under each interest deliberately frames it as an interest rather than an
 * area of expertise.
 */
export default function InterestCard({ interest, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`

  return (
    <Card
      as={motion.div}
      className="flex gap-4 p-5 h-full transform-gpu origin-left"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
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
