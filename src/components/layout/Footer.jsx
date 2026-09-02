import { Link } from 'react-router-dom'

import Container from '@/components/layout/Container.jsx'
import Icon from '@/components/meta/Icon.jsx'
import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'

/**
 * Editorial Centered Minimal Footer.
 *
 * Designed with high-end, quiet, monochrome aesthetics:
 *   - Centered Brand Wordmark
 *   - Centered Navigation Row
 *   - Centered Solid Circular Social Buttons
 *   - Minimal Subtle Divider
 *   - Clean Copyright Line
 */
export default function Footer() {
  const { profile, settings, publicSocialLinks } = useContent()

  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()

  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-line/40 bg-canvas text-ink py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex flex-col items-center text-center">
          {/* 1. Brand Logo / Wordmark */}
          <Link
            to="/"
            className="group font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink transition-colors hover:text-accent"
          >
            <span>{profile.name}</span>
            <span className="text-accent ml-0.5">.</span>
          </Link>

          {/* 2. Navigation Links */}
          <nav aria-label="Footer navigation" className="mt-8 sm:mt-10">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-xs sm:text-sm font-medium tracking-wide text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. Social Circular Icons */}
          {configured.length > 0 && (
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
              {configured.map((link) => (
                <a
                  key={link.id}
                  href={hrefFor(link)}
                  aria-label={link.label}
                  className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-ink text-canvas shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 hover:opacity-90 dark:bg-white dark:text-black"
                  {...(link.kind === 'email'
                    ? {}
                    : { target: '_blank', rel: 'me noopener noreferrer' })}
                >
                  <Icon name={link.icon} className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </a>
              ))}
            </div>
          )}

          {/* 4. Subtle Divider */}
          <div className="w-16 sm:w-20 border-t border-line/60 my-8 sm:my-10" aria-hidden="true" />

          {/* 5. Copyright & Optional Note */}
          <div className="text-center text-sm font-medium text-muted/75 tracking-normal">
            <p>
              Copyright © {year} {profile.name || 'Advaita Chandra'}. All rights reserved.
            </p>
            {settings.footerNote && <p className="mt-1 text-muted/60">{settings.footerNote}</p>}
          </div>
        </div>
      </Container>
    </footer>
  )
}
