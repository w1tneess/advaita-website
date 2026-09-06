import Card from '@/components/ui/Card.jsx'
import Icon from '@/components/meta/Icon.jsx'

import { motion } from 'framer-motion'
import { EASE_OUT_EXPO } from '@/lib/animations.js'

/**
 * Research-interest card.
 *
 * The note under each interest deliberately frames it as an interest rather than an
 * area of expertise.
 */
export default function InterestCard({ interest, headingLevel = 3, index }) {
  const Heading = `h${headingLevel}`

  return (
    <Card
      as={motion.div}
      className="group relative flex gap-4 p-5 sm:p-6 h-full overflow-hidden transform-gpu border border-line/80 hover:border-accent/40 transition-all duration-300 hover:shadow-card-hover"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-all duration-300 group-hover:scale-105 group-hover:bg-accent/20 group-hover:border-accent/40 shadow-sm"
        aria-hidden="true"
      >
        <Icon name={interest.icon} className="h-4.5 w-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <Heading className="text-base font-semibold text-ink group-hover:text-accent transition-colors duration-200">
            {interest.name}
          </Heading>
          {index !== undefined && (
            <span className="font-mono text-[11px] font-medium text-muted/40 group-hover:text-accent/70 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
        </div>
        {interest.note && <p className="mt-1.5 text-sm leading-relaxed text-muted/90">{interest.note}</p>}
      </div>
    </Card>
  )
}
