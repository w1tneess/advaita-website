import { Link } from 'react-router-dom'

import Container from '@/components/layout/Container.jsx'
import Icon from '@/components/meta/Icon.jsx'
import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'

/**
 * Site footer.
 *
 * Simple and clean. Only social links with a real URL are rendered.
 */
export default function Footer() {
  const { profile, settings, publicSocialLinks } = useContent()

  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()

  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-line bg-surface text-ink">
      <Container>
        <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between sm:py-12">
          <div className="min-w-0">
            <Link
              to="/"
              className="font-display text-lg font-semibold tracking-tight"
            >
              {profile.name}
            </Link>
            <p className="mt-2 max-w-xs text-sm text-muted">
              {profile.tagline}
            </p>

            {configured.length > 0 && (
              <ul className="mt-5 flex items-center gap-2" aria-label="Social links">
                {configured.map((link) => (
                  <li key={link.id}>
                    <a
                      href={hrefFor(link)}
                      aria-label={link.label}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-raised text-muted transition-colors hover:border-accent hover:text-accent"
                      {...(link.kind === 'email'
                        ? {}
                        : { target: '_blank', rel: 'me noopener noreferrer' })}
                    >
                      <Icon name={link.icon} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile.name}</p>
          {settings.footerNote && <p>{settings.footerNote}</p>}
        </div>
      </Container>
    </footer>
  )
}
