import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
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
          "Advaita Chandra is a student from West Bengal, India. This is his personal website for projects, reading notes, and learning logs."
        }
      >
        <div className="flex flex-wrap items-center gap-3 font-utility text-muted">
          <span className="text-ink">Role:</span>
          {profile.roles?.map((role) => (
            <span
              key={role}
              className="px-2 py-0.5 bg-surface text-ink"
            >
              {role}
            </span>
          )) || (
            <span className="px-2 py-0.5 bg-surface text-ink">
              Student
            </span>
          )}
          <span className="text-line">|</span>
          <span className="text-ink">
            Location: {profile.location ? profile.location : 'West Bengal, India'}
          </span>
        </div>
      </PageHeader>

      <div className="shell pb-[clamp(2.5rem,5vw,4.5rem)] space-y-[clamp(2.5rem,5vw,4.5rem)]">
        <section className="border-t border-line pt-[clamp(1.5rem,3vw,2.5rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[clamp(1.5rem,3vw,2.5rem)] items-start">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-normal text-ink leading-snug text-balance">
                This is the official website of Advaita Chandra.
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-muted leading-relaxed max-w-prose font-sans">
                <p>
                  I'm Advaita Chandra, a student based in West Bengal, India. This site is where I keep the things I'm working on: projects, reading notes, photography, and questions I haven't fully worked out yet.
                </p>
                <p>
                  Most of what I read and think about falls under philosophy, history, and computer systems, with psychology, politics, public policy, and cybersecurity mixed in. Some of it turns into actual projects, like a worksheet generator I built for teachers, or a data visualization on terrorism in India. Most of it just stays as notes.
                </p>
                <p>
                  This isn't a professional publication or a portfolio built to impress anyone. It's closer to a public notebook. I'm not an expert in any of this. I'm just someone who reads a lot and likes building things, and this is where that ends up.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-line lg:border-t-0 lg:pt-0 lg:pl-8 lg:border-l space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-wider text-ink border-b border-line pb-3">
                Verified Profiles
              </h3>
              <ul className="space-y-3 font-mono text-xs tracking-wide">
                <li className="flex items-center justify-between gap-4 border-b border-line pb-3">
                  <span className="text-muted">Website:</span>
                  <a
                    href="https://advaitachandra.in/"
                    className="text-ink hover:text-accent transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    <span>advaitachandra.in</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
                <li className="flex items-center justify-between gap-4 border-b border-line pb-3">
                  <span className="text-muted">GitHub:</span>
                  <a
                    href="https://github.com/w1tneess"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-accent transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    <span>github.com/w1tneess</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
                <li className="flex items-center justify-between gap-4 border-b border-line pb-3">
                  <span className="text-muted">X (Twitter):</span>
                  <a
                    href="https://x.com/w1tneess_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-accent transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    <span>x.com/w1tneess_</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
                <li className="flex items-center justify-between gap-4 border-b border-line pb-3">
                  <span className="text-muted">Instagram:</span>
                  <a
                    href="https://www.instagram.com/adva1ta_/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-accent transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    <span>instagram.com/adva1ta_</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
                <li className="flex items-center justify-between gap-4 pt-1">
                  <span className="text-muted">Email:</span>
                  <a
                    href="mailto:hi@advaitachandra.in"
                    className="text-ink hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                  >
                    hi@advaitachandra.in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {profile.epistemicNote && (
          <section className="border-l-2 border-accent/60 pl-4 py-1.5">
            <div className="font-mono text-xs text-accent mb-2 tracking-wider uppercase">
              Guiding Principle
            </div>
            <p className="text-base sm:text-lg text-muted italic leading-relaxed max-w-3xl font-display text-balance">
              &ldquo;{profile.epistemicNote}&rdquo;
            </p>
          </section>
        )}

        {publicProjects?.length > 0 && (
          <section>
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <span className="font-mono text-xs text-muted block mb-1 tracking-wider uppercase">
                  Projects &amp; Systems
                </span>
                <h2 className="text-xl sm:text-2xl text-ink font-normal">
                  Current Projects
                </h2>
              </div>
              <Link
                to="/projects"
                className="font-mono text-xs text-ink hover:text-accent transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
              >
                <span>All Projects ({publicProjects.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-line border-t border-b border-line">
              {publicProjects.map((project) => (
                <div
                  key={project.id}
                  className="py-4 sm:py-5 grid gap-2 sm:gap-4 sm:grid-cols-[1fr_2.5fr] items-baseline group"
                >
                  <div className="font-mono text-xs tracking-wider uppercase text-muted">
                    {project.categories?.join(' / ') || 'Project'}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-normal text-ink mb-1.5 group-hover:text-accent transition-colors text-balance">
                      <Link to="/projects" className="inline-flex items-baseline gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                        <span>{project.title}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed mb-3">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between font-mono text-xs tracking-wide">
                      <span className="text-muted">
                        {project.tools?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {settings?.showSkills && skillGroups?.length > 0 && (
          <section className="pt-6 border-t border-line">
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-normal text-ink">
                Technologies &amp; Toolkit
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.name} className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-ink border-b border-line pb-2">
                    {group.name}
                  </h3>
                  <ul className="space-y-4">
                    {group.items?.map((skill) => {
                      const project = evidenceFor(skill.evidence)
                      return (
                        <li
                          key={skill.id}
                          className="flex items-start justify-between gap-4"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5 font-sans">
                              <span className="text-ink text-sm sm:text-base">{skill.name}</span>
                              <span className="text-[11px] font-mono text-muted px-1.5 py-0.5 border border-line rounded">
                                {skill.level}
                              </span>
                            </div>
                            {skill.note && (
                              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted">{skill.note}</p>
                            )}
                            {project && (
                              <Link
                                to={`/projects`}
                                className="mt-1.5 inline-flex items-center gap-1 font-mono text-xs text-ink hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                              >
                                <span>See in: {project.title}</span>
                                <ArrowUpRight className="h-3 w-3" />
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
          </section>
        )}

        <section className="pt-6 border-t border-line">
          <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-normal text-ink">
              Areas of Study
            </h2>
            <span className="font-mono text-xs tracking-wide text-muted">
              {interests?.length} Topics
            </span>
          </div>

          <div className="divide-y divide-line border-t border-b border-line">
            {interests?.map((interest, idx) => (
              <div key={interest.id || idx} className="py-4 sm:py-5 grid gap-2 sm:gap-4 sm:grid-cols-[1fr_2.5fr] items-baseline">
                <div className="font-mono text-xs tracking-wider uppercase text-muted">
                  {interest.category}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-normal text-ink mb-1.5 text-balance">
                    {interest.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {settings?.showTimeline && timeline?.length > 0 && (
          <section>
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <span className="font-mono text-xs text-muted block mb-1 tracking-wider uppercase">
                  Timeline
                </span>
                <h2 className="text-xl sm:text-2xl font-normal text-ink">
                  Learning Milestones
                </h2>
              </div>
            </div>

            <div className="border-l border-line pl-6 sm:pl-8 space-y-8 ml-3">
              {timeline.map((item) => (
                <div key={item.id} className="relative">
                  <span
                    className="absolute -left-[calc(1.5rem+4.5px)] sm:-left-[calc(2rem+4.5px)] top-1.5 h-2 w-2 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs text-muted block mb-1">
                    {item.period}
                  </span>
                  <h3 className="text-base sm:text-lg font-normal text-ink mb-1.5">
                    {item.title}
                  </h3>
                  {item.detail && (
                    <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl">
                      {item.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            <div className="pt-4 border-t border-line">
              <div className="font-mono text-xs text-muted mb-2 tracking-wider uppercase">
                How to Read This Site
              </div>
              <h3 className="text-lg sm:text-xl font-normal text-ink mb-3">
                Honesty &amp; Limitations
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-muted leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-accent">1.</span>
                  <span>Independent student work: These notes reflect my ongoing learning and are not formal academic publications.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-accent">2.</span>
                  <span>Preserving disagreements: When primary sources conflict, differing accounts are recorded side by side rather than forced into a single claim.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-accent">3.</span>
                  <span>Open to feedback: Code, datasets, and essays are shared openly so others can spot mistakes and suggest improvements.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-line lg:border-t-0 lg:border-l lg:pl-8 flex flex-col justify-between">
              <div>
                <div className="font-mono text-xs text-muted mb-2 tracking-wider uppercase">
                  Feedback &amp; Dialogue
                </div>
                <h3 className="text-lg sm:text-xl font-normal text-ink mb-3">
                  Get in Touch
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  If you notice a factual error, a missing citation, or an incomplete dataset, please send a note. Constructive corrections and thoughtful conversations are always welcome.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 border border-line bg-surface text-ink px-4 sm:px-5 py-2 sm:py-2.5 font-mono text-xs hover:border-accent hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>Send Message</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 border border-line bg-surface text-muted px-4 sm:px-5 py-2 sm:py-2.5 font-mono text-xs hover:border-line-strong hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span>View Projects</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
