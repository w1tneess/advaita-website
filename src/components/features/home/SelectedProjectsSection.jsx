import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { isSafeUrl } from '@/lib/url.ts'

export default function SelectedProjectsSection({ featuredProjects = [] }) {
  return (
    <section className="shell pt-[var(--spacing-fluid-section)] border-t border-line" id="projects">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
        <h2 className="text-2xl sm:text-3xl font-normal text-ink text-balance">
          Currently building
        </h2>
        <Link
          to="/projects"
          className="font-mono text-xs tracking-wide text-ink border-b border-line hover:text-muted hover:border-muted active:opacity-80 transition-all duration-150 ease-[var(--ease-out-quart)] pb-1"
        >
          View all projects &rarr;
        </Link>
      </div>

      <div className="divide-y divide-line border-t border-b border-line">
        {featuredProjects.map((project) => {
          const category = project.categories?.[0] || project.status || 'Project'
          const rawLink = project.links?.live || project.links?.repository
          const link = isSafeUrl(rawLink) ? rawLink : null

          return (
            <article
              key={project.id}
              className="group py-6 sm:py-8 grid gap-4 sm:grid-cols-[1fr_2fr] items-baseline transition-all duration-250 ease-[var(--ease-out-quart)] hover:bg-surface/50 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl hover:-translate-y-0.5 hover:shadow-subtle active:scale-[0.98]"
            >
              <div className="space-y-2">
                <div className="font-mono text-xs tracking-widest uppercase text-muted font-medium">
                  {category}
                </div>
                {project.tools && project.tools.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="code-badge border-line group-hover:border-line-strong transition-colors duration-150"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-normal text-ink group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)] leading-snug mb-2">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-2 outline-none"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity duration-150 text-muted" />
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-2xl">
                  {project.summary || project.description}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
