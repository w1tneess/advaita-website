import PageHeader from '@/components/ui/PageHeader.jsx'
import Reveal from '@/components/ui/Reveal.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { Link } from 'react-router'
import { Shield, Lock, EyeOff } from 'lucide-react'

export default function Privacy() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="Privacy policy and data minimization practices for Advaita Chandra's research archive."
        path="/privacy"
      />

      <PageHeader
        eyebrow="LEGAL & COMPLIANCE // 01"
        registry="SYS.REG: PRIVACY-2026"
        title="Privacy Policy."
        lead="A transparent statement on data minimization, correspondence handling, and sovereign visitor privacy."
      >
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-3">
          <span className="text-copper">POLICY //</span>
          <span className="border border-line bg-surface px-2.5 py-0.5 text-[11px] text-text-2">
            ZERO-TRACKING ARCHITECTURE
          </span>
          <span className="text-line-strong">|</span>
          <span className="text-copper font-medium">JURISDICTION: INDIA</span>
          <span className="text-line-strong">|</span>
          <span className="text-text-3">LAST REVISED: 2026</span>
        </div>
      </PageHeader>

      <div className="shell pb-24 md:pb-32 space-y-12 md:space-y-16">
        {/* Core Principles Grid */}
        <Reveal y={12}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border border-line bg-surface/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-copper font-mono text-xs uppercase tracking-wider mb-3">
                <EyeOff className="h-4 w-4" aria-hidden="true" />
                <span>Zero Trackers</span>
              </div>
              <h3 className="font-display text-lg text-text font-normal">No Commercial Analytics</h3>
              <p className="mt-2 text-sm text-text-2 leading-relaxed">
                This website does not load Google Analytics, Meta Pixel, tracking beacons, or cross-site fingerprinting scripts.
              </p>
            </div>

            <div className="border border-line bg-surface/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-copper font-mono text-xs uppercase tracking-wider mb-3">
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>Encrypted Transit</span>
              </div>
              <h3 className="font-display text-lg text-text font-normal">Strict HTTPS Enforced</h3>
              <p className="mt-2 text-sm text-text-2 leading-relaxed">
                All transmissions, assets, and correspondence dispatches are protected in transit with high-grade TLS encryption and HSTS headers.
              </p>
            </div>

            <div className="border border-line bg-surface/80 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-copper font-mono text-xs uppercase tracking-wider mb-3">
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Data Sovereignty</span>
              </div>
              <h3 className="font-display text-lg text-text font-normal">No Secondary Sales</h3>
              <p className="mt-2 text-sm text-text-2 leading-relaxed">
                Your email address and correspondence are never sold, rented, monetized, or fed into automated marketing funnels.
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
                <h2 className="font-display text-xl text-text font-normal">Information Collected & Purpose</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                We collect information strictly when you voluntarily provide it through the{' '}
                <Link to="/contact" className="text-copper underline underline-offset-4 hover:text-copper-strong">
                  Contact Dispatch Form
                </Link>
                . This includes your name, email address, inquiry topic, and message content.
              </p>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                <strong>Purpose:</strong> This information is used solely to respond to your specific intellectual inquiry, academic collaboration, or source critique.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[02]</span>
                <h2 className="font-display text-xl text-text font-normal">Storage & Security Infrastructure</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                Correspondence entries are stored in a dedicated, access-controlled Supabase database protected by Row-Level Security (RLS). Only authenticated site administrators have read access to incoming messages.
              </p>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                Static website files and pre-rendered pages are served via edge CDN infrastructure with strict security headers (Content-Security-Policy, X-Content-Type-Options, X-Frame-Options).
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[03]</span>
                <h2 className="font-display text-xl text-text font-normal">Local Storage & Cookies</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                This site does not use persistent tracking cookies. We utilize browser <code>localStorage</code> exclusively for essential operational parameters:
              </p>
              <ul className="space-y-2 font-mono text-xs text-text-3 pl-4 border-l border-copper/40">
                <li>• <code>advaita_contact_last_submit</code>: 30-second cooldown timestamp to prevent accidental double-submits and bot spam.</li>
                <li>• <code>advaita-site.cookie-consent</code>: Remembers that you acknowledged the essential storage notice so the banner does not reappear.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[04]</span>
                <h2 className="font-display text-xl text-text font-normal">Your Data Rights & Deletion</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                You retain full sovereignty over your communications. If you have previously submitted an inquiry and wish to review, update, or permanently purge your message from the correspondence database, simply dispatch a note via the{' '}
                <Link to="/contact" className="text-copper underline underline-offset-4 hover:text-copper-strong">
                  contact interface
                </Link>{' '}
                with the subject &ldquo;Data Purge Request&rdquo;. Records will be removed promptly.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3 pt-8 border-t border-line">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-copper">[05]</span>
                <h2 className="font-display text-xl text-text font-normal">Jurisdiction & Governing Law</h2>
              </div>
              <p className="text-sm sm:text-base text-text-2 leading-relaxed">
                This site operates as an independent, non-commercial academic research archive headquartered in and governed under the sovereign jurisdiction of <strong className="text-text">India</strong>.
              </p>
            </section>
          </div>
        </Reveal>
      </div>
    </>
  )
}
