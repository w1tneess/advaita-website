import { BookMarked } from 'lucide-react'
import { motion } from 'framer-motion'

import Container from '../components/layout/Container.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Section from '../components/layout/Section.jsx'
import Seo from '../components/meta/Seo.jsx'
import ThinkerCard from '../components/features/ThinkerCard.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../config/nav.js'
import {
  pageLoadVariant,
  sectionReveal,
  staggerContainer,
  staggerItem,
  scrollViewport,
} from '../lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'philosophy')

export default function Philosophy() {
  const { philosophy } = useContent()
  const thinkers = philosophy.thinkers || []
  const notes = philosophy.notes || []

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/philosophy" />

      <Container>
        <motion.div
          className="py-14 sm:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <div className="grid gap-12 lg:grid-cols-12">
            <header className="lg:col-span-4">
              <div className="sticky top-24">
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Philosophy
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-muted">{philosophy.intro}</p>
                <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
                  {philosophy.description}
                </p>
              </div>
            </header>

            <motion.div
              className="lg:col-span-8 lg:mt-0"
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
              variants={sectionReveal}
            >
              <h2 className="text-sm font-semibold tracking-wide text-accent uppercase">
                What I'm exploring
              </h2>
              {thinkers.length > 0 ? (
                <motion.ul
                  className="mt-6 grid gap-6 sm:gap-8 sm:grid-cols-2"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={scrollViewport}
                >
                  {thinkers.map((thinker) => (
                    <motion.li key={thinker.id} variants={staggerItem}>
                      <ThinkerCard thinker={thinker} />
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <EmptyState
                  className="mt-6"
                  title="No thinkers added yet"
                  message="Profiles of philosophers and specific ideas will appear here."
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </Container>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Section
          id="notes"
          tone="raised"
          title="Notes and observations"
          intro={philosophy.notesIntro}
        >
          {philosophy.notesDescription && (
            <p className="mb-8 max-w-prose text-sm leading-relaxed text-muted">
              {philosophy.notesDescription}
            </p>
          )}

          {notes.length > 0 ? (
            <motion.ul
              className="space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
            >
              {notes.map((note) => (
                <motion.li
                  key={note.id}
                  className="rounded-xl border border-line bg-surface p-6 shadow-subtle sm:p-8"
                  variants={staggerItem}
                >
                  <div className="prose-body">
                    {/* Simplified markdown rendering for notes */}
                    {note.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {note.date && (
                    <p className="mt-4 text-xs font-medium text-muted">
                      {new Date(note.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-canvas px-6 py-12 text-center">
              <BookMarked className="mx-auto h-8 w-8 text-muted/40" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-muted">No notes yet</p>
              <p className="mt-1 text-xs text-muted">Raw thoughts and reading notes will go here.</p>
            </div>
          )}
        </Section>
      </motion.div>
    </>
  )
}
