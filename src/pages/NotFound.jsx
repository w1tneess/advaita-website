import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import Button from '../components/Button.jsx'
import Container from '../components/Container.jsx'
import Seo from '../components/Seo.jsx'
import { NAV_ITEMS } from '../lib/routes.js'

/**
 * 404 page.
 *
 * Also what `dist/404.html` renders, which is how GitHub Pages serves any path that has
 * no pre-rendered file. React Router then matches the real URL client-side, so a valid
 * deep link that was missed by the pre-render list still resolves to its page.
 */
export default function NotFound() {
  const { pathname } = useLocation()

  return (
    <>
      <Seo
        title="Page not found"
        description="This page does not exist on this site."
        path={pathname}
        noindex
      />

      <Container>
        <div className="max-w-xl py-20 sm:py-28">
          <p className="font-mono text-sm text-foreground-muted">404</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            This page doesn&rsquo;t exist
          </h1>
          <p className="mt-5 text-lg text-foreground-muted">
            The address <code className="font-mono text-base break-words">{pathname}</code>{' '}
            doesn&rsquo;t match anything here. It may have been mistyped, or it may be
            something I have not written yet.
          </p>

          <nav aria-label="Site pages" className="mt-8">
            <p className="text-sm font-medium">Try one of these:</p>
            <ul className="mt-3 space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex items-center gap-1.5 text-accent underline underline-offset-4 hover:text-accent-strong"
                  >
                    {item.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button to="/" className="mt-9">
            Back to the home page
          </Button>
        </div>
      </Container>
    </>
  )
}
