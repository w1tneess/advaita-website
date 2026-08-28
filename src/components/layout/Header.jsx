import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Container from '@/components/layout/Container.jsx'
import ThemeToggle from '@/components/meta/ThemeToggle.jsx'
import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { mobileMenuVariants, mobileMenuItemVariants } from '@/lib/animations.js'

/**
 * Site header.
 *
 * The admin panel is deliberately absent from this navigation: it is a local demo
 * tool, not part of the public site.
 */
export default function Header() {
  const { profile } = useContent()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef(null)

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
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 shadow-[0_1px_0_rgb(255_255_255/0.35)] backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          <Link
            to="/"
            className="group min-w-0 truncate font-display text-lg font-semibold tracking-tight transition-colors hover:text-accent"
          >
            {profile.name}
          </Link>

          <nav aria-label="Main" className="hidden min-w-0 md:block">
            <ul className="flex items-center gap-5 lg:gap-7">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `nav-link rounded-md px-1 py-1 text-sm font-semibold transition-colors ${
                        isActive ? 'text-accent' : 'text-muted hover:text-ink'
                      }`
                    }
                    data-active={undefined}
                  >
                    {({ isActive }) => (
                      <span
                        className="nav-link"
                        data-active={isActive ? 'true' : undefined}
                      >
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-accent md:hidden"
            >
              {menuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 top-16 z-30 bg-ink/20 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.nav
              id="mobile-nav"
              aria-label="Main"
              className="absolute left-0 right-0 top-full z-40 border-b border-line bg-surface/95 backdrop-blur-xl md:hidden"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <Container>
                <ul className="flex flex-col py-3">
                  {NAV_ITEMS.map((item) => (
                    <motion.li key={item.path} variants={mobileMenuItemVariants}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        className={({ isActive }) =>
                          `block border-b border-line/50 py-3.5 text-sm font-semibold last:border-0 transition-colors ${
                            isActive ? 'text-accent' : 'text-ink hover:text-accent'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
              </Container>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
