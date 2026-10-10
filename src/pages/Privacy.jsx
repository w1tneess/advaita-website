import PageHeader from '@/components/ui/PageHeader.jsx'
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
        eyebrow="Legal"
        title="Privacy Policy."
        lead="A transparent statement on data minimization, correspondence handling, and sovereign visitor privacy."
      />

      <div className="shell pb-24 md:pb-32 space-y-12 md:space-y-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-surface p-8 border-t border-ink">
            <div className="flex items-center gap-2 text-muted font-utility mb-4">
              <EyeOff className="h-4 w-4" aria-hidden="true" />
              <span>Zero Trackers</span>
            </div>
            <h3 className="text-2xl text-ink font-normal">No Commercial Analytics</h3>
            <p className="mt-4 text-base font-sans text-muted leading-relaxed">
              This website does not load Google Analytics, Meta Pixel, tracking beacons, or cross-site fingerprinting scripts.
            </p>
          </div>

          <div className="bg-surface p-8 border-t border-ink">
            <div className="flex items-center gap-2 text-muted font-utility mb-4">
              <Lock className="h-4 w-4" aria-hidden="true" />
              <span>Encrypted Transit</span>
            </div>
            <h3 className="text-2xl text-ink font-normal">Strict HTTPS Enforced</h3>
            <p className="mt-4 text-base font-sans text-muted leading-relaxed">
              All transmissions, assets, and correspondence dispatches are protected in transit with high-grade TLS encryption and HSTS headers.
            </p>
          </div>

          <div className="bg-surface p-8 border-t border-ink">
            <div className="flex items-center gap-2 text-muted font-utility mb-4">
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span>Data Sovereignty</span>
            </div>
            <h3 className="text-2xl text-ink font-normal">No Secondary Sales</h3>
            <p className="mt-4 text-base font-sans text-muted leading-relaxed">
              Your email address and correspondence are never sold, rented, monetized, or fed into automated marketing funnels.
            </p>
          </div>
        </div>

        <div className="bg-surface p-8 sm:p-12 space-y-12">
          <section className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">01</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Information Collected & Purpose</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              We collect information strictly when you voluntarily provide it through the{' '}
              <Link to="/contact" className="text-ink underline underline-offset-4 hover:text-muted">
                Contact Dispatch Form
              </Link>
              . This includes your name, email address, inquiry topic, and message content.
            </p>
            <p className="text-base font-sans text-muted leading-relaxed">
              <strong className="text-ink font-semibold">Purpose:</strong> This information is used solely to respond to your specific intellectual inquiry, academic collaboration, or source critique.
            </p>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">02</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Storage & Security Infrastructure</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              Correspondence entries are stored in a dedicated, access-controlled Supabase database protected by Row-Level Security (RLS). Only authenticated site administrators have read access to incoming messages.
            </p>
            <p className="text-base font-sans text-muted leading-relaxed">
              Static website files and pre-rendered pages are served via edge CDN infrastructure with strict security headers (Content-Security-Policy, X-Content-Type-Options, X-Frame-Options).
            </p>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">03</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Local Storage & Cookies</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              This site does not use persistent tracking cookies. We utilize browser <code className="bg-line px-1.5 py-0.5 rounded text-sm font-utility text-ink">localStorage</code> exclusively for essential operational parameters:
            </p>
            <ul className="space-y-2 text-base font-sans text-muted pl-4 border-l border-line">
              <li>• <code className="bg-line px-1.5 py-0.5 rounded text-ink font-utility">advaita_contact_last_submit</code>: 30-second cooldown timestamp to prevent accidental double-submits and bot spam.</li>
              <li>• <code className="bg-line px-1.5 py-0.5 rounded text-ink font-utility">advaita-site.cookie-consent</code>: Remembers that you acknowledged the essential storage notice so the banner does not reappear.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">04</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Your Data Rights & Deletion</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              You retain full sovereignty over your communications. If you have previously submitted an inquiry and wish to review, update, or permanently purge your message from the correspondence database, simply dispatch a note via the{' '}
              <Link to="/contact" className="text-ink underline underline-offset-4 hover:text-muted">
                contact interface
              </Link>{' '}
              with the subject &ldquo;Data Purge Request&rdquo;. Records will be removed promptly.
            </p>
          </section>

          <section className="space-y-3 pt-8 border-t border-line">
            <div className="flex items-baseline gap-3">
              <span className="font-utility text-muted">05</span>
              <h2 className="text-2xl sm:text-3xl text-ink font-normal">Jurisdiction & Governing Law</h2>
            </div>
            <p className="text-base font-sans text-muted leading-relaxed">
              This site operates as an independent, non-commercial academic research archive headquartered in and governed under the sovereign jurisdiction of <strong className="text-ink font-semibold">India</strong>.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
