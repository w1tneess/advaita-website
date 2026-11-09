import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { CONTACT_EMAIL } from '@/config/site.js'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { INKS } from '@/components/features/ink/InkLens.jsx'
import PenStroke from '@/components/features/ink/PenStroke.jsx'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'about')

const INK_MEANING = {
  fact: 'Something a source says, with the source next to it.',
  analysis: 'What I conclude from the sources. It can be wrong even when they are right.',
  opinion: 'What I think or prefer. Read it as one person’s view.',
  limitation: 'A gap: missing data, conflicting accounts, or a question I have not answered.',
}

function Section({ title, note, children, id }) {
  return (
    <section id={id} className="folio gap-y-8 border-t border-line py-20 lg:py-28" aria-labelledby={`${id}-h`}>
      <div className="folio-margin" data-reveal>
        <h2 id={`${id}-h`} className="text-[length:var(--text-2xl)] tracking-[-0.03em]">{title}</h2>
        <PenStroke seed={title.length} className="mt-1" />
        {note && <p className="mt-3 max-w-[16rem] text-[15px] leading-snug text-muted">{note}</p>}
      </div>
      <div className="folio-body" data-reveal style={{ '--i': 1 }}>{children}</div>
    </section>
  )
}

export default function About() {
  const { profile, settings, interests, skillGroups, timeline, publicProjects, publicSocialLinks } = useContent()
  const evidenceFor = (slug) => publicProjects?.find((p) => p.slug === slug || p.id === slug)
  const links = (publicSocialLinks || []).filter((l) => l.url && l.kind !== 'email')

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/about" />

      <PageHeader eyebrow="About" registry="Official website of Advaita Chandra" title="A student who reads a lot and builds things" />

      <div className="shell pb-24">
        <section className="folio gap-y-10 pb-20 lg:pb-28" aria-label="Introduction">
          <aside className="folio-margin text-[15px] text-muted">
            <p className="text-ink">{profile?.location || 'West Bengal, India'}</p>
            <ul className="mt-6 space-y-1">
              {links.map((l) => (
                <li key={l.id || l.label}>
                  <a href={l.url} target="_blank" rel="me noopener noreferrer" className="pen-link inline-block py-1 hover:text-ink">{l.label}</a>
                </li>
              ))}
              {CONTACT_EMAIL && (
                <li><a href={`mailto:${CONTACT_EMAIL}`} className="pen-link inline-block py-1 hover:text-ink">{CONTACT_EMAIL}</a></li>
              )}
            </ul>
          </aside>
          <div className="folio-body max-w-[46rem] space-y-6 text-[length:var(--text-xl)] leading-[1.4] tracking-[-0.015em]">
            <p>I’m Advaita Chandra, a student based in West Bengal, India. This site is where I keep the things I’m working on: projects, reading notes, photography, and questions I haven’t fully worked out yet.</p>
            <p className="text-muted">Most of what I read falls under philosophy, history and computer systems, with psychology, politics, public policy and cybersecurity mixed in. Some of it turns into projects, like the Osho documentary archive. Most of it stays as notes.</p>
            <p className="text-muted">This isn’t a professional publication. It’s closer to a public notebook. I’m not an expert in any of this; I read a lot and like building things, and this is where that ends up.</p>
          </div>
        </section>

        <Section id="inks" title="How to read this site" note="Four kinds of claim, each marked in its own ink">
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {INKS.map((ink) => (
              <li key={ink.key} data-ink={ink.key}>
                <p className="mark-label" data-ink={ink.key}>{ink.mark}</p>
                <p className="mt-3 text-[length:var(--text-lg)]"><span className="ink" data-ink={ink.key}>{ink.label}</span></p>
                <p className="mt-2 text-[16px] leading-relaxed text-muted">{INK_MEANING[ink.key]}</p>
              </li>
            ))}
          </ul>
          <ul className="mt-14 space-y-4 border-t border-line pt-8 text-[16px] leading-relaxed text-muted max-w-2xl">
            <li><span className="text-ink">Student work.</span> These notes are learning in progress, not academic publications.</li>
            <li><span className="text-ink">Disagreements stay visible.</span> When primary sources conflict, the accounts sit side by side instead of being forced into one claim.</li>
            <li><span className="text-ink">Open to correction.</span> Code, data and essays are public so mistakes can be found. <Link to="/contact" className="pen-link text-ink [background-size:100%_1px]">Send one</Link>.</li>
          </ul>
        </Section>

        {profile?.approach?.length > 0 && (
          <Section id="method" title="How I work">
            <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
              {profile.approach.map((step, i) => (
                <li key={step.title} className="border-t border-line pt-5">
                  <p className="text-[14px] text-text-3 tabular-nums">Step {i + 1}</p>
                  <h3 className="mt-2 text-[length:var(--text-lg)] tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.detail}</p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {interests?.length > 0 && (
          <Section id="topics" title="What I study">
            <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
              {interests.map((interest) => (
                <li key={interest.id || interest.name}>
                  <h3 className="text-[17px] text-ink">{interest.name || interest.title}</h3>
                  {(interest.note || interest.description) && (
                    <p className="mt-1 text-[15px] leading-relaxed text-muted">{interest.note || interest.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {settings?.showSkills && skillGroups?.length > 0 && (
          <Section id="skills" title="What I can do" note="With a project as evidence where there is one">
            <div className="grid gap-12 lg:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.name}>
                  <h3 className="text-[15px] text-muted">{group.name}</h3>
                  <ul className="mt-4 border-t border-line">
                    {group.items?.map((skill) => {
                      const project = evidenceFor(skill.evidence)
                      return (
                        <li key={skill.id} className="border-b border-line py-4">
                          <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                            <span className="text-[17px] text-ink">{skill.name}</span>
                            {skill.level && <span className="text-[14px] text-text-3">{skill.level.replace('-', ' ')}</span>}
                          </p>
                          {skill.note && <p className="mt-1 text-[15px] leading-relaxed text-muted">{skill.note}</p>}
                          {project && (
                            <Link to="/projects" className="group mt-2 inline-flex items-center gap-1 text-[14px] text-ink">
                              <span className="pen-link">See {project.title}</span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                            </Link>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {settings?.showTimeline && timeline?.length > 0 && (
          <Section id="timeline" title="Along the way">
            <ol className="border-t border-line">
              {timeline.map((item) => (
                <li key={item.id} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8">
                  <p className="text-[15px] text-muted tabular-nums">{item.period}</p>
                  <div>
                    <h3 className="text-[length:var(--text-lg)] tracking-[-0.02em]">{item.title}</h3>
                    {item.detail && <p className="mt-2 text-[15px] leading-relaxed text-muted max-w-2xl">{item.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}
      </div>
    </>
  )
}
