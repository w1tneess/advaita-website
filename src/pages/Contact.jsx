import { AlertCircle, Mail, ShieldCheck } from 'lucide-react'

import Badge from '../components/Badge.jsx'
import Button from '../components/Button.jsx'
import Callout from '../components/Callout.jsx'
import Card from '../components/Card.jsx'
import Container from '../components/Container.jsx'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { useContent } from '../lib/content.jsx'
import { apiConfigured, apiRequest } from '../lib/api.js'
import { useState } from 'react'
import { PUBLIC_ROUTES } from '../lib/routes.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'contact')

/**
 * Contact page.
 *
 * There is no message form. A form needs somewhere to send the message, and every option
 * either requires a backend (which this site does not have) or hands visitor messages to
 * a third-party service. A mailto: link is honest about where the message goes.
 *
 * Unconfigured links are shown as clearly-labelled placeholders rather than as links that
 * silently go nowhere.
 */
export default function Contact() {
  const { profile, settings, publicSocialLinks } = useContent()
  const contact = settings.contact

  const email = publicSocialLinks.find((link) => link.kind === 'email')
  const others = publicSocialLinks.filter((link) => link.kind !== 'email')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  async function submitMessage(event) {
    event.preventDefault()
    setStatus('Sending...')
    try {
      await apiRequest('/messages', { method: 'POST', body: JSON.stringify(form) })
      setForm({ name: '', email: '', message: '' })
      setStatus('Message sent. Thank you.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/contact" />

      <Container>
        <div className="py-14 sm:py-20">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {contact.heading}
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">{contact.intro}</p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {apiConfigured && (
              <Card className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold">Send a message</h2>
                <form onSubmit={submitMessage} className="mt-5 space-y-4">
                  <label className="block text-sm font-medium">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm" /></label>
                  <label className="block text-sm font-medium">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm" /></label>
                  <label className="block text-sm font-medium">Message<textarea required rows="5" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm" /></label>
                  <Button type="submit" disabled={status === 'Sending...'}>Send message</Button>
                  {status && <p className="text-sm text-muted" role="status">{status}</p>}
                </form>
              </Card>
            )}
            <Card className="p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Mail className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
                Email
              </h2>

              {email?.url ? (
                <>
                  <p className="mt-3 text-sm text-muted">
                    Opens in whatever mail application this device uses.
                  </p>
                  <Button href={`mailto:${email.url}`} className="mt-5 w-full sm:w-auto">
                    {email.url}
                  </Button>
                </>
              ) : (
                <>
                  <p className="mt-3 text-sm text-muted">
                    No address is published yet. This is a placeholder — see the README for
                    how to set it.
                  </p>
                  <p className="mt-5 flex flex-wrap items-center gap-2">
                    <code className="rounded-md border border-dashed border-line bg-raised px-2.5 py-1.5 font-mono text-sm text-muted">
                      {email?.placeholder ?? 'you@example.com'}
                    </code>
                    <Badge tone="opinion">Placeholder</Badge>
                  </p>
                </>
              )}

              {contact.responseNote && (
                <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
                  {contact.responseNote}
                </p>
              )}
            </Card>

            <Card className="p-6 sm:p-8">
              <h2 className="text-lg font-semibold">Profiles</h2>
              <p className="mt-3 text-sm text-muted">
                Anything still marked as a placeholder has not been set up yet.
              </p>

              <ul className="mt-5 space-y-3">
                {others.map((link) => (
                  <li key={link.id} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-muted"
                      aria-hidden="true"
                    >
                      <Icon name={link.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{link.label}</p>
                      {link.url ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="me noopener noreferrer"
                          className="text-sm break-words text-accent underline underline-offset-4 hover:text-accent-strong"
                        >
                          {link.handle || link.url}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <p className="text-sm break-words text-muted">
                          <span className="font-mono">{link.placeholder}</span>
                          <span className="ml-2 text-xs uppercase">— placeholder</span>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Privacy is stated as a deliberate choice, not an omission. */}
            <Card className="p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <ShieldCheck className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
                A note on privacy
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{contact.privacyNote}</p>
              <p className="mt-4 text-sm text-muted">
                Location published on this site: <strong>{profile.location}</strong>. Nothing
                more precise than that.
              </p>
            </Card>

            <Callout variant="fact" title="Corrections are welcome">
              <p>{contact.corrections}</p>
              <p className="mt-3 flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  Messages are stored securely for the site owner when the Worker API is enabled.
                </span>
              </p>
            </Callout>
          </div>
        </div>
      </Container>
    </>
  )
}
