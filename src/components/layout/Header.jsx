import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Container from '@/components/layout/Container.jsx'
import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'

/**
 * Site header with high-end editorial mobile menu.
 */
export default function Header() {
  const { profile, social } = useContent()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleRef = useRef(null)

  // On the homepage, the header floats transparently only at the top of the hero.
  const isHome = pathname === '/' || pathname === ''
  const isTransparent = isHome && !scrolled && !menuOpen

  // Track page scroll to toggle header background and prevent content overlap
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Escape closes the menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isTransparent
            ? 'bg-transparent border-b border-transparent shadow-none'
            : 'border-b border-line/60 bg-canvas/85 shadow-[0_1px_0_rgb(255_255_255/0.35)] dark:shadow-none backdrop-blur-xl'
        }`}
      >
        <Container width="wide" className="lg:px-12 xl:px-16">
          <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="group shrink-0 py-2 font-display text-lg font-semibold tracking-tight transition-colors hover:text-accent"
              >
                {profile.name}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav aria-label="Main" className="hidden min-w-0 lg:block">
              <ul className="flex items-center gap-5 lg:gap-7">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={({ isActive }) =>
                        `nav-link rounded-md px-1 py-1 text-sm font-semibold transition-colors ${
                          isActive ? 'text-ink' : 'text-muted hover:text-ink'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Header Right Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Menu Trigger Button */}
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label="Open menu"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-line/70 bg-surface/70 px-3.5 text-xs font-semibold tracking-wider text-ink shadow-sm backdrop-blur-md transition-all hover:border-line hover:bg-surface active:scale-95 lg:hidden"
              >
                <Menu className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="uppercase">Menu</span>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Fullscreen Editorial Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-canvas/98 px-6 py-5 backdrop-blur-2xl sm:px-10 dark:bg-canvas/98 lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Row: Logo & Close Button */}
            <div className="flex h-12 items-center justify-between border-b border-line/40 pb-4">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className="font-display text-lg font-semibold tracking-tight text-ink"
              >
                {profile.name}
              </Link>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-line/70 bg-surface/80 px-3.5 text-xs font-semibold tracking-wider text-ink shadow-sm backdrop-blur-md transition-all hover:bg-surface active:scale-95"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="uppercase">Close</span>
                </button>
              </div>
            </div>

            {/* Middle Nav Items */}
            <nav aria-label="Mobile Navigation" className="my-auto py-6">
              <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.04 * (index + 1),
                      duration: 0.3,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-xl px-3 py-3 transition-colors ${
                          isActive
                            ? 'bg-surface/80 text-ink font-bold shadow-sm'
                            : 'text-muted hover:bg-surface/40 hover:text-ink font-medium'
                        }`
                      }
                    >
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs opacity-50">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-2xl tracking-tight sm:text-3xl">
                          {item.label}
                        </span>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 opacity-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Bottom Footer Section */}
            <motion.div
              className="border-t border-line/40 pt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.3 }}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <ul className="flex flex-wrap items-center gap-4 text-xs font-semibold tracking-wider text-muted uppercase">
                  {social
                    ?.filter((s) => s.visible && s.kind === 'link')
                    .slice(0, 3)
                    .map((s) => (
                      <li key={s.id}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-ink"
                        >
                          {s.platform}
                        </a>
                      </li>
                    ))}
                </ul>
                <span className="text-xs text-muted/80">{profile.location || 'India'}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
