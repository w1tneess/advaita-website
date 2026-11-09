import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import PageHeader from '@/components/ui/PageHeader.jsx'
import { ProjectCard, ProjectFilter } from '@/components/features/projects'
import { useContent } from '@/lib/content.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { matchesQuery } from '@/lib/format'
import { projectCollection } from '@/lib/seo.js'

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
      <Seo
        title={ROUTE.title}
        description={ROUTE.description}
        path="/projects"
        collection={projectCollection(publicProjects)}
      />

      <PageHeader
        eyebrow="Projects"
        title="Things I built to find something out"
        lead="Web tools and research projects. Each one says what question it answers, how it works, and where it falls short."
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

      <section className="shell pb-24 lg:pb-32" aria-label="Project list">
        {filteredProjects.length === 0 ? (
          <p className="border-t border-line py-16 text-center text-[15px] text-muted">No project matches that search.</p>
        ) : (
          <div className="border-t border-line">
            {filteredProjects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} />
            ))}
          </div>
        )}

        <div className="folio mt-20">
          <p className="folio-margin text-[15px] text-muted">Also</p>
          <Link to="/art" className="folio-body group flex items-baseline justify-between gap-6 border-y border-line py-8">
            <span>
              <span className="block text-[length:var(--text-2xl)] tracking-[-0.03em] transition-transform duration-300 ease-[var(--ease-soft)] group-hover:translate-x-2">Algorithmic art</span>
              <span className="mt-2 block text-[15px] text-muted">Flow fields, attractors and seeded geometry you can play with in the browser</span>
            </span>
            <span className="pen-link shrink-0 text-[15px] text-ink">Open the canvas</span>
          </Link>
        </div>
      </section>
    </>
  )
}
