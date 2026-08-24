import { Link } from 'react-router-dom'

import Container from './Container.jsx'
import Icon from './Icon.jsx'
import { useContent } from '../lib/content.jsx'
import { NAV_ITEMS } from '../lib/routes.js'

/**
 * Site footer.
 *
 * Only social links with a real URL are rendered. Unconfigured ones are omitted rather
 * than shown as dead links — a placeholder that looks clickable is worse than nothing.
 * The admin panel is deliberately not linked from here.
 */
export default function Footer() {
  const { profile, settings, publicSocialLinks } = useContent()

  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()

  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-lg font-semibold tracking-tight">{profile.name}</p>
            <p className="mt-2 max-w-sm text-sm text-muted">{profile.tagline}</p>
            <p className="mt-4 text-sm text-muted">{profile.location}</p>
          </div>

          <nav aria-labelledby="footer-nav-heading">
            <h2 id="footer-nav-heading" className="text-sm font-semibold">
              Pages
            </h2>
            <ul className="mt-3 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-muted hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold">Elsewhere</h2>
            {configured.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {configured.map((link) => (
                  <li key={link.id}>
                    <a
                      href={hrefFor(link)}
                      className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent"
                      {...(link.kind === 'email'
                        ? {}
                        : { target: '_blank', rel: 'me noopener noreferrer' })}
                    >
                      <Icon name={link.icon} className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">
                No profiles linked yet.{' '}
                <Link to="/contact" className="text-accent hover:text-accent-strong">
                  Contact
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          {settings.footerNote && <p className="sm:text-right">{settings.footerNote}</p>}
        </div>
      </Container>
    </footer>
  )
}
