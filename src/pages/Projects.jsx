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
import { useFilters } from '@/hooks/useFilters.js'
import { pageLoadVariant, staggerContainer, staggerItem, scrollViewport } from '@/lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'projects')

const INITIAL_FILTERS = { category: [] }

export default function Projects() {
  const { publicProjects, projectCategories } = useContent()
  const { values, setValue, toggleValue, reset, hasActiveFilters } = useFilters(INITIAL_FILTERS)

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
      values.category.length === 0
        ? publicProjects
        : publicProjects.filter((project) =>
            values.category.some((c) => (project.categories || []).includes(c)),
          ),
    [publicProjects, values.category],
  )

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/projects" />

      <Container>
        <motion.div
          className="py-12 sm:py-16 md:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          {/* Header section with baseline-aligned filters */}
          <div className="border-b border-line/40 pb-8 sm:pb-10">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent uppercase mb-3">
              <span>⟐</span>
              <span>PORTFOLIO & APPLIED RESEARCH</span>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-ink">
                  Projects
                </h1>
                <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">
                  Applied work and systems across philosophy, machine intelligence, and Indian governance.
                </p>
              </div>

              {publicProjects.length > 0 && (
                <div className="sm:self-start sm:pt-1">
                  <FilterBar
                    label="Filter by category"
                    options={(projectCategories || []).map((category) => ({
                      value: category.slug,
                      label: category.name,
                    }))}
                    value={values.category}
                    onChange={(value) => {
                      if (value === 'all') {
                        setValue('category', [])
                      } else {
                        toggleValue('category', value)
                      }
                    }}
                    counts={counts}
                  />
                </div>
              )}
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="py-12">
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
              className="mt-8 sm:mt-10 space-y-8"
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
