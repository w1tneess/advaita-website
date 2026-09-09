import { MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
import ContactForm from '@/components/ui/ContactForm.jsx'
import Icon from '@/components/meta/Icon.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'contact')

/**
 * Contact page.
 *
 * Darkroom journal / cinematic editorial correspondence interface.
 */
export default function Contact() {
  const { settings, publicSocialLinks } = useContent()
  const contact = settings?.contact || {}

  const socialLinks = publicSocialLinks.filter((link) => link.kind !== 'email' && link.url)

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/contact" />

      <PageHeader
        eyebrow="Contact"
        title={contact.heading || "Get in Touch."}
        lead={contact.intro || "I welcome messages regarding research projects, book recommendations, feedback, and interesting ideas."}
      >
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-3">
          <span className="text-copper">STATUS //</span>
          <span className="border border-line bg-surface px-2.5 py-0.5 text-[11px] text-text-2">OPEN TO MESSAGES</span>
          <span className="text-line-strong">|</span>
          <span className="text-copper font-medium">LOCATION: INDIA</span>
          <span className="text-line-strong">|</span>
          <span className="text-text-3">REPLY: ~24–48H</span>
        </div>
      </PageHeader>

      <div className="shell pb-24 md:pb-32 space-y-16 md:space-y-24">
        {/* Main Interface Grid */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left / Primary: Contact dispatch terminal */}
          <div className="lg:col-span-3">
            <Reveal y={12}>
              <div className="border border-line bg-surface/80 p-6 sm:p-8 md:p-10 backdrop-blur-sm relative overflow-hidden">
                {/* Optical darkroom corner bracket */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-copper/30 pointer-events-none" />

                <div className="border-b border-line pb-6 mb-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500/90 animate-pulse" aria-hidden="true" />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-copper font-semibold">
                        DIRECT MESSAGE
                      </span>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-text">
                      Send a Message
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-text-3">
                    Replies within ~24–48h
                  </span>
                </div>

                <ContactForm />
              </div>
            </Reveal>
          </div>

          {/* Right / Sidebar: Archival dialogue & Public links */}
          <div className="space-y-6 lg:col-span-2">
            {/* Academic dialogue context */}
            <Reveal y={12} delay={0.06}>
              <div className="border border-line bg-surface/80 p-6 sm:p-7 backdrop-blur-sm relative">
                <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-copper font-semibold">
                    QUESTIONS &amp; IDEAS
                  </span>
                  <MessageSquare className="h-4 w-4 text-copper" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-medium tracking-tight text-text">
                  Exchanging Ideas &amp; Readings
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-text-2">
                  Whether you are a student, researcher, or curious reader interested in data, history, or philosophy, I am always glad to exchange ideas and book recommendations.
                </p>
                {contact.responseNote && (
                  <p className="mt-4 pt-3 border-t border-line text-xs text-text-3 font-mono">
                    {contact.responseNote}
                  </p>
                )}
              </div>
            </Reveal>

            {/* Public Channels / Identity */}
            {socialLinks.length > 0 && (
              <Reveal y={12} delay={0.12}>
                <div className="border border-line bg-surface/80 p-6 sm:p-7 backdrop-blur-sm">
                  <div className="border-b border-line pb-3 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-copper font-semibold">
                      PUBLIC PROFILES
                    </span>
                    <h3 className="mt-1 font-display text-lg font-medium tracking-tight text-text">
                      Links &amp; Profiles
                    </h3>
                  </div>
                  <ul className="space-y-3.5">
                    {socialLinks.map((link) => (
                      <li key={link.id} className="flex items-center gap-3">
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center border border-line bg-canvas text-copper"
                          aria-hidden="true"
                        >
                          <Icon name={link.icon} className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs font-medium text-text">{link.label}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="me noopener noreferrer"
                            className="font-mono text-xs break-words text-copper hover:text-copper-strong transition-colors underline underline-offset-4"
                          >
                            {link.handle || link.url}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Bottom: Scholarly Integrity and Privacy */}
        <Reveal y={12} delay={0.16}>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-line bg-surface/80 p-6 sm:p-8 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-medium text-text">
                <CheckCircle2 className="h-4.5 w-4.5 text-copper" aria-hidden="true" />
                Corrections & Scholarly Scrutiny
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-2">
                {contact.corrections ||
                  'Constructive critique is how research matures. If you notice a factual discrepancy, citation gap, or methodological error anywhere on this site, please send details and sources.'}
              </p>
              <p className="mt-4 pt-3 border-t border-line text-xs font-mono text-text-3">
                All confirmed corrections are updated in project registries with appropriate attribution.
              </p>
            </div>

            <div className="border border-line bg-surface/80 p-6 sm:p-8 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 font-display text-lg font-medium text-text">
                <ShieldCheck className="h-4.5 w-4.5 text-copper" aria-hidden="true" />
                Privacy & Correspondence Policy
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-2">
                {contact.privacyNote ||
                  'Personal contact details are handled respectfully and used strictly for direct correspondence. I do not share email addresses or use them for any secondary purpose.'}
              </p>
              <p className="mt-4 pt-3 border-t border-line text-xs font-mono text-text-3">
                Independent research archive located in <strong className="text-copper font-medium">India</strong>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}
