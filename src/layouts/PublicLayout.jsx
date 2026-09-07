import { useEffect, Suspense } from 'react'
import { Eye } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router'
import { motion } from 'framer-motion'

import Container from '../components/layout/Container.jsx'
import Footer from '../components/layout/Footer.jsx'
import Header from '../components/layout/Header.jsx'
import SkipLink from '../components/layout/SkipLink.jsx'
import BackToTopButton from '../components/ui/BackToTopButton.jsx'
import CookieBanner from '../components/ui/CookieBanner.jsx'
import ShortcutsModal from '../components/ui/ShortcutsModal.jsx'
import PageFallback from '../components/ui/PageFallback.jsx'
import { useShortcuts } from '../hooks/useShortcuts.js'
import { useContent } from '../lib/content.jsx'
import { useSmoothScroll } from '../lib/smooth-scroll.js'
import { preloadRoute } from '../lib/preload.js'

/**
 * Shell for every public page.
 *
 * `#main-content` is the target of both the skip link and the route-change focus move in
 * ScrollToTop, so the id and tabIndex here are load-bearing — do not rename them.
 */
export default function PublicLayout() {
  const { previewDrafts, setPreviewDrafts } = useContent()
  const location = useLocation()
  const { isOpen: shortcutsOpen, close: closeShortcuts } = useShortcuts()

  // Initialize smooth scrolling
  useSmoothScroll()

  // Eagerly preload public route bundles in browser idle time so first clicks are 100% instant
  useEffect(() => {
    if (typeof window === 'undefined') return
    const preloadAll = () => {
      preloadRoute('/philosophy')
      preloadRoute('/about')
      preloadRoute('/projects')
      preloadRoute('/blog')
      preloadRoute('/photography')
      preloadRoute('/contact')
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preloadAll, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    } else {
      const timer = setTimeout(preloadAll, 400)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <SkipLink />

      {/* Only ever visible after the admin turns preview on, so the public site is never
          silently showing unpublished work without saying so. */}
      {previewDrafts && (
        <div className="border-b border-line bg-opinion/12 text-ink">
          <Container>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2 text-sm">
              <Eye className="h-4 w-4 text-opinion" aria-hidden="true" />
              <span>
                <strong className="font-semibold">Preview mode.</strong> Drafts and hidden items are
                visible. This affects your browser only.
              </span>
              <button
                type="button"
                onClick={() => setPreviewDrafts(false)}
                className="font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
              >
                Turn off
              </button>
              <Link
                to="/admin"
                className="text-muted underline underline-offset-4 hover:text-accent"
              >
                Back to admin
              </Link>
            </div>
          </Container>
        </div>
      )}

      <Header />

      <motion.main
        key={location.pathname}
        id="main-content"
        tabIndex={-1}
        className="flex-1 focus:outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </motion.main>

      <Footer />

      {/* Global Interactive Aids */}
      <BackToTopButton />
      <ShortcutsModal isOpen={shortcutsOpen} onClose={closeShortcuts} />
      <CookieBanner />
    </div>
  )
}
