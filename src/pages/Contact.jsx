import { MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader.jsx'
import ContactForm from '@/components/ui/ContactForm.jsx'
import Icon from '@/components/meta/Icon.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'contact')

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
      />

      <div className="shell pb-24 pt-8 space-y-16">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Left / Primary: Contact dispatch terminal */}
          {/* Left / Primary: Contact dispatch terminal */}
          <div className="lg:col-span-3">
            <div className="pt-4 border-t border-line">
              <div className="border-b border-line pb-3 mb-6 flex justify-between items-baseline">
                <h2 className="text-xl sm:text-2xl font-normal text-ink text-balance">
                  Send a Message
                </h2>
                <span className="font-mono text-xs tracking-wide text-muted">
                  Replies within ~24–48h
                </span>
              </div>

              <ContactForm />
            </div>
          </div>

          {/* Right / Sidebar: Archival dialogue & Public links */}
          <div className="lg:col-span-2 pt-6 border-t border-line lg:border-t-0 lg:pt-0 lg:pl-8 lg:border-l lg:border-line">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
                  <span className="font-mono text-xs tracking-wide text-ink">
                    Questions & Ideas
                  </span>
                  <MessageSquare className="h-4 w-4 text-muted" aria-hidden="true" />
                </div>
                <h3 className="text-base sm:text-lg font-normal text-ink text-balance">
                  Exchanging Ideas
                </h3>
                <p className="mt-2 text-sm font-sans leading-relaxed text-muted">
                  Whether you are a student, researcher, or curious reader interested in data, history, or philosophy, I am always glad to exchange ideas and book recommendations.
                </p>
                {contact.responseNote && (
                  <p className="mt-4 pt-4 border-t border-line text-sm font-display italic text-muted">
                    {contact.responseNote}
                  </p>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div>
                  <div className="border-b border-line pb-2 mb-3">
                    <span className="font-mono text-xs tracking-wide text-ink">
                      Public Profiles
                    </span>
                  </div>
                  <ul className="space-y-4">
                    {socialLinks.map((link) => (
                      <li key={link.id} className="flex items-center gap-4">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-muted rounded-xl bg-surface/50 shadow-subtle"
                          aria-hidden="true"
                        >
                          <Icon name={link.icon} className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-xs tracking-wide text-ink uppercase mb-0.5">{link.label}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="me noopener noreferrer"
                            className="font-sans text-sm text-muted hover:text-ink active:opacity-80 transition-colors duration-150 ease-[var(--ease-out-quart)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded-sm block truncate"
                          >
                            {link.handle || link.url}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Scholarly Integrity and Privacy */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="pt-6 border-t border-line">
            <h3 className="flex items-center gap-2 text-xl font-normal text-ink text-balance mb-3">
              <CheckCircle2 className="h-5 w-5 text-muted" aria-hidden="true" />
              Corrections & Scrutiny
            </h3>
            <p className="text-base font-sans leading-relaxed text-muted">
              {contact.corrections ||
                'Constructive critique is how research matures. If you notice a factual discrepancy, citation gap, or methodological error anywhere on this site, please send details and sources.'}
            </p>
            <p className="mt-4 pt-4 border-t border-line font-mono text-xs tracking-wide text-muted">
              All confirmed corrections are updated in project registries with appropriate attribution.
            </p>
          </div>

          <div className="pt-6 border-t border-line">
            <h3 className="flex items-center gap-2 text-xl font-normal text-ink text-balance mb-3">
              <ShieldCheck className="h-5 w-5 text-muted" aria-hidden="true" />
              Privacy Policy
            </h3>
            <p className="text-base font-sans leading-relaxed text-muted">
              {contact.privacyNote ||
                'Personal contact details are handled respectfully and used strictly for direct correspondence. I do not share email addresses or use them for any secondary purpose.'}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
