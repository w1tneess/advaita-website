import { MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

import Card from '../components/ui/Card.jsx'
import ContactForm from '../components/ui/ContactForm.jsx'
import Container from '../components/layout/Container.jsx'
import Icon from '../components/meta/Icon.jsx'
import Seo from '../components/meta/Seo.jsx'
import { useContent } from '../lib/content.jsx'
import { PUBLIC_ROUTES } from '../config/nav.js'
import { pageLoadVariant, sectionReveal, scrollViewport } from '../lib/animations.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'contact')

/**
 * Contact page.
 *
 * Warm, professional correspondence interface for educators, mentors,
 * fellow students, and academic collaborators.
 */
export default function Contact() {
  const { profile, settings, publicSocialLinks } = useContent()
  const contact = settings?.contact || {}

  const socialLinks = publicSocialLinks.filter((link) => link.kind !== 'email' && link.url)

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/contact" />

      <Container>
        <motion.div
          className="py-12 sm:py-16 md:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          {/* Header */}
          <div className="border-b border-line/40 pb-8 sm:pb-10">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent uppercase mb-3">
              <span>⟐</span>
              <span>CORRESPONDENCE & DIALOGUE</span>
            </div>

            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-ink">
                {contact.heading || 'Get in touch'}
              </h1>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">
                {contact.intro ||
                  'I welcome correspondence regarding my research projects, reading inquiries, and potential academic collaborations. If you have questions or constructive feedback, please reach out.'}
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 grid gap-8 lg:grid-cols-5">
            {/* Contact form */}
            <div className="lg:col-span-3">
              <Card className="p-6 sm:p-8 md:p-9 border border-line bg-surface shadow-subtle">
                <div className="border-b border-line/40 pb-5 mb-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500/90" aria-hidden="true" />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-accent font-semibold">
                        Direct Correspondence
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
                      Send a Message
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-muted/80">
                    Replies within ~24–48h
                  </span>
                </div>
                <ContactForm />
              </Card>
            </div>

            {/* Sidebar — academic context + social links */}
            <div className="space-y-6 lg:col-span-2">
              {/* Context card for mentors / educators */}
              <Card className="p-6 sm:p-7 border border-line bg-surface shadow-subtle">
                <div className="flex items-center justify-between border-b border-line/40 pb-3 mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent font-semibold">
                    Mentorship & Review
                  </span>
                  <MessageSquare className="h-4 w-4 text-accent/80" aria-hidden="true" />
                </div>
                <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
                  Academic & Research Inquiries
                </h2>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">
                  Whether you are an educator, student researcher, or mentor working on data reconciliation, historical analysis, or philosophy, I am always glad to exchange perspectives and recommended readings.
                </p>
                {contact.responseNote && (
                  <p className="mt-4 pt-3 border-t border-line/40 text-xs text-muted/80 font-mono">
                    {contact.responseNote}
                  </p>
                )}
              </Card>

              {/* Profiles / channels */}
              {socialLinks.length > 0 && (
                <Card className="p-6 sm:p-7 border border-line bg-surface shadow-subtle">
                  <div className="border-b border-line/40 pb-3 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-accent font-semibold">
                      Public Identity
                    </span>
                    <h2 className="mt-1 font-display text-lg font-semibold tracking-tight text-ink">
                      Profiles & Repositories
                    </h2>
                  </div>
                  <ul className="space-y-3.5">
                    {socialLinks.map((link) => (
                      <li key={link.id} className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-muted"
                          aria-hidden="true"
                        >
                          <Icon name={link.icon} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-ink">{link.label}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="me noopener noreferrer"
                            className="text-xs break-words text-accent underline underline-offset-4 hover:text-accent-strong transition-colors"
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
            </div>
          </div>
        </motion.div>
      </Container>

      {/* Scholarly Integrity and Privacy */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        variants={sectionReveal}
      >
        <Container>
          <div className="grid gap-6 pb-16 lg:grid-cols-2">
            <Card className="p-6 sm:p-8 border border-line bg-surface shadow-subtle">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <CheckCircle2 className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
                Corrections & Scholarly Scrutiny
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {contact.corrections ||
                  'Constructive critique is how research matures. If you notice a factual discrepancy, citation gap, or methodological error anywhere on this site, please send details and sources.'}
              </p>
              <p className="mt-4 pt-3 border-t border-line/30 text-xs text-muted/80">
                All confirmed corrections will be updated in project logs with appropriate attribution.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 border border-line bg-surface shadow-subtle">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <ShieldCheck className="h-4.5 w-4.5 text-accent" aria-hidden="true" />
                Privacy & Correspondence Policy
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {contact.privacyNote ||
                  'Personal contact details are handled respectfully and used strictly for correspondence. I do not share email addresses or use them for any secondary purpose.'}
              </p>
              <p className="mt-4 pt-3 border-t border-line/30 text-xs text-muted/80">
                Independent research archive based in <strong>{profile.location || 'India'}</strong>.
              </p>
            </Card>
          </div>
        </Container>
      </motion.div>
    </>
  )
}
