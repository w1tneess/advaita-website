import { FolderOpen } from 'lucide-react'
import { useMemo } from 'react'
import { motion } from 'framer-motion'

import Button from '@/components/ui/Button.jsx'
import Container from '@/components/layout/Container.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import FilterBar from '@/components/FilterBar.jsx'
import ProjectCard from '@/components/features/ProjectCard.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { pluralize } from '@/lib/format.js'
import { useFilters } from '@/hooks/useFilters.js'
import { pageLoadVariant, staggerContainer, staggerItem, scrollViewport } from '@/lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'projects')

const INITIAL_FILTERS = { category: 'all' }

export default function Projects() {
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
        : publicProjects.filter((project) => (project.categories || []).includes(values.category)),
    [publicProjects, values.category],
  )

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/projects" />

      <Container>
        <motion.div
          className="py-16 sm:py-20 md:py-36"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <header className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Projects
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Projects and source code across research, data, and software design.
            </p>
          </header>

          {publicProjects.length > 0 && (
            <FilterBar
              label="Filter by category"
              className="mt-10"
              options={(projectCategories || []).map((category) => ({
                value: category.slug,
                label: category.name,
              }))}
              value={values.category}
              onChange={(value) => setValue('category', value)}
              counts={counts}
            />
          )}

          {publicProjects.length > 0 && (
            <p className="mt-6 text-sm text-muted" role="status">
              Showing {visible.length} {pluralize(visible.length, 'project')}
              {values.category !== 'all' && ` of ${publicProjects.length}`}.
            </p>
          )}

          {visible.length === 0 ? (
            <div className="mt-12 py-8 border-t border-line">
              <EmptyState
                icon={FolderOpen}
                title={publicProjects.length === 0 ? "No projects yet" : "No projects in this category"}
                message={publicProjects.length === 0 ? "Projects will appear here once published." : "Nothing here yet. Try another category, or clear the filter to see everything."}
                action={
                  hasActiveFilters ? (
                    <Button variant="secondary" size="sm" onClick={reset}>
                      Clear filter
                    </Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <motion.ul
              className="mt-12 space-y-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
            >
              {visible.map((project, index) => (
                <motion.li
                  key={project.id}
                  id={`project-${project.slug}`}
                  className="scroll-mt-24"
                  variants={staggerItem}
                >
                  <ProjectCard project={project} variant="full" headingLevel={2} index={index} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </Container>
    </>
  )
}
