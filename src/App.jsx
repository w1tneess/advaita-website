import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ScrollToTop from './components/ScrollToTop.jsx'
import ToastViewport from './components/ToastViewport.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import About from './pages/About.jsx'
import Article from './pages/Article.jsx'
import Blog from './pages/Blog.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import NotFound from './pages/NotFound.jsx'
import Portfolio from './pages/Portfolio.jsx'

/**
 * Route table.
 *
 * Public pages are imported eagerly: the whole site is small, and a suspense flash on
 * every navigation costs more than the bytes it saves. The admin panel is lazy — no
 * visitor should download an editor they will never open.
 *
 * `basename` comes from Vite's BASE_URL so the same build works at the domain root and
 * at /repository-name/ on GitHub Pages. See vite.config.js.
 */

const AdminApp = lazy(() => import('./pages/admin/AdminApp.jsx'))

function AdminFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6 text-ink">
      <p className="text-sm text-muted" role="status">
        Loading the admin panel…
      </p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />

      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Article />} />
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

      <ToastViewport />
    </BrowserRouter>
  )
}
