import PageHeader from '@/components/ui/PageHeader.jsx'
import ContactForm from '@/components/ui/ContactForm.jsx'
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
        title="Tell me where I’m wrong"
        lead={contact.intro || 'Corrections, better sources, book recommendations and questions are all welcome.'}
      />

      <section className="shell folio gap-y-14 pb-28 lg:pb-40">
        <aside className="folio-margin space-y-10 text-[15px] leading-relaxed text-muted">
          <div>
            <p className="mark-label" data-ink="opinion">corrections</p>
            <p className="mt-3">
              {contact.corrections ||
                'If you spot a factual error, a missing citation or a weak argument anywhere here, send the details and, if you can, the source.'}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <p className="text-ink">Elsewhere</p>
              <ul className="mt-3 space-y-2">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a href={link.url} target="_blank" rel="me noopener noreferrer" className="pen-link inline-block py-1 hover:text-ink">
                      {link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-ink">Privacy</p>
            <p className="mt-3">
              {contact.privacyNote ||
                'Your email is used only to reply to you. It is never shared or added to a list.'}
            </p>
          </div>
        </aside>

        <div className="lg:col-span-7 lg:col-start-5">
          <ContactForm />
        </div>
      </section>
    </>
  )
}
