import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

import Button from '../components/ui/Button.jsx'
import Callout from '../components/ui/Callout.jsx'
import Card from '../components/ui/Card.jsx'
import Container from '../components/layout/Container.jsx'

import InterestCard from '../components/features/InterestCard.jsx'
import Section from '../components/layout/Section.jsx'
import Seo from '../components/meta/Seo.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../config/nav.js'
import {
  pageLoadVariant,
  sectionReveal,
  staggerContainer,
  staggerItem,
  scrollViewport,
} from '../lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'about')

export default function About() {
  const { profile, settings, interests, skillGroups, timeline, publicProjects } = useContent()

  /** Map a skill's `evidence` slug to the project it points at, if that project is public. */
  const evidenceFor = (slug) =>
    slug ? (publicProjects.find((project) => project.slug === slug) ?? null) : null

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/about" />

      <Container>
        <motion.div
          className="py-12 sm:py-16 md:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <div className="border-b border-line/40 pb-8 sm:pb-10">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent uppercase mb-3">
              <span>⟐</span>
              <span>BIOGRAPHICAL CONTEXT & INQUIRY</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-ink">
                {profile.name}
              </h1>
              <ul className="mt-4 flex flex-wrap items-center gap-2">
                {profile.roles.map((role) => (
                  <li key={role} className="inline-flex items-center rounded border border-line bg-surface/80 px-2.5 py-1 text-xs font-medium text-muted">
                    {role}
                  </li>
                ))}
                <li className="inline-flex items-center text-xs text-muted/60 pl-2 font-mono">
                  {profile.location}
                </li>
              </ul>
            </div>

            {/* The biography with editorial callout treatment */}
            <div className="mt-8 max-w-3xl border-l-2 border-accent/40 pl-5 sm:pl-6 py-1">
              <p className="font-display text-xl sm:text-2xl font-normal leading-relaxed text-ink/95">
                {profile.bio}
              </p>
            </div>

            {profile.epistemicNote && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted/90">
                {profile.epistemicNote}
              </p>
            )}
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
          id="about-interests"
          tone="raised"
          title="Research interests"
          intro="Eleven standing interests."
        >
          <motion.ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {interests.map((interest, idx) => (
              <motion.li key={interest.id} variants={staggerItem}>
                <InterestCard interest={interest} index={idx} />
              </motion.li>
            ))}
          </motion.ul>
        </Section>
      </motion.div>

      {settings.showSkills && skillGroups.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={sectionReveal}
        >
          <Section
            id="about-abilities"
            title="Technical and research abilities"
            intro="Each is labelled either 'Learning' or 'Working knowledge'."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {skillGroups.map((group) => (
                <Card key={group.name} as="div" className="p-6 sm:p-7">
                  <h3 className="text-xs font-semibold tracking-wider text-accent uppercase mb-5 pb-3 border-b border-line/40">
                    {group.name}
                  </h3>
                  <ul className="space-y-3">
                    {group.items.map((skill) => {
                      const project = evidenceFor(skill.evidence)
                      return (
                        <li
                          key={skill.id}
                          className="flex items-start justify-between gap-3 py-1"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-ink">{skill.name}</span>
                              <StatusBadge kind="skill" value={skill.level} />
                            </div>
                            {skill.note && (
                              <p className="mt-1 text-xs leading-relaxed text-muted">{skill.note}</p>
                            )}
                            {project && (
                              <Link
                                to={`/projects#project-${project.slug}`}
                                className="mt-1.5 inline-block text-xs text-accent underline underline-offset-3 hover:text-accent-strong transition-colors"
                              >
                                Evidence: {project.title}
                              </Link>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </Card>
              ))}
            </div>
          </Section>
        </motion.div>
      )}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Section
          id="about-direction"
          tone="raised"
          title="Current learning direction"
          width="default"
        >
          <p className="max-w-prose text-lg leading-relaxed">{profile.learningDirection}</p>

          {settings.showTimeline && timeline.length > 0 && (
            <ol className="mt-10 space-y-0 border-l border-line pl-6">
              {timeline.map((item) => (
                <li key={item.id} className="relative pb-8 last:pb-0">
                  <span
                    className="absolute top-1.5 -left-[1.8125rem] h-2.5 w-2.5 rounded-full border-2 border-canvas bg-accent"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                    {item.period}
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
                  <p className="mt-1.5 max-w-prose text-sm text-muted">{item.detail}</p>
                </li>
              ))}
            </ol>
          )}
        </Section>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Section
          id="about-approach"
          title="How I approach a question"
          intro="Four steps, in this order."
        >
          <motion.ol
            className="grid gap-6 sm:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {profile.approach.map((step, index) => (
              <motion.li key={step.title} variants={staggerItem}>
                <Card as="div" className="p-6 sm:p-7 border border-line bg-surface transition-colors hover:border-ink/20">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-mono text-xs font-semibold text-accent"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-ink">{step.title}</h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">{step.detail}</p>
                </Card>
              </motion.li>
            ))}
          </motion.ol>
        </Section>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Section id="about-labels" tone="raised">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Stated plainly rather than buried: this is a student's site. */}
            <Callout variant="limitation" title="What I am not claiming">
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-limitation" aria-hidden="true" />
                  <span>
                    Nothing here is peer-reviewed or professionally credentialed.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-limitation" aria-hidden="true" />
                  <span>
                    The projects listed are personal work, built independently and not published or externally reviewed.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-limitation" aria-hidden="true" />
                  <span>
                    Where I have no evidence for something, it is listed as an interest or learning rather than a skill.
                  </span>
                </li>
              </ul>
            </Callout>

            {/* Quiet human note on correspondence and dialogue */}
            <Card as="div" className="p-6 sm:p-7 border border-line bg-surface">
              <h3 className="text-xs font-semibold tracking-wider text-accent uppercase mb-3">
                Dialogue & Corrections
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                If you find factual errors or disputed accounts in my notes or datasets, please write to me. Corrections accompanied by original citations are the most valuable mail I receive.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                I am always open to discussing philosophy, Indian political history, open data tools, and photography with thoughtful readers.
              </p>
            </Card>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/projects">
              See the work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to="/contact" variant="secondary">
              Get in touch
            </Button>
          </div>
        </Section>
      </motion.div>
    </>
  )
}
