import { motion } from 'framer-motion'
import Container from '@/components/layout/Container.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import ProjectCard from '@/components/features/ProjectCard.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { pageLoadVariant, staggerContainer, staggerItem, scrollViewport } from '@/lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'projects')

export default function Projects() {
  const { publicProjects } = useContent()

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

          {publicProjects.length === 0 ? (
            <div className="mt-12 py-8 border-t border-line">
              <EmptyState
                title="No projects yet"
                message="Projects will appear here once published."
              />
            </div>
          ) : (
            <motion.ul
              className="mt-12 space-y-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
            >
              {publicProjects.map((project) => (
                <motion.li
                  key={project.id}
                  id={`project-${project.slug}`}
                  className="scroll-mt-24"
                  variants={staggerItem}
                >
                  <ProjectCard project={project} headingLevel={2} />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </Container>
    </>
  )
}
