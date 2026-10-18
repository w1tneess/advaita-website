import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
import { ProjectCard, ProjectFilter } from '@/components/features/projects'
import { useContent } from '@/lib/content.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { matchesQuery } from '@/lib/format'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'projects')

export default function Projects() {
  const { publicProjects = [] } = useContent()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    const cats = new Set()
    publicProjects.forEach((p) => {
      if (p.categories && Array.isArray(p.categories)) {
        p.categories.forEach((c) => cats.add(c))
      } else if (p.status) {
        cats.add(p.status)
      }
    })
    return ['All', ...Array.from(cats)]
  }, [publicProjects])

  const filteredProjects = useMemo(() => {
    return publicProjects.filter((p) => {
      // Category match
      const matchesCategory =
        activeCategory === 'All' ||
        p.categories?.includes(activeCategory) ||
        p.status === activeCategory

      if (!matchesCategory) return false

      // Query match
      if (!searchQuery.trim()) return true

      return matchesQuery(p, searchQuery, [
        'title',
        'summary',
        'description',
        'tools',
        'status',
        'categories',
      ])
    })
  }, [publicProjects, activeCategory, searchQuery])

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/projects" />

      <PageHeader
        eyebrow="Projects"
        title="Projects &amp; Studies"
        lead="Data projects, tools, and research notes. Each project explains the question behind it, the sources used, and what I learned."
      >
        <ProjectFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={publicProjects.length}
          filteredCount={filteredProjects.length}
        />
      </PageHeader>

      <section className="shell py-[var(--spacing-fluid-section)] pb-24">
        {/* Interactive Algorithmic Computing Showcase Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl border border-line/60 bg-surface/30 hover:bg-surface/60 hover:-translate-y-1 hover:border-line-strong hover:shadow-subtle active:scale-[0.98] transition-all duration-250 ease-[var(--ease-out-quart)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-md group">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse" />
              <span>Creative Computing // Procedural Sandbox</span>
            </div>
            <h2 className="font-sans text-base sm:text-lg font-medium text-ink group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)]">
              Algorithmic Art &amp; Vector Flow Fields
            </h2>
            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed max-w-xl">
              Interactive GPU-accelerated mathematical vector simulations, chaotic orbital
              attractors, and seeded generative geometry.
            </p>
          </div>
          <Link
            to="/art"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-canvas font-mono text-xs uppercase tracking-wider font-semibold hover:bg-white/20 hover:text-ink active:scale-[0.97] active:opacity-80 transition-all duration-250 ease-[var(--ease-out-quart)] shadow-subtle shrink-0"
          >
            <span>Launch Canvas &rarr;</span>
          </Link>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-surface p-[clamp(1.5rem,3vw,2.5rem)] text-center text-sm font-utility text-muted border border-line rounded-xl">
            No projects found matching the current search criteria.
          </div>
        ) : (
          <div className="grid gap-[clamp(1rem,2.5vw,2rem)] sm:grid-cols-2">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
