import { ArrowUpRight, ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'

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

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

export default function Home() {
  const { profile, home, featuredProjects, interests, social } = useContent()

  return (
    <div className="bg-canvas overflow-hidden">
      <Seo title={ROUTE.title} description={ROUTE.description} path="/" />

      {/* ═══ 01 HERO ═════════════════════════════════════════════════════ */}
      <motion.section
        className="relative w-full min-h-[85svh] md:min-h-[85vh] pt-16 md:pt-20 lg:pt-24 pb-16 px-6 md:px-12 lg:px-24 flex items-start justify-center"
        aria-label="Introduction"
        variants={editorialHeroContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Subtle cinematic glow */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,var(--color-accent)_0%,transparent_60%)] opacity-[0.02]" />
        
        <div className="relative z-10 w-full max-w-[1280px] 2xl:max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-6 lg:gap-x-12 2xl:gap-x-24 items-end">
          
          {/* Portrait */}
          <motion.div 
            className="md:col-span-5 lg:col-span-6 flex justify-center md:justify-end" 
            variants={editorialPortraitReveal}
          >
            <div className="relative w-full aspect-[4/5] max-w-[400px] md:max-w-[450px] lg:max-w-[550px] 2xl:max-w-[750px] overflow-hidden md:-mr-4 lg:-mr-12 2xl:-mr-16">
              {/* Subtle rim light / separation glow for portrait against dark canvas */}
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,#2a2a2a_0%,transparent_65%)] opacity-80" />
              <img
                src="/pfp.png"
                alt={`Portrait of ${profile.name}`}
                className="relative z-10 w-full h-full object-cover object-top filter grayscale contrast-100 brightness-[1.2] transition-all duration-700 hover:grayscale-[0.5]"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                }}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </motion.div>

          {/* Typography */}
          <motion.div 
            className="md:col-span-7 lg:col-span-6 flex flex-col justify-end relative z-10 md:pl-4 lg:pl-8 pb-4"
            variants={editorialCopyReveal}
          >
            <div className="mb-4 lg:mb-6">
              <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-muted/60 uppercase">
                01 / 04
              </span>
              <br />
              <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-accent uppercase">
                Personal Archive
              </span>
            </div>

            <h1 className="font-display text-[3.25rem] md:text-5xl lg:text-[5.5rem] 2xl:text-[8rem] leading-[0.9] font-medium text-ink uppercase tracking-tight -ml-[0.04em] mb-8 2xl:mb-12 text-balance">
              Advaita<br/>Chandra
            </h1>
            
            <div className="max-w-lg 2xl:max-w-2xl">
              <div className="font-mono text-[11px] md:text-xs 2xl:text-sm tracking-[0.15em] text-ink/80 uppercase mb-4 2xl:mb-6 leading-none">
                Student · Explorer · Builder
              </div>
              
              <p className="font-sans text-[15px] md:text-base lg:text-xl 2xl:text-2xl text-muted leading-relaxed font-normal text-balance mb-10 2xl:mb-14">
                Photography, philosophy, code and experiments. <br className="hidden md:block"/>
                A personal digital lab for thinking, making, <br className="hidden md:block"/>
                noticing and documenting.
              </p>

              <div className="flex flex-wrap items-center gap-6 2xl:gap-10">
                <Link to="/projects" className="group flex items-center gap-2">
                  <span className="font-mono text-[10px] md:text-[11px] 2xl:text-xs uppercase tracking-[0.15em] text-ink border-b border-transparent group-hover:border-accent transition-colors pb-[1px] group-hover:text-accent">
                    Explore My World
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 transition-transform group-hover:translate-x-1 text-accent" />
                </Link>
                <Link to="/about" className="group flex items-center gap-2">
                  <span className="font-mono text-[10px] md:text-[11px] 2xl:text-xs uppercase tracking-[0.15em] text-ink border-b border-transparent group-hover:border-accent transition-colors pb-[1px] group-hover:text-accent">
                    About Me
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-accent" />
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* ═══ 02 SELECTED WORK ════════════════════════════════════════════ */}
      <motion.section
        className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-line"
        aria-label="Selected Work"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <div className="max-w-[1440px] mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl md:text-5xl text-ink tracking-tight mb-4">
                {home.featuredHeading}
              </h2>
              <p className="font-sans text-lg text-muted">
                {home.featuredIntro}
              </p>
            </div>
            <Link to="/projects" className="group font-mono text-[11px] uppercase tracking-[0.15em] text-accent flex items-center gap-3 transition-colors hover:text-accent-strong">
              All projects
              <span className="block w-6 h-[1px] bg-accent transition-transform group-hover:translate-x-2"></span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-12 md:gap-0 border-t border-line">
            {featuredProjects.map((project, idx) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.slug}`}
                className="group flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-12 py-8 md:py-12 border-b border-line hover-trigger"
              >
                {/* Index & Categories */}
                <div className="lg:w-[20%] flex flex-col gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-muted/50 group-hover:text-accent transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {project.categories?.length > 0 && (
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted">
                      {project.categories[0]}
                    </span>
                  )}
                </div>

                {/* Title & Desc */}
                <div className="lg:w-[50%] flex flex-col gap-3">
                  <h3 className="font-display text-2xl md:text-3xl text-ink group-hover:text-accent transition-colors tracking-tight text-balance">
                    {project.title}
                  </h3>
                  <p className="font-sans text-base text-muted/90 leading-relaxed max-w-prose">
                    {project.summary || project.description}
                  </p>
                </div>

                {/* Meta & Status */}
                <div className="lg:w-[30%] flex flex-col items-start lg:items-end gap-3 mt-2 lg:mt-0">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {project.status.replace('-', ' ')}
                  </span>
                  {project.tools?.length > 0 && (
                    <span className="font-sans text-sm text-muted/70">
                      {project.tools.slice(0, 3).join(', ')}
                    </span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink mt-2 lg:mt-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View Project <ArrowUpRight className="inline-block w-3 h-3 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </motion.section>

      {/* ═══ 03 WHAT I'M RESEARCHING ═════════════════════════════════════ */}
      <motion.section
        className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-line bg-surface/30"
        aria-label="Research and Interests"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <span className="font-mono text-[11px] tracking-[0.15em] text-accent uppercase">
              Research & Exploration
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-ink tracking-tight leading-[1.1]">
              {home.interestsHeading}
            </h2>
            <p className="font-sans text-lg text-muted leading-relaxed">
              {home.interestsIntro}
            </p>
          </div>

          {/* Right Column: List of Interests */}
          <div className="lg:col-span-8">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {interests.map((interest, idx) => (
                <li key={interest.id} className="flex flex-col gap-2 relative group">
                  <div className="flex items-baseline gap-4 border-b border-line pb-3">
                    <span className="font-mono text-[10px] tracking-widest text-muted/40 transition-colors group-hover:text-accent">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-xl md:text-2xl text-ink tracking-tight group-hover:text-accent transition-colors">
                      {interest.name}
                    </h3>
                  </div>
                  {interest.note && (
                    <p className="font-sans text-sm md:text-base text-muted/80 leading-relaxed pt-2">
                      {interest.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </motion.section>

      {/* ═══ 04 SITE STATEMENT ═══════════════════════════════════════════ */}
      <motion.section
        className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-line bg-surface/20"
        aria-label="Credibility Statement"
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
              Transparency & Approach
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink tracking-tight leading-[1.1] text-balance">
              {home.credibilityHeading}
            </h2>
          </div>

          {/* Right Column: Statement & Points */}
          <div className="lg:col-span-7 flex flex-col">
            <p className="font-sans text-lg md:text-xl text-muted leading-[1.7] max-w-prose mb-12">
              {home.credibilityStatement}
            </p>

            {(home.credibilityPoints || []).length > 0 && (
              <ul className="flex flex-col gap-8 border-t border-line/40 pt-10">
                {home.credibilityPoints.map((point, index) => (
                  <li key={index} className="flex gap-5">
                    <span className="font-mono text-[10px] tracking-widest text-accent/70 mt-1.5 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans text-base text-ink/80 leading-relaxed max-w-prose">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </motion.section>

    </div>
  )
}
