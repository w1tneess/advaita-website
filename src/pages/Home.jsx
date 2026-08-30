import { ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'

import Button from '../components/ui/Button.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import InterestCard from '../components/features/InterestCard.jsx'

import ProjectCard from '../components/features/ProjectCard.jsx'
import Section from '../components/layout/Section.jsx'
import Seo from '../components/meta/Seo.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../config/nav.js'
import {
  editorialHeroContainer,
  editorialPortraitReveal,
  editorialCopyReveal,
  sectionReveal,
  staggerContainer,
  staggerItem,
  scrollViewport,
} from '../lib/animations.js'
import './HeroSection.css'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

export default function Home() {
  const { profile, home, featuredProjects, interests, social } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/" />

      {/* ─── Cinematic Editorial Hero ──────────────────────────────────────
           Extreme minimalist dark canvas layout inspired by Kirill Pritula reference.
           ────────────────────────────────────────────────────────────────── */}
      <motion.section
        className="hero-cinematic"
        aria-label="Introduction"
        variants={editorialHeroContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Background Portrait Layer */}
        <motion.div className="hero-bg-portrait-wrapper" variants={editorialPortraitReveal}>
          <img
            src="/pfp.png"
            alt={`Portrait of ${profile.name}`}
            className="hero-bg-portrait"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        {/* Left Column: Massive Typography */}
        <motion.div className="hero-col-left" variants={editorialCopyReveal}>
          <h1 className="hero-name-massive">
            <span>{profile.name.split(' ')[0]}</span>
            <span>{profile.name.split(' ')[1] || ''}</span>
          </h1>
          <div className="hero-identity-line">
            <span className="hero-identity-separator" aria-hidden="true"></span>
            <span>THINKER / BUILDER / OBSERVER</span>
          </div>
          <p className="hero-intro-text">
            {home.heroIntro ||
              "A personal space for things I'm thinking about, making, and noticing."}
          </p>
        </motion.div>

        {/* Bottom Right: Socials */}
        <motion.div className="hero-bottom-right" variants={editorialCopyReveal}>
          <ul className="hero-social-horizontal">
            {social
              ?.filter((s) => s.visible && s.kind === 'link')
              .slice(0, 3)
              .map((item, index, arr) => (
                <li key={item.id} className="flex items-center gap-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                  >
                    {item.platform}
                  </a>
                  {index < arr.length - 1 && <span className="hero-social-separator">/</span>}
                </li>
              ))}
          </ul>
        </motion.div>
      </motion.section>

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
        <Section id="credibility" width="default" className="border-t border-line/40">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-wider text-accent uppercase mb-3">
                Transparency & Approach
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-ink leading-tight">
                {home.credibilityHeading}
              </h2>
            </div>

            <div className="lg:col-span-7">
              <p className="text-lg leading-relaxed text-ink border-l-2 border-accent/60 pl-6 py-1">
                {home.credibilityStatement}
              </p>

              {(home.credibilityPoints || []).length > 0 && (
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {home.credibilityPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      <span className="leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Section>
      </motion.div>
    </>
  )
}
