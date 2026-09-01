import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'

import ScrollToTop from './components/ui/ScrollToTop.jsx'
import ToastViewport from './components/ui/ToastViewport.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Philosophy = lazy(() => import('./pages/Philosophy.jsx'))
const Photography = lazy(() => import('./pages/Photography.jsx'))
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))
const Blog = lazy(() => import('./pages/Blog.jsx'))
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'))

/**
 * Route table.
 *
 * Public pages are lazy-loaded to reduce initial bundle size as requested by the user.
 * The admin panel is lazy — no visitor should download an editor they will never open.
 *
 * `basename` comes from Vite's BASE_URL so the same build works at the domain root and
 * at /repository-name/ on GitHub Pages. See vite.config.js.
 */

const AdminApp = lazy(() => import('./pages/admin/AdminApp.jsx'))

function PageFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[50vh] items-center justify-center px-6 text-ink"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" role="status" aria-label="Loading" />
    </motion.div>
  )
}

function AdminFallback() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-dvh items-center justify-center bg-canvas px-6 text-ink"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" role="status" aria-label="Loading admin" />
        <p className="text-sm text-muted">Loading the admin panel…</p>
      </div>
    </motion.div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />

      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="philosophy" element={<Philosophy />} />
            <Route path="photography" element={<Photography />} />
            <Route path="projects" element={<Projects />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

        <Route
          path="admin/*"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
      </Suspense>

      <ToastViewport />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
