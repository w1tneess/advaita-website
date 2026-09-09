import { ArrowRight } from 'lucide-react'
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
        eyebrow="About Me"
        title="About Advaita Chandra"
        lead={profile.bio || "Student and independent learner based in India. I study philosophy, history, and computer systems, sharing my notes and projects as I learn."}
      >
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-3">
          <span className="text-copper">FOCUS //</span>
          {profile.roles?.map((role) => (
            <span key={role} className="border border-line bg-surface px-2.5 py-0.5 text-[11px] text-text-2">
              {role}
            </span>
          ))}
          <span className="text-line-strong">|</span>
          <span className="text-copper font-medium">LOCATION: INDIA</span>
        </div>
      </PageHeader>

      <div className="shell pb-24 md:pb-32 space-y-20 md:space-y-28">
        {/* 1. Epistemic Stance */}
        {profile.epistemicNote && (
          <Reveal y={12}>
            <section className="border-l-2 border-copper bg-surface/50 p-6 sm:p-10">
              <div className="font-mono text-[11px] text-copper tracking-widest uppercase mb-3">
                GUIDING PRINCIPLE
              </div>
              <p className="font-display text-xl sm:text-2xl text-text font-light italic leading-relaxed">
                "{profile.epistemicNote}"
              </p>
            </section>
          </Reveal>
        )}

        {/* 2. Research Interests */}
        <section>
          <Reveal y={12}>
            <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
              <div>
                <span className="font-mono text-xs text-copper uppercase tracking-wider block">
                  AREAS OF STUDY
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-text font-normal mt-1">
                  Topics I Explore
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

        {/* 3. Technical & Research Abilities */}
        {settings?.showSkills && skillGroups?.length > 0 && (
          <section>
            <Reveal y={12}>
              <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
                <div>
                  <span className="font-mono text-xs text-copper uppercase tracking-wider block">
                    SKILLS &amp; TOOLS
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl text-text font-normal mt-1">
                    Technical &amp; Research Background
                  </h2>
                </div>
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
                          <li key={skill.id} className="flex items-start justify-between gap-3 border-b border-line/30 pb-3 last:border-b-0 last:pb-0">
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

        {/* 4. Timeline / Learning Arc */}
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

        {/* 5. Limitations & Transparency Notice */}
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
