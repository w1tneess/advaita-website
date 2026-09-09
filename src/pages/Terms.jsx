import PageHeader from '@/components/ui/PageHeader.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
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
        eyebrow="LEGAL & COMPLIANCE // 02"
        registry="SYS.REG: TERMS-2026"
        title="Terms of Use."
        lead="Standards governing academic citations, archival reproduction, open source licensing, and photographic rights."
      >
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-3">
          <span className="text-copper">FRAMEWORK //</span>
          <span className="border border-line bg-surface px-2.5 py-0.5 text-[11px] text-text-2">
            SCHOLARLY COMMONS & CITATION
          </span>
          <span className="text-line-strong">|</span>
          <span className="text-copper font-medium">JURISDICTION: INDIA</span>
          <span className="text-line-strong">|</span>
          <span className="text-text-3">EFFECTIVE: 2026</span>
        </div>
      </PageHeader>

      <div className="shell pb-24 md:pb-32 space-y-12 md:space-y-16">
        {/* Core Domains Grid */}
        <Reveal y={12}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-line bg-surface/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-copper font-mono text-xs uppercase tracking-wider mb-3">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>Scholarly Works</span>
              </div>
              <h3 className="font-display text-lg text-text font-normal">Original Writing</h3>
              <p className="mt-2 text-sm text-text-2 leading-relaxed">
                Essays, philosophical reflections, and historical research are copyrighted by Advaita Chandra, with open citation permitted.
              </p>
            </div>

            <div className="border border-line bg-surface/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-copper font-mono text-xs uppercase tracking-wider mb-3">
                <Camera className="h-4 w-4" aria-hidden="true" />
                <span>Optical Archives</span>
              </div>
              <h3 className="font-display text-lg text-text font-normal">Photography Plates</h3>
              <p className="mt-2 text-sm text-text-2 leading-relaxed">
                Visual contact sheets and photographic works are protected original media. Personal non-commercial display only.
              </p>
            </div>

            <div className="border border-line bg-surface/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-copper font-mono text-xs uppercase tracking-wider mb-3">
                <Code2 className="h-4 w-4" aria-hidden="true" />
                <span>Software Code</span>
              </div>
              <h3 className="font-display text-lg text-text font-normal">Open Source Tools</h3>
              <p className="mt-2 text-sm text-text-2 leading-relaxed">
                Software tools and computational scripts linked to GitHub repositories are governed by their respective open-source licenses.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Detailed Sections */}
        <Reveal y={12} delay={0.05}>
          <div className="border border-line bg-surface/70 p-6 sm:p-10 space-y-10">
            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[01]</span>
                <h2 className="font-display text-xl text-text font-normal">Citation Standards & Fair Use</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                Scholarly critique, quotations, and references to essays or philosophical notes on this site are warmly encouraged under fair use principles, provided accurate attribution is maintained:
              </p>
              <div className="border-l-2 border-copper bg-canvas/60 p-4 font-mono text-xs text-text-2 space-y-1">
                <p className="text-copper">SUGGESTED CITATION FORMAT:</p>
                <p>Chandra, Advaita. &ldquo;[Essay / Note Title]&rdquo;. Advaita Chandra Research Archive, [Publication Year], https://advaitachandra.in/[path].</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[02]</span>
                <h2 className="font-display text-xl text-text font-normal">Photography Usage Restrictions</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                All photographs displayed within the{' '}
                <Link to="/photography" className="text-copper underline underline-offset-4 hover:text-copper-strong">
                  Optical Archives / Photography
                </Link>{' '}
                section are the exclusive intellectual property of Advaita Chandra. Unauthorized commercial reproduction, print sales, stock library scraping, or AI image generator ingestion without prior written authorization is strictly prohibited.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[03]</span>
                <h2 className="font-display text-xl text-text font-normal">Epistemic Disclaimer & Research Accuracy</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                The contents of this website represent independent research, philosophical inquiries, and developmental models. While every effort is made to maintain factual precision and rigorous sourcing, all materials are provided on an &ldquo;as is&rdquo; basis for intellectual discourse.
              </p>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                If you detect a factual inaccuracy, methodological gap, or archival oversight, please submit a correction via the{' '}
                <Link to="/contact" className="text-copper underline underline-offset-4 hover:text-copper-strong">
                  Contact Dispatch
                </Link>
                . Validated corrections will be updated promptly.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[04]</span>
                <h2 className="font-display text-xl text-text font-normal">Acceptable Use & Scraping</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                Visitors agree not to engage in malicious denial-of-service attempts, automated form spamming, or disruptive scraping that violates the directives laid out in our <code>robots.txt</code> file.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[05]</span>
                <h2 className="font-display text-xl text-text font-normal">Governing Law & Legal Venue</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of <strong className="text-text">India</strong>. Any disputes arising out of the use of this website shall be resolved within the appropriate courts situated in India.
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </>
  )
}
