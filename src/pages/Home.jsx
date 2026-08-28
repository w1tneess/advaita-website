import { ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'

import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Container from '../components/layout/Container.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import InterestCard from '../components/features/InterestCard.jsx'

import ProjectCard from '../components/features/ProjectCard.jsx'
import Section from '../components/layout/Section.jsx'
import Seo from '../components/meta/Seo.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../config/nav.js'
import {
  heroContainer,
  heroLine,
  sectionReveal,
  staggerContainer,
  staggerItem,
  scrollViewport,
} from '../lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

export default function Home() {
  const { profile, home, settings, featuredProjects, latestPosts, interests } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/" />

      {/* Hero — typography-led entrance animation, deliberately restrained:
          no statistics, no claims, no badges of achievement. */}
      <Container>
        <motion.div
          className="max-w-5xl py-16 sm:py-24 md:py-32"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <div className="grid gap-8 md:gap-24 md:grid-cols-2 md:items-center">
            {/* Left Column: Text */}
            <div>
              {home.heroKicker && (
                <motion.p
                  className="text-sm font-medium tracking-wide text-accent"
                  variants={heroLine}
                >
                  {home.heroKicker}
                </motion.p>
              )}

              <motion.h1
                className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl lg:text-[3.5rem] lg:leading-tight"
                variants={heroLine}
              >
                {home.heroHeading}
              </motion.h1>

              <motion.p
                className="mt-6 max-w-prose text-base md:text-lg leading-relaxed text-muted"
                variants={heroLine}
              >
                {home.heroIntro}
              </motion.p>

              <motion.p
                className="mt-4 max-w-prose text-zinc-600 dark:text-zinc-400 leading-relaxed"
                variants={heroLine}
              >
                A place for unfinished thoughts, strange questions, and things worth looking at twice. I’m interested in how ideas take shape—in code, in design, in writing, and in the spaces between them. Not everything here has a definitive answer; some things are here simply because I’m still thinking about them.
              </motion.p>

              <motion.div className="mt-9 flex flex-wrap gap-3" variants={heroLine}>
                <Button to={home.primaryCta.to} size="lg">
                  {home.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                {home.secondaryCta && (
                  <Button to={home.secondaryCta.to} variant="secondary" size="lg">
                    {home.secondaryCta.label}
                  </Button>
                )}
              </motion.div>

              <motion.p className="mt-10 text-sm text-muted" variants={heroLine}>
                {profile.name} · {profile.location}
              </motion.p>
            </div>

            {/* Right Column: Edgeless Image */}
            <motion.div 
              className="flex justify-center md:justify-end"
              variants={heroLine}
            >
              <img 
                src="/pfp.png" 
                alt={profile.name} 
                className="w-48 mx-auto md:mx-0 md:w-96 lg:w-[28rem] object-cover dark:opacity-90 dark:mix-blend-luminosity [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]"
              />
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {/* Featured projects */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Section
          id="featured"
          tone="raised"
          title={home.featuredHeading}
          intro={home.featuredIntro}
          actions={
            <Button to="/projects" variant="secondary" size="sm">
              All projects
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          }
        >
          {featuredProjects.length > 0 ? (
            <motion.ul
              className="grid gap-6 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
            >
              {featuredProjects.map((project) => (
                <motion.li key={project.id} className="h-full" variants={staggerItem}>
                  <ProjectCard project={project} variant="compact" />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <EmptyState
              title="No featured projects yet"
              message="Projects marked as featured will appear here."
              action={
                <Button to="/projects" variant="secondary" size="sm">
                  View the portfolio
                </Button>
              }
            />
          )}
        </Section>
      </motion.div>



      {/* Interests */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Section
          id="interests"
          tone="raised"
          title={home.interestsHeading}
          intro={home.interestsIntro}
        >
          <motion.ul
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {interests.map((interest) => (
              <motion.li key={interest.id} variants={staggerItem}>
                <InterestCard interest={interest} />
              </motion.li>
            ))}
          </motion.ul>
        </Section>
      </motion.div>

      {/* Credibility statement */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Section id="credibility" title={home.credibilityHeading} width="prose">
          <div>
            <p className="text-lg leading-8 border-l-2 border-line pl-6 py-1">
              {home.credibilityStatement}
            </p>

            {(home.credibilityPoints || []).length > 0 && (
              <ul className="mt-12 space-y-4">
                {home.credibilityPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      </motion.div>
    </>
  )
}
