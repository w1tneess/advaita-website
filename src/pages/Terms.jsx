import PageHeader from '@/components/ui/PageHeader.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { Link } from 'react-router'
import { BookOpen, Camera, Code2 } from 'lucide-react'

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms of Use"
        description="Terms of use, intellectual property guidelines, and citation standards for Advaita Chandra's archive."
        path="/terms"
      />

      <PageHeader
        eyebrow="Legal"
        title="Terms of Use."
        lead="Standards governing academic citations, archival reproduction, open source licensing, and photographic rights."
      />

      <div className="shell pb-24 md:pb-32 space-y-12 md:space-y-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-surface p-8 border-t border-ink">
            <div className="flex items-center gap-2 text-muted font-utility mb-4">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Written Notes</span>
            </div>
            <h3 className="text-2xl text-ink font-normal">Original Writing</h3>
            <p className="mt-4 text-base font-sans text-muted leading-relaxed">
              Notes, reflections, and historical research are copyrighted by Advaita Chandra, with open citation permitted.
            </p>
          </div>

          <div className="bg-surface p-8 border-t border-ink">
            <div className="flex items-center gap-2 text-muted font-utility mb-4">
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span>Optical Archives</span>
            </div>
            <h3 className="text-2xl text-ink font-normal">Photography Plates</h3>
            <p className="mt-4 text-base font-sans text-muted leading-relaxed">
              Visual contact sheets and photographic works are protected original media. Personal non-commercial display only.
            </p>
          </div>

          <div className="bg-surface p-8 border-t border-ink">
            <div className="flex items-center gap-2 text-muted font-utility mb-4">
              <Code2 className="h-4 w-4" aria-hidden="true" />
              <span>Software Code</span>
            </div>
            <h3 className="text-2xl text-ink font-normal">Open Source Tools</h3>
            <p className="mt-4 text-base font-sans text-muted leading-relaxed">
              Software tools and computational scripts linked to GitHub repositories are governed by their respective open-source licenses.
            </p>
          </div>
        </div>

        <div className="bg-surface p-8 sm:p-12 space-y-12">
          <section className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">01</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Citation Standards & Fair Use</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              Quotations and references to notes on this site are warmly encouraged under fair use principles, provided accurate attribution is maintained:
            </p>
            <div className="border-l border-ink bg-surface p-6 mt-4 text-base text-muted space-y-2 font-utility">
              <p className="text-ink">SUGGESTED CITATION FORMAT:</p>
              <p>Chandra, Advaita. &ldquo;[Note Title]&rdquo;. Advaita Chandra, [Year], https://advaitachandra.in/[path].</p>
            </div>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">02</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Photography Usage Restrictions</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              All photographs displayed within the{' '}
              <Link to="/photography" className="text-ink underline underline-offset-4 hover:text-muted">
                Optical Archives / Photography
              </Link>{' '}
              section are the exclusive intellectual property of Advaita Chandra. Unauthorized commercial reproduction, print sales, stock library scraping, or AI image generator ingestion without prior written authorization is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">03</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Epistemic Disclaimer & Research Accuracy</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              The contents of this website represent independent research, philosophical inquiries, and developmental models. While every effort is made to maintain factual precision and rigorous sourcing, all materials are provided on an &ldquo;as is&rdquo; basis for intellectual discourse.
            </p>
            <p className="text-base font-sans text-muted leading-relaxed">
              If you detect a factual inaccuracy, methodological gap, or archival oversight, please submit a correction via the{' '}
              <Link to="/contact" className="text-ink underline underline-offset-4 hover:text-muted">
                Contact Dispatch
              </Link>
              . Validated corrections will be updated promptly.
            </p>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">04</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Acceptable Use & Scraping</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              Visitors agree not to engage in malicious denial-of-service attempts, automated form spamming, or disruptive scraping that violates the directives laid out in our <code className="bg-line px-1.5 py-0.5 rounded text-sm font-utility text-ink">robots.txt</code> file.
            </p>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">05</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Governing Law & Legal Venue</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of <strong className="text-ink font-semibold">India</strong>. Any disputes arising out of the use of this website shall be resolved within the appropriate courts situated in India.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
