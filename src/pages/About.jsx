import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'

import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import Callout from '../components/ui/Callout.jsx'
import Card from '../components/ui/Card.jsx'
import Container from '../components/layout/Container.jsx'
import ExpandableFaq from '../components/ui/ExpandableFaq.jsx'

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
          className="py-16 sm:py-20 md:py-36"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar profile={profile} size="lg" />
            <header className="max-w-2xl">
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {profile.name}
              </h1>
              <ul className="mt-3 flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                  <li key={role}>
                    <Badge>{role}</Badge>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-muted">{profile.location}</p>
            </header>
          </div>

          {/* The biography is the text supplied for this site, unchanged. */}
          <p className="mt-10 max-w-prose text-lg leading-relaxed">{profile.bio}</p>

          {profile.epistemicNote && (
            <p className="mt-5 max-w-prose text-muted">{profile.epistemicNote}</p>
          )}
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
                  <motion.ul
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={scrollViewport}
                  >
                    {group.items.map((skill) => {
                      const project = evidenceFor(skill.evidence)
                      return (
                        <motion.li
                          key={skill.id}
                          className="flex items-start justify-between gap-3 py-1"
                          variants={staggerItem}
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
                        </motion.li>
                      )
                    })}
                  </motion.ul>
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
                <Card as="div" className="card-interactive p-6">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display text-2xl font-semibold text-accent"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{step.detail}</p>
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
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Nothing here is peer-reviewed or professionally credentialed.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    The projects listed are personal work, built independently and not published or externally reviewed.
                  </span>
                </li>
                <li className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Where I have no evidence for something, it is listed as an interest or learning rather than a skill.
                  </span>
                </li>
              </ul>
            </Callout>
          </div>

          <ExpandableFaq
            items={[
              {
                question: 'What technologies do you use for your web applications?',
                answer: 'I build web applications using React, modern JavaScript (ESNext), Tailwind CSS, Vite, Supabase for database/auth, and Framer Motion for contemporary micro-animations.',
              },
              {
                question: 'Can I collaborate or request a project?',
                answer: 'Yes! Feel free to reach out via the Contact page or email. I am always open to discussing open-source software, philosophy, photography, and creative technology.',
              },
              {
                question: 'How do you structure your research and writing?',
                answer: 'Writing on this site follows an epistemic classification model (Facts, Analysis, Opinions, and Limitations) to maintain transparency and rigor.',
              },
              {
                question: 'Is the source code for this site public?',
                answer: 'Yes, this website is fully open-source and pre-rendered statically with modern web performance standards.',
              },
            ]}
            className="mt-16 sm:mt-24"
          />

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
