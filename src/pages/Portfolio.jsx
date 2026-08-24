import { FolderOpen } from 'lucide-react'
import { useMemo } from 'react'

import Button from '../components/Button.jsx'
import Container from '../components/Container.jsx'
import EmptyState from '../components/EmptyState.jsx'
import FilterBar from '../components/FilterBar.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import Seo from '../components/Seo.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../lib/routes.js'
import { pluralize } from '../lib/format.js'
import { useFilters } from '../hooks/useFilters.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'portfolio')

/* Module scope, not inline: useFilters keeps a reference to this object. */
const INITIAL_FILTERS = { category: 'all' }

export default function Portfolio() {
  const { publicProjects, projectCategories } = useContent()
  const { values, setValue, reset, hasActiveFilters } = useFilters(INITIAL_FILTERS)

  const counts = useMemo(() => {
    const result = { all: publicProjects.length }
    for (const category of projectCategories) {
      result[category.slug] = publicProjects.filter((project) =>
        (project.categories || []).includes(category.slug),
      ).length
    }
    return result
  }, [publicProjects, projectCategories])

  const visible = useMemo(
    () =>
      values.category === 'all'
        ? publicProjects
        : publicProjects.filter((project) =>
            (project.categories || []).includes(values.category),
          ),
    [publicProjects, values.category],
  )

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/portfolio" />

      <Container>
        <div className="py-14 sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Portfolio</h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">
            Three projects. Each entry states its role, tools, method and current status, and
            ends with what it does not show — including the one that is a design rather than a
            working product.
          </p>

          <FilterBar
            label="Filter by category"
            className="mt-10"
            options={projectCategories.map((category) => ({
              value: category.slug,
              label: category.name,
            }))}
            value={values.category}
            onChange={(value) => setValue('category', value)}
            counts={counts}
          />

          <p className="mt-6 text-sm text-muted" role="status">
            Showing {visible.length} {pluralize(visible.length, 'project')}
            {values.category !== 'all' && ` of ${publicProjects.length}`}.
          </p>

          {visible.length > 0 ? (
            <ul className="mt-8 space-y-8">
              {visible.map((project) => (
                /* The id is the anchor target used by the evidence links on the About page. */
                <li key={project.id} id={`project-${project.slug}`} className="scroll-mt-24">
                  <ProjectCard project={project} variant="full" headingLevel={2} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              className="mt-8"
              icon={FolderOpen}
              title="No projects in this category"
              message="Nothing here yet. Try another category, or clear the filter to see everything."
              action={
                hasActiveFilters ? (
                  <Button variant="secondary" size="sm" onClick={reset}>
                    Clear filter
                  </Button>
                ) : null
              }
            />
          )}
        </div>
      </Container>
    </>
  )
}
