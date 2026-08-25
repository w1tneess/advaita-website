import { Link } from 'react-router-dom'

import Avatar from './Avatar.jsx'
import Container from './Container.jsx'
import Icon from './Icon.jsx'
import { useContent } from '../lib/content.jsx'
import { NAV_ITEMS } from '../lib/routes.js'

/**
 * Site footer.
 *
 * Minimal and intentional: profile info, navigation links, and social connections.
 * Only social links with a real URL are rendered; unconfigured ones are omitted.
 * The admin panel is deliberately not linked from here.
 */
export default function Footer() {
  const { profile, settings, publicSocialLinks } = useContent()

  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()

  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-border bg-surface text-foreground">
      <Container width="wide">
        <div className="grid gap-12 py-12 sm:grid-cols-[minmax(0,1.3fr)_minmax(15rem,0.7fr)] sm:py-14 lg:grid-cols-[minmax(0,1.5fr)_10rem_10rem] lg:gap-16 lg:py-16">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <Avatar profile={profile} size="sm" className="border-border bg-surface-elevated text-foreground" />
              <span className="font-display text-lg font-semibold tracking-tight">{profile.name}</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-foreground-muted">{profile.tagline}</p>
            <Link
              to="/contact"
              className="mt-4 inline-block text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Get in touch <span className="text-foreground-subtle">about research, writing or collaboration</span>
            </Link>

            {configured.length > 0 && (
              <ul className="mt-8 flex items-center gap-2" aria-label="Social links">
                {configured.map((link) => (
                  <li key={link.id}>
                    <a
                      href={hrefFor(link)}
                      aria-label={link.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-elevated text-foreground-muted transition-colors hover:border-accent hover:bg-accent-soft hover:text-accent"
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

          <nav aria-labelledby="footer-sections-heading">
            <h2 id="footer-sections-heading" className="text-sm font-semibold text-foreground">
              Explore
            </h2>
            <ul className="mt-4 space-y-3">
              {NAV_ITEMS.filter((item) => item.key !== 'home' && item.key !== 'contact').map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-foreground-muted transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-pages-heading">
            <h2 id="footer-pages-heading" className="text-sm font-semibold text-foreground">
              Pages
            </h2>
            <ul className="mt-4 space-y-3">
              {NAV_ITEMS.filter((item) => item.key === 'home' || item.key === 'contact').map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-sm text-foreground-muted transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {profile.name}</p>
          {settings.footerNote && <p className="sm:text-right">{settings.footerNote}</p>}
        </div>
      </Container>
    </footer>
  )
}
