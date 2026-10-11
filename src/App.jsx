import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { MotionConfig } from 'framer-motion'

import ScrollToTop from './components/ui/ScrollToTop.jsx'
import ToastViewport from './components/ui/ToastViewport.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
/**
 * Auto-retries dynamic imports when a new deployment invalidates old chunk hashes.
 * If fetching a chunk fails (e.g. after a redeploy), performs a single hard refresh
 * to retrieve the latest application bundle.
 */
function lazyWithRetry(componentImport) {
  return lazy(async () => {
    try {
      const module = await componentImport()
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('advaita_chunk_retry')
      }
      return module
    } catch (error) {
      if (typeof window !== 'undefined') {
        const hasRefreshed = window.sessionStorage.getItem('advaita_chunk_retry') === 'true'
        if (!hasRefreshed) {
          window.sessionStorage.setItem('advaita_chunk_retry', 'true')
          window.location.reload()
          return new Promise(() => {})
        }
      }
      throw error
    }
  })
}

import Home from './pages/Home.jsx'
const About = lazyWithRetry(() => import('./pages/About.jsx'))
const Contact = lazyWithRetry(() => import('./pages/Contact.jsx'))
const NotFound = lazyWithRetry(() => import('./pages/NotFound.jsx'))
const Philosophy = lazyWithRetry(() => import('./pages/Philosophy.jsx'))
const Photography = lazyWithRetry(() => import('./pages/Photography.jsx'))
const Projects = lazyWithRetry(() => import('./pages/Projects.jsx'))
const Blog = lazyWithRetry(() => import('./pages/Blog.jsx'))
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost.jsx'))
const NotePost = lazyWithRetry(() => import('./pages/NotePost.jsx'))
const AlgorithmicArt = lazyWithRetry(() => import('./pages/AlgorithmicArt.jsx'))
const Privacy = lazyWithRetry(() => import('./pages/Privacy.jsx'))
const Terms = lazyWithRetry(() => import('./pages/Terms.jsx'))

/**
 * Route table.
 *
 * Public secondary pages and the admin panel are lazy-loaded.
 * The Home route is imported eagerly so initial page load renders instantly without
 * a secondary network waterfall or blank Suspense fallback.
 *
 * `basename` comes from Vite's BASE_URL so the build works cleanly at the domain root.
 * See vite.config.js.
 */

const AdminApp = lazyWithRetry(() => import('./pages/admin/AdminApp.jsx'))

function AdminFallback() {
  return (
    <div
      className="flex min-h-dvh items-center justify-center bg-canvas px-6 text-ink"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" role="status" aria-label="Loading admin" />
        <p className="text-sm text-muted">Loading the admin panel…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />

        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="philosophy" element={<Philosophy />} />
            <Route path="philosophy/:slug" element={<NotePost />} />
            <Route path="photography" element={<Photography />} />
            <Route path="projects" element={<Projects />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="contact" element={<Contact />} />
            <Route path="art" element={<AlgorithmicArt />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
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

      <ToastViewport />
      </BrowserRouter>
      </MotionConfig>
    </ErrorBoundary>
  )
}
