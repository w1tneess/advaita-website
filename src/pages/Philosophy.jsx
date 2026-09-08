import { useState, useMemo } from 'react'
import { BookMarked, Compass, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import Container from '@/components/layout/Container.jsx'
import FilterBar from '@/components/FilterBar.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Seo from '@/components/meta/Seo.jsx'
import ThinkerCard from '../components/features/ThinkerCard.jsx'
import { useFilters } from '@/hooks/useFilters.js'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { formatDate, readingMinutes, byNewest } from '../lib/format.js'
import {
  pageLoadVariant,
  sectionReveal,
  staggerContainer,
  staggerItem,
  scrollViewport,
} from '../lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'philosophy')
const INITIAL_FILTERS = { category: [] }

/** Detailed intellectual dossiers for interactive exploration of each thinker. */
const THINKER_DOSSIERS = {
  'thinker-krishnamurti': {
    era: '1895–1986',
    coreInquiry: 'Self-Observation & The Division of the Self',
    primaryTexts: 'Freedom from the Known · The First and Last Freedom',
    centralQuestion: 'Can attention observe mental reactions without immediately forming a new narrative "observer" to judge them?',
    reflection: 'Krishnamurti interrogates the automatic habit of creating psychological distance from one’s own reactions. When examined alongside modern metacognition, the question is whether direct observation without internal verbal commentary is neurologically possible or if the "observer" is simply a secondary narrative process.',
  },
  'thinker-camus': {
    era: '1913–1960',
    coreInquiry: 'The Absurd & Intellectual Honesty',
    primaryTexts: 'The Myth of Sisyphus · The Rebel',
    centralQuestion: 'How does one live with unresolvable ambiguity and an indifferent universe without escaping into comforting dogmas?',
    reflection: 'Camus treats the Absurd not as a problem to be cured, but as an epistemic tension to be maintained without illusion. For analytical work, this is a strong foundation: accept missing information and unresolvable complexity without losing the resolve for disciplined inquiry.',
  },
  'thinker-dostoevsky': {
    era: '1821–1881',
    coreInquiry: 'Psychological Realism & Autonomous Will',
    primaryTexts: 'Notes from Underground · Crime and Punishment',
    centralQuestion: 'Why do rational economic and utilitarian models consistently fail to predict human self-destructive or spiteful choices?',
    reflection: 'Dostoevsky refutes the utilitarian idea that human beings will reliably act in their self-interest once educated. Humans will deliberately choose irrationality, suffering, and defiance if that is what preserves their feeling of autonomous agency.',
  },
  'thinker-ramana': {
    era: '1879–1950',
    coreInquiry: 'Self-Inquiry (Vichara) as an Empirical Test',
    primaryTexts: 'Who Am I? (Nan Yar?) · Talks with Sri Ramana Maharshi',
    centralQuestion: 'Can inquiring into the origin of the "I-thought" be conducted as a verifiable introspective experiment rather than a theological doctrine?',
    reflection: 'Ramana proposes self-inquiry as a practical, direct method of tracing attention back to the awareness that precedes verbal thought. I approach this as a repeatable cognitive exercise in attention control rather than a religious dogma.',
  },
  'thinker-osho': {
    era: '1931–1990',
    coreInquiry: 'Dialectical Provocation & Deconditioning',
    primaryTexts: 'Early discourses on awareness and meditation',
    centralQuestion: 'How can one use radical counter-arguments to expose unconscious conditioning without falling prey to new dogmas or unreliable narratives?',
    reflection: 'I read Osho specifically to test my own unexamined assumptions against sharp dialectical challenges. While his historical citations and empirical claims require strict verification, his method of dismantling habitual thought patterns remains intellectually provocative.',
  },
}

const DEFAULT_NOTES = [
  {
    id: 'note-krishnamurti-observer',
    title: 'On Krishnamurti and the Mechanics of the Observer',
    category: 'Epistemology',
    status: 'published',
    published_at: '2025-11-14',
    content:
      "Krishnamurti argues that psychological conflict begins when the observer separates themselves from what is observed—treating fear, envy, or restlessness as an external object to be managed or suppressed.\n\nWhen reading this alongside contemporary cognitive psychology, the central question is whether direct observation without internal verbal commentary is neurologically sustainable, or if the 'silent observer' is simply another sub-network of narrative metacognition.\n\nMy working hypothesis: non-verbal attention does not eliminate mental constructs, but slows the recursive loop of reactive self-justification, allowing one to notice automatic habits before acting on them.",
  },
  {
    id: 'note-camus-absurd',
    title: 'Camus: The Absurd as an Epistemic Baseline',
    category: 'Existentialism',
    status: 'published',
    published_at: '2025-10-02',
    content:
      'In The Myth of Sisyphus, the absurd is not a property of the universe alone; it is the friction produced when the human longing for clarity collides with an unanswering world. Rather than leaping into metaphysical certainty or cynicism, Camus demands maintaining the tension without illusion.\n\nFor scientific and data work, this serves as a useful discipline: accept the presence of unresolvable ambiguity and missing data without losing the appetite for rigorous, sustained inquiry.',
  },
  {
    id: 'note-dostoevsky-underground',
    title: 'Dostoevsky on Rational Egoism and Irrational Will',
    category: 'Psychology & Ethics',
    status: 'published',
    published_at: '2025-08-19',
    content:
      "Reading Notes from Underground against modern behavioral economics: utilitarian and rational choice models often assume that individuals will act in their enlightened self-interest once adequately informed. Dostoevsky's underground narrator directly attacks this assumption—humans will deliberately choose irrationality, suffering, and spite if that is what preserves their sense of autonomy.\n\nAny computational or institutional system that assumes pure utility maximization consistently misjudges human behavior because it underestimates the human refusal to be treated as a predictable equation.",
  },
]

export default function Philosophy() {
  const { philosophy, publicNotes } = useContent()
  const thinkers = philosophy.thinkers || []
  const notes =
    publicNotes && publicNotes.length > 0
      ? publicNotes
      : philosophy.notes && philosophy.notes.length > 0
        ? philosophy.notes
        : DEFAULT_NOTES

  const { values, setValue, toggleValue } = useFilters(INITIAL_FILTERS)
  const activeCategories = values.category

  // Interactive thinker selection state
  const [selectedThinkerId, setSelectedThinkerId] = useState(null)

  const selectedThinker = thinkers.find((t) => t.id === selectedThinkerId)
  const dossier = selectedThinker ? THINKER_DOSSIERS[selectedThinker.id] : null

  // Categories extracted from notes
  const categories = useMemo(() => {
    const set = new Set()
    notes.forEach((n) => {
      if (n.category) set.add(n.category)
    })
    return Array.from(set).sort()
  }, [notes])

  const filteredNotes = useMemo(() => {
    let result = notes
    if (activeCategories.length > 0) {
      result = notes.filter((n) => activeCategories.includes(n.category))
    }
    return byNewest(result, 'published_at')
  }, [notes, activeCategories])

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/philosophy" />

      {/* Page Header & Intro Block */}
      <section className="pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-36 md:pb-20">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={pageLoadVariant}
            className="max-w-4xl"
          >
            {/* Epistemic Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent mb-4">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              Epistemic Thought & Reading Notes
            </div>

            {/* Primary Display Title */}
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-ink">
              Philosophy
            </h1>

            {/* Large Pull Quote */}
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-ink/90 font-serif italic max-w-3xl">
              "{philosophy.intro}"
            </p>

            {/* Hairline Divider Rule */}
            <div className="mt-5 w-16 border-t border-accent/60" aria-hidden="true" />

            {/* Explanatory Note */}
            <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-muted">
              {philosophy.description ||
                "I'm not trained in philosophy formally — this section is me thinking in public, not lecturing. Disagreement and correction are welcome."}
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Section 1: Thinkers & Inquiries */}
      <section className="py-14 sm:py-16 lg:py-20 border-t border-line/40">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            variants={sectionReveal}
          >
            {/* Section Header: Heading on left, Filter Pills on right */}
            <header className="mb-8 sm:mb-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl text-ink">
                    Thinkers & Inquiries
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted max-w-xl">
                    Click on any thinker below to browse core questions, primary texts, and active reading notes.
                  </p>
                </div>

                {/* Thinker Filters */}
                {thinkers.length > 1 && (
                  <FilterBar
                    label="Filter by thinker"
                    options={thinkers.map((t) => ({ value: t.id, label: t.name.split(' ').pop() }))}
                    value={selectedThinkerId || 'all'}
                    onChange={(val) => setSelectedThinkerId(val === 'all' ? null : val)}
                    allLabel={`All (${thinkers.length})`}
                    className="shrink-0 pt-0.5"
                  />
                )}
              </div>
            </header>

            {/* Expanded Interactive Dossier (when a thinker is active) */}
            <AnimatePresence>
              {selectedThinker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden mb-8"
                >
                  <div className="rounded-card border-2 border-accent/40 bg-raised/50 p-6 sm:p-8 relative">
                    <button
                      type="button"
                      onClick={() => setSelectedThinkerId(null)}
                      aria-label="Close dossier"
                      className="absolute top-4 right-4 sm:top-6 sm:right-6 text-muted hover:text-ink p-1 rounded-md transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
                        Inquiry Dossier
                      </span>
                      {dossier?.era && (
                        <span className="font-mono text-xs text-muted/70">({dossier.era})</span>
                      )}
                    </div>

                    <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                      {selectedThinker.name}
                    </h3>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                            Core Intellectual Tension
                          </h4>
                          <p className="mt-1 text-sm font-medium text-ink">
                            {dossier?.coreInquiry || selectedThinker.description}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                            Central Question Interrogated
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-ink/90 font-serif italic bg-surface/70 p-3.5 rounded border border-line/40">
                            "{dossier?.centralQuestion}"
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                            Primary Sources Consulted
                          </h4>
                          <p className="mt-1 text-sm text-muted">
                            {dossier?.primaryTexts || 'Primary reading notes and selected lectures'}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-mono text-[11px] uppercase tracking-wider text-accent font-semibold">
                            Epistemic Distinction
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted">
                            {dossier?.reflection || selectedThinker.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thinker Cards Grid — Reference Geometry: 3 cols row 1, 2 cols row 2 left-aligned */}
            {thinkers.length > 0 ? (
              <motion.ul
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={scrollViewport}
              >
                {thinkers.map((thinker, idx) => (
                  <motion.li key={thinker.id} variants={staggerItem} className="h-full">
                    <ThinkerCard
                      thinker={thinker}
                      index={idx}
                      isSelected={selectedThinkerId === thinker.id}
                      onClick={() =>
                        setSelectedThinkerId((prev) => (prev === thinker.id ? null : thinker.id))
                      }
                    />
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <EmptyState
                title="No thinkers added yet"
                message="Profiles of philosophers and specific ideas will appear here."
              />
            )}
          </motion.div>
        </Container>
      </section>

      {/* Section 2: Notes & Observations */}
      <section id="notes" className="py-14 sm:py-16 lg:py-20 border-t border-line/40">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
            variants={sectionReveal}
          >
            {/* Header: Heading on left, Category Filters on right */}
            <header className="mb-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl text-ink">
                    Notes & Observations
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-muted max-w-xl">
                    {philosophy.notesIntro ||
                      "Short entries on things I've read, ideas that stayed with me, and questions I haven't resolved yet."}
                  </p>
                </div>

                {/* Category filter pills */}
                {categories.length > 1 && (
                  <FilterBar
                    label="Filter by category"
                    options={categories.map((cat) => ({
                      value: cat,
                      label: cat.charAt(0).toUpperCase() + cat.slice(1),
                    }))}
                    value={activeCategories}
                    onChange={(val) => {
                      if (val === 'all') {
                        setValue('category', [])
                      } else {
                        toggleValue('category', val)
                      }
                    }}
                    className="shrink-0 pt-0.5"
                  />
                )}
              </div>
            </header>

            {/* Epistemic Callout Banner — Spanning Full Container Width */}
            <div className="mb-8 rounded-card border-l-2 border-accent bg-raised/40 px-5 py-3.5 text-xs sm:text-sm text-muted">
              I don't expect every note to become an essay. Sometimes one good question is enough.
            </div>

            {/* Reading Note Cards — Full Container Width */}
            {filteredNotes.length > 0 ? (
              <motion.ul
                className="space-y-6 w-full"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={scrollViewport}
              >
                {filteredNotes.map((note, idx) => (
                  <motion.li
                    key={note.id}
                    className="group rounded-card border border-line bg-surface p-6 sm:p-8 shadow-subtle hover:border-ink/20 transition-all duration-200"
                    variants={staggerItem}
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      {/* Left Column: Monospace Index */}
                      <span className="shrink-0 font-mono text-xs sm:text-sm text-muted/60 font-semibold pt-1">
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Right / Main Content Column */}
                      <div className="min-w-0 flex-1 w-full">
                        {/* Title Row + Category Badge */}
                        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line/30 pb-3">
                          <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
                            {note.title}
                          </h3>
                          {note.category && (
                            <span className="inline-flex items-center rounded-full border border-line bg-raised px-2.5 py-0.5 text-xs font-medium text-accent">
                              {note.category}
                            </span>
                          )}
                        </div>

                        {/* Metadata row */}
                        <div className="mt-2 flex items-center gap-2 text-xs font-mono text-muted/70">
                          {note.content && <span>{readingMinutes(note)} min read</span>}
                          {note.published_at && (
                            <>
                              <span>·</span>
                              <time dateTime={note.published_at}>
                                {formatDate(note.published_at)}
                              </time>
                            </>
                          )}
                        </div>

                        {/* Body paragraphs */}
                        <div className="mt-4 prose-body text-ink/90 text-sm sm:text-base leading-relaxed max-w-prose">
                          {(note.content || '').split('\n\n').map((paragraph, pIdx) => (
                            <p key={pIdx} className={pIdx > 0 ? 'mt-3.5' : ''}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <div className="rounded-card border border-dashed border-line bg-surface/30 px-6 py-12 text-center">
                <BookMarked className="mx-auto h-8 w-8 text-muted/40" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-muted">No notes found</p>
                <p className="mt-1 text-xs text-muted">
                  {activeCategories.length > 0
                    ? `No notes in the selected categories yet.`
                    : 'Reading notes will appear here.'}
                </p>
              </div>
            )}
          </motion.div>
        </Container>
      </section>
    </>
  )
}
