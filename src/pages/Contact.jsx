import { AlertCircle, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

import Callout from '../components/ui/Callout.jsx'
import Card from '../components/ui/Card.jsx'
import ContactForm from '../components/ui/ContactForm.jsx'
import Container from '../components/layout/Container.jsx'
import Icon from '../components/meta/Icon.jsx'
import Seo from '../components/meta/Seo.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../config/nav.js'
import {
  pageLoadVariant,
  sectionReveal,
  scrollViewport,
} from '../lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'contact')

/**
 * Contact page.
 *
 * Features a contact form that submits to Supabase (contact_submissions table).
 * No exposed personal inbox — messages are stored in the database and can be
 * retrieved via the admin panel or direct DB access.
 */
export default function Contact() {
  const { profile, settings, publicSocialLinks } = useContent()
  const contact = settings.contact

  const socialLinks = publicSocialLinks.filter((link) => link.kind !== 'email' && link.url)

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/contact" />

      <Container>
        <motion.div
          className="py-14 sm:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {contact.heading}
          </h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">{contact.intro}</p>

          <div className="mt-12 grid gap-8 lg:grid-cols-5">
            {/* Contact form — takes more space */}
            <div className="lg:col-span-3">
              <Card className="p-6 sm:p-8">
                <h2 className="text-lg font-semibold">Send a message</h2>
                <p className="mt-2 text-sm text-muted">
                  Messages are stored securely — your email will not be published or shared.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </Card>
            </div>

            {/* Sidebar — social links + notes */}
            <div className="space-y-6 lg:col-span-2">
              {/* Social / profiles */}
              {socialLinks.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-lg font-semibold">Elsewhere</h2>
                  <ul className="mt-4 space-y-3">
                    {socialLinks.map((link) => (
                      <li key={link.id} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-muted"
                          aria-hidden="true"
                        >
                          <Icon name={link.icon} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{link.label}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="me noopener noreferrer"
                            className="text-sm break-words text-accent underline underline-offset-4 hover:text-accent-strong"
                          >
                            {link.handle || link.url}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Response note */}
              {contact.responseNote && (
                <Card className="p-6">
                  <p className="text-sm leading-relaxed text-muted">{contact.responseNote}</p>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Privacy and corrections */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Container>
          <div className="grid gap-6 pb-14 lg:grid-cols-2">
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
                  Messages are stored in a secure database. No personal inbox is exposed on this site.
                </span>
              </p>
            </Callout>
          </div>
        </Container>
      </motion.div>
    </>
  )
}
