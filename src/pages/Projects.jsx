import { motion } from 'framer-motion'
import Container from '@/components/layout/Container.jsx'
import ProjectCard from '@/components/features/ProjectCard.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import {
  pageLoadVariant,
  staggerContainer,
  staggerItem,
  scrollViewport,
} from '@/lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'projects')

export default function Projects() {
  const { publicProjects } = useContent()

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/projects" />

      <Container>
        <motion.div
          className="py-14 sm:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <header className="max-w-2xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              Things I'm building — some finished, most still evolving.
            </p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
              I prefer showing the actual process over waiting until everything looks perfect.
              Some projects may change direction, some may remain unfinished, and that's part of
              building things.
            </p>
          </header>

          <motion.ul
            className="mt-12 space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={scrollViewport}
          >
            {publicProjects.map((project) => (
              <motion.li key={project.id} variants={staggerItem}>
                <ProjectCard project={project} headingLevel={2} />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>
    </>
  )
}
