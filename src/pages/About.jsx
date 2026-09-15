import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
import InterestCard from '@/components/features/InterestCard.jsx'
import StatusBadge from '@/components/ui/StatusBadge.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'about')

export default function About() {
  const { profile, settings, interests, skillGroups, timeline, publicProjects } = useContent()

  const evidenceFor = (slug) =>
    slug ? (publicProjects?.find((project) => project.slug === slug) ?? null) : null

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/about" />

      <PageHeader
        eyebrow="Official Profile"
        title="About Advaita Chandra"
        lead={
          profile.bio ||
          "Advaita Chandra is a student and developer from Shāntipur, West Bengal, India. He builds websites, experiments with code, explores digital technology, and documents his interests in photography, philosophy, history, and creative computing. His official website is https://advaitachandra.in/."
        }
      >
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-3">
          <span className="text-copper">ROLE //</span>
          {profile.roles?.map((role) => (
            <span
              key={role}
              className="border border-line bg-surface px-2.5 py-0.5 text-[11px] text-text font-medium"
            >
              {role}
            </span>
          )) || (
            <span className="border border-line bg-surface px-2.5 py-0.5 text-[11px] text-text font-medium">
              Student and Developer
            </span>
          )}
          <span className="text-line-strong">|</span>
          <span className="text-copper font-medium">
            LOCATION: {profile.location ? profile.location.toUpperCase() : 'SHĀNTIPUR, WEST BENGAL, INDIA'}
          </span>
        </div>
      </PageHeader>

      <div className="shell pb-24 md:pb-32 space-y-20 md:space-y-28">
        {/* 1. Official Verification & Central Identity Card */}
        <Reveal y={12}>
          <section className="border border-copper/40 bg-surface/60 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 mb-6">
              <div className="flex items-center gap-2.5 font-mono text-xs text-copper tracking-wider uppercase">
                <span className="h-2 w-2 rounded-full bg-copper animate-pulse" />
                <span>Central Source of Truth</span>
              </div>
              <span className="font-mono text-[11px] text-text-3 tracking-wider">
                CANONICAL DOMAIN: ADVAITACHANDRA.IN
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-12 items-start">
              <div className="lg:col-span-7 space-y-4">
                <h2 className="font-display text-2xl sm:text-3xl text-text font-normal leading-snug">
                  This is the official website of Advaita Chandra.
                </h2>
                <p className="text-sm sm:text-base text-text-2 font-light leading-relaxed">
                  Advaita Chandra is a student and developer from Shāntipur, West Bengal, India. He builds
                  websites, experiments with code, explores digital technology, and documents his interests in
                  photography, philosophy, history, and creative computing.
                </p>
                <p className="text-xs sm:text-sm text-text-3 font-light leading-relaxed">
                  This website is the central source of truth for his work, technical experiments, long-form
                  research, and verified public accounts.
                </p>
              </div>

              <div className="lg:col-span-5 bg-canvas/80 border border-line p-5 space-y-4 font-mono text-xs">
                <div className="text-[11px] text-copper uppercase tracking-wider font-semibold border-b border-line/60 pb-2.5 flex items-center justify-between">
                  <span>Verified Profiles</span>
                  <span className="text-[10px] text-text-3 font-normal">AUTHENTIC LINKS</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between gap-2 border-b border-line/30 pb-2">
                    <span className="text-text-3">Website:</span>
                    <a
                      href="https://advaitachandra.in/"
                      className="text-text hover:text-copper transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <span>advaitachandra.in</span>
                      <ArrowUpRight className="h-3 w-3 text-copper" />
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-2 border-b border-line/30 pb-2">
                    <span className="text-text-3">GitHub:</span>
                    <a
                      href="https://github.com/w1tneess"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text hover:text-copper transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <span>github.com/w1tneess</span>
                      <ArrowUpRight className="h-3 w-3 text-copper" />
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-2 border-b border-line/30 pb-2">
                    <span className="text-text-3">X (Twitter):</span>
                    <a
                      href="https://x.com/w1tneess_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text hover:text-copper transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <span>x.com/w1tneess_</span>
                      <ArrowUpRight className="h-3 w-3 text-copper" />
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-2 border-b border-line/30 pb-2">
                    <span className="text-text-3">Instagram:</span>
                    <a
                      href="https://www.instagram.com/adva1ta_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text hover:text-copper transition-colors inline-flex items-center gap-1 font-medium"
                    >
                      <span>instagram.com/adva1ta_</span>
                      <ArrowUpRight className="h-3 w-3 text-copper" />
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-2">
                    <span className="text-text-3">Email:</span>
                    <a
                      href="mailto:hi@advaitachandra.in"
                      className="text-text hover:text-copper transition-colors font-medium"
                    >
                      hi@advaitachandra.in
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </Reveal>

        {/* 2. Guiding Epistemic Principle */}
        {profile.epistemicNote && (
          <Reveal y={12}>
            <section className="border-l-2 border-copper bg-surface/50 p-6 sm:p-10">
              <div className="font-mono text-[11px] text-copper tracking-widest uppercase mb-3">
                GUIDING PRINCIPLE
              </div>
              <p className="font-display text-xl sm:text-2xl text-text font-light italic leading-relaxed">
                &ldquo;{profile.epistemicNote}&rdquo;
              </p>
            </section>
          </Reveal>
        )}

        {/* 3. Current Projects & Practical Applications */}
        {publicProjects?.length > 0 && (
          <section>
            <Reveal y={12}>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
                <div>
                  <span className="font-mono text-xs text-copper uppercase tracking-wider block">
                    PROJECTS &amp; SYSTEMS
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-text font-normal mt-1">
                    Current Projects
                  </h2>
                </div>
                <Link
                  to="/projects"
                  className="font-mono text-xs text-copper hover:underline transition-colors flex items-center gap-1"
                >
                  <span>All Projects ({publicProjects.length})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {publicProjects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-line bg-surface p-6 sm:p-7 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[11px] text-copper uppercase tracking-wider">
                          {project.categories?.join(' // ') || 'Project'}
                        </span>
                        <span className="font-mono text-[10px] text-text-3 border border-line px-2 py-0.5 uppercase">
                          {project.status}
                        </span>
                      </div>
                      <h3 className="font-display text-xl text-text font-normal mb-2.5">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-text-2 font-light leading-relaxed mb-6 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-mono">
                      <span className="text-text-3 truncate max-w-[220px]">
                        {project.tools?.join(', ')}
                      </span>
                      <Link
                        to="/projects"
                        className="text-copper hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <span>View project</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* 4. Technical Toolkit & Skills */}
        {settings?.showSkills && skillGroups?.length > 0 && (
          <section>
            <Reveal y={12}>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
                <div>
                  <span className="font-mono text-xs text-copper uppercase tracking-wider block">
                    SKILLS &amp; TOOLS
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-text font-normal mt-1">
                    Technologies &amp; Developer Toolkit
                  </h2>
                </div>
                <span className="hidden sm:inline-block font-mono text-[11px] text-text-3">
                  ACCURATE, EVIDENCE-BASED RATINGS
                </span>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {skillGroups.map((group) => (
                  <div key={group.name} className="border border-line bg-surface p-6 sm:p-8">
                    <h3 className="font-mono text-xs font-semibold tracking-wider text-copper uppercase mb-5 pb-3 border-b border-line">
                      {group.name}
                    </h3>
                    <ul className="space-y-4">
                      {group.items?.map((skill) => {
                        const project = evidenceFor(skill.evidence)
                        return (
                          <li
                            key={skill.id}
                            className="flex items-start justify-between gap-3 border-b border-line/30 pb-3 last:border-b-0 last:pb-0"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium text-text">{skill.name}</span>
                                <StatusBadge kind="skill" value={skill.level} />
                              </div>
                              {skill.note && (
                                <p className="mt-1 text-xs leading-relaxed text-text-2 font-light">{skill.note}</p>
                              )}
                              {project && (
                                <Link
                                  to={`/projects`}
                                  className="mt-1.5 inline-block font-mono text-[11px] text-copper hover:underline transition-colors"
                                >
                                  Related Project: {project.title} &rarr;
                                </Link>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* 5. Areas of Study / Education & Learning Interests */}
        <section>
          <Reveal y={12}>
            <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
              <div>
                <span className="font-mono text-xs text-copper uppercase tracking-wider block">
                  AREAS OF STUDY
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-text font-normal mt-1">
                  Education &amp; Learning Interests
                </h2>
              </div>
              <span className="font-mono text-xs text-text-3">
                {interests?.length} TOPICS
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {interests?.map((interest, idx) => (
                <InterestCard key={interest.id || idx} interest={interest} index={idx} />
              ))}
            </div>
          </Reveal>
        </section>

        {/* 6. Timeline / Learning Milestones */}
        {settings?.showTimeline && timeline?.length > 0 && (
          <section>
            <Reveal y={12}>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
                <div>
                  <span className="font-mono text-xs text-copper uppercase tracking-wider block">
                    TIMELINE
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-text font-normal mt-1">
                    Learning Milestones
                  </h2>
                </div>
              </div>

              <div className="border-l border-line pl-6 sm:pl-8 space-y-10">
                {timeline.map((item) => (
                  <div key={item.id} className="relative">
                    <span
                      className="absolute -left-[calc(1.5rem+4.5px)] sm:-left-[calc(2rem+4.5px)] top-1.5 h-2 w-2 rounded-full bg-copper"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-[11px] text-copper uppercase tracking-widest block mb-1">
                      {item.period}
                    </span>
                    <h3 className="font-display text-lg sm:text-xl text-text font-normal">
                      {item.title}
                    </h3>
                    {item.detail && (
                      <p className="mt-2 text-sm text-text-2 font-light leading-relaxed max-w-2xl">
                        {item.detail}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* 7. Limitations & Transparency Notice */}
        <section>
          <Reveal y={12}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border border-line bg-surface p-6 sm:p-8">
                <div className="font-mono text-[11px] text-copper tracking-widest uppercase mb-3">
                  HOW TO READ THIS SITE
                </div>
                <h3 className="font-display text-xl text-text font-normal mb-4">
                  Honesty &amp; Limitations
                </h3>
                <ul className="space-y-3 font-mono text-xs text-text-2">
                  <li className="flex items-start gap-2.5">
                    <span className="text-copper">01/</span>
                    <span>Independent student work: These notes reflect my ongoing learning and are not formal academic publications.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-copper">02/</span>
                    <span>Preserving disagreements: When primary sources conflict, differing accounts are recorded side by side rather than forced into a single claim.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-copper">03/</span>
                    <span>Open to feedback: Code, datasets, and essays are shared openly so others can spot mistakes and suggest improvements.</span>
                  </li>
                </ul>
              </div>

              <div className="border border-line bg-surface p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-[11px] text-copper tracking-widest uppercase mb-3">
                    FEEDBACK &amp; DIALOGUE
                  </div>
                  <h3 className="font-display text-xl text-text font-normal mb-4">
                    Get in Touch
                  </h3>
                  <p className="text-sm text-text-2 font-light leading-relaxed">
                    If you notice a factual error, a missing citation, or an incomplete dataset, please send a note. Constructive corrections and thoughtful conversations are always welcome.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-line flex items-center gap-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 border border-copper bg-copper px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-canvas font-medium hover:bg-copper-strong transition-colors"
                  >
                    <span>Send Message</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 border border-line px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-text-2 hover:border-copper hover:text-copper transition-colors"
                  >
                    <span>View Projects</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  )
}
