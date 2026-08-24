import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import Container from './Container.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useContent } from '../lib/content.jsx'
import { NAV_ITEMS } from '../lib/routes.js'

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

  const linkClasses = ({ isActive }) =>
    `rounded-md px-1 py-1 text-sm font-medium transition-colors ${
      isActive ? 'text-accent' : 'text-muted hover:text-ink'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/80 shadow-[0_1px_0_rgb(255_255_255/0.35)] backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4">
          <Link
            to="/"
            className="min-w-0 truncate font-display text-lg font-semibold tracking-tight"
          >
            {profile.name}
          </Link>

          <nav aria-label="Main" className="hidden min-w-0 md:block">
            <ul className="flex items-center gap-4 lg:gap-7">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} end={item.path === '/'} className={linkClasses}>
                    {item.label}
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

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="animate-fade border-t border-line bg-surface md:hidden"
        >
          <Container>
            <ul className="flex flex-col py-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `block border-b border-line py-3 text-sm font-medium last:border-0 ${
                        isActive ? 'text-accent' : 'text-ink'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  )
}
