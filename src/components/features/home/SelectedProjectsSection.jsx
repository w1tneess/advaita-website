import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { isSafeUrl } from '@/lib/url.ts'

/**
 * Featured projects as asymmetric pairs: what the project is on the left, and on the right
 * what it does not do, written in the graphite "unknown" ink the projects already record.
 */
export default function SelectedProjectsSection({ featuredProjects = [] }) {
  if (!featuredProjects.length) return null

  return (
    <section className="shell py-24 lg:py-32 border-t border-line" id="projects" aria-labelledby="work-heading">
      <div className="folio mb-14 lg:mb-20">
        <div className="folio-margin">
          <h2 id="work-heading" className="text-[length:var(--text-2xl)] tracking-[-0.03em]">Projects</h2>
        </div>
        <div className="folio-body flex flex-wrap items-baseline justify-between gap-4">
          <p className="max-w-xl text-[length:var(--text-lg)] leading-snug text-muted">
            Each project lists what it can’t do next to what it can.
          </p>
          <Link to="/projects" className="pen-link text-[15px] text-ink">All projects</Link>
        </div>
      </div>

      <div className="space-y-20 lg:space-y-28">
        {featuredProjects.map((project) => {
          const rawLink = project.links?.live || project.links?.repository
          const link = isSafeUrl(rawLink) ? rawLink : null
          const limits = (project.limitations || []).slice(0, 2)

          return (
            <article key={project.id} className="folio gap-y-8">
              <div className="folio-margin text-[14px] text-muted">
                <p>{project.categories?.[0] ? project.categories[0][0].toUpperCase() + project.categories[0].slice(1) : 'Project'}</p>
                {project.tools?.length > 0 && <p className="mt-1">{project.tools.slice(0, 3).join(', ')}</p>}
              </div>

              <div className="lg:col-span-5 lg:col-start-4">
                <h3 className="text-[length:var(--text-3xl)] leading-[1.05] tracking-[-0.035em]">
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="group inline">
                      <span className="pen-link">{project.title}</span>
                      <ArrowUpRight className="ml-1 inline h-5 w-5 align-baseline text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p className="mt-5 text-[17px] leading-relaxed text-muted">{project.summary}</p>
              </div>

              {limits.length > 0 && (
                <aside className="lg:col-span-3 lg:col-start-10 lg:pt-2" aria-label={`Limits of ${project.title}`}>
                  <p className="mark-label" data-ink="limitation">limits</p>
                  <ul className="mt-3 space-y-3">
                    {limits.map((limit) => (
                      <li key={limit} data-ink="limitation" className="border-l border-dashed border-limitation/60 pl-3 text-[14px] leading-relaxed text-muted">
                        {limit}
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
