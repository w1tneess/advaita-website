import { Link } from 'react-router-dom'

import Container from '@/components/layout/Container.jsx'
import Icon from '@/components/meta/Icon.jsx'
import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'

/**
 * Compact Footer.
 *
 * Designed with high-end, quiet, monochrome aesthetics:
 *   - Horizontal layout for space efficiency
 *   - Brand Logo on the left
 *   - Navigation and Socials on the right
 */
export default function Footer() {
  const { profile, settings, publicSocialLinks } = useContent()

  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()

  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-line/40 bg-canvas text-ink py-8 sm:py-10">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Left: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              to="/"
              className="group font-display text-xl sm:text-2xl font-bold tracking-tight text-ink transition-colors hover:text-accent"
            >
              <span>{profile.name}</span>
              <span className="text-accent ml-0.5">.</span>
            </Link>
            <div className="text-xs sm:text-sm font-medium text-muted/75 tracking-normal text-center md:text-left">
              <p>
                © {year} {profile.name || 'Advaita Chandra'}. All rights reserved.
              </p>
              {settings.footerNote && <p className="mt-1 text-muted/60">{settings.footerNote}</p>}
            </div>
          </div>

          {/* Right: Navigation Links & Socials */}
          <div className="flex flex-col items-center md:items-end gap-4 md:gap-5">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm font-medium tracking-wide text-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {configured.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {configured.map((link) => (
                  <a
                    key={link.id}
                    href={hrefFor(link)}
                    aria-label={link.label}
                    className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-ink text-canvas shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 hover:opacity-90 dark:bg-white dark:text-black"
                    {...(link.kind === 'email'
                      ? {}
                      : { target: '_blank', rel: 'me noopener noreferrer' })}
                  >
                    <Icon name={link.icon} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </footer>
  )
}
