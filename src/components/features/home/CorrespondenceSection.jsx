import { useState } from 'react'
import { CONTACT_EMAIL } from '@/config/site.js'
import { Link } from 'react-router'
import { ArrowRight, ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { submitContactForm } from '@/lib/supabase/api.js'

const RATE_LIMIT_KEY = 'advaita_contact_last_submit'
const RATE_LIMIT_MS = 30000

export default function CorrespondenceSection({ publicSocialLinks = [] }) {
  const links = (publicSocialLinks || []).filter((l) => l.url && l.kind !== 'email')

  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: 'General Inquiry',
    message: '',
    readingRef: '',
    hp_check: '',
  })
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.hp_check) {
      setStatus('success')
      setFeedback('Message sent. Thank you for taking the time to write.')
      return
    }

    try {
      const lastSubmit = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0', 10)
      const elapsed = Date.now() - lastSubmit
      if (elapsed < RATE_LIMIT_MS) {
        const waitSec = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000)
        setStatus('error')
        setFeedback(`Please wait ${waitSec}s before sending another dispatch.`)
        return
      }
    } catch (_) {
      /* ignore localStorage access errors */
    }

    if (!form.message.trim()) {
      setFeedback('Please enter a note or message.')
      return
    }

    if (form.message.trim().length < 5) {
      setFeedback('Message is too short (minimum 5 characters).')
      return
    }

    if (form.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!emailRegex.test(form.email.trim())) {
        setFeedback('Please enter a valid email address.')
        return
      }
    }

    setStatus('submitting')
    setFeedback('')
    try {
      const finalMessage = form.readingRef.trim()
        ? `${form.message.trim()}\n\n[Reference/Link]: ${form.readingRef.trim().slice(0, 200)}`
        : form.message.trim()

      await submitContactForm({
        name: form.name.trim() || 'Anonymous Reader',
        email: form.email.trim(),
        topic: form.topic,
        message: finalMessage,
      })

      try {
        localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString())
      } catch (_) {
        /* ignore localStorage write errors */
      }

      setStatus('success')
      setFeedback('Message sent. Thank you for taking the time to write.')
      setForm({
        name: '',
        email: '',
        topic: 'General Inquiry',
        message: '',
        readingRef: '',
        hp_check: '',
      })
    } catch (err) {
      setStatus('error')
      const isNetworkErr =
        err?.message?.includes('Failed to fetch') ||
        err?.message?.includes('NetworkError') ||
        err?.message?.includes('network') ||
        err?.name === 'TypeError'

      setFeedback(
        err?.hint === 'rate_limited'
          ? err.message
          : isNetworkErr
          ? `Notice: Could not connect to transmission service (possibly blocked by an adblocker or privacy shield). You can write directly to ${CONTACT_EMAIL}.`
          : `Notice: Message could not be sent right now. You can also reach me directly at ${CONTACT_EMAIL}.`,
      )
    }
  }

  return (
    <section className="shell py-[var(--spacing-fluid-section)]" id="correspondence">
      <div className="w-full border-t border-line mb-[var(--spacing-fluid-xl)]" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-fluid-lg)] items-start">
        <div className="space-y-[var(--spacing-fluid-md)]">
          <div>
            <span className="font-utility text-muted block mb-3">Get in Touch</span>
            <h2 className="text-[length:var(--text-4xl)] font-normal text-ink leading-[1.1] text-balance">
              Questions, corrections, or book recommendations.
            </h2>
          </div>

          <p className="text-lg text-muted leading-relaxed max-w-xl">
            I appreciate constructive feedback and book recommendations. If you spot an error in my
            data, a missing citation, or want to discuss any of the topics here, please write
            directly.
          </p>

          <div className="max-w-xl space-y-4 pt-6 border-t border-line">
            <div className="flex items-center justify-between font-utility">
              <span className="text-ink">Location</span>
              <span className="text-muted">India</span>
            </div>
            <div className="flex items-center justify-between font-utility">
              <span className="text-ink">Response Time</span>
              <span className="text-muted">Within ~24–48 hours</span>
            </div>
          </div>

          <div className="pt-6 border-t border-line max-w-xl">
            <h3 className="font-utility text-ink mb-4">Direct Channels</h3>
            <div className="flex flex-wrap gap-6 font-utility">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="text-ink border-b border-line hover:border-ink hover:text-muted active:opacity-80 transition-all duration-150 ease-[var(--ease-out-quart)] flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas pb-1"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              ))}
              <Link
                to="/contact"
                className="text-ink border-b border-line hover:border-ink hover:text-muted active:opacity-80 transition-all duration-150 ease-[var(--ease-out-quart)] flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas pb-1"
              >
                <span>Full Form</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-normal text-ink mb-2">Send a Message</h3>
            <p className="text-sm text-muted">Fields marked with * are required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="hidden" aria-hidden="true">
              <label htmlFor="contact-hp-home">Leave blank</label>
              <input
                id="contact-hp-home"
                type="text"
                name="hp_check"
                value={form.hp_check}
                onChange={(e) => setForm({ ...form, hp_check: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="contact-topic" className="font-utility text-ink block mb-2">
                Topic of Inquiry
              </label>
              <select
                id="contact-topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                autoComplete="off"
                className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                {[
                  'General Inquiry',
                  'Correction / Citation',
                  'Book Recommendation',
                  'Project Discussion',
                ].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact-sender-name" className="font-utility text-ink block mb-2">
                  Your Name
                </label>
                <input
                  id="contact-sender-name"
                  type="text"
                  maxLength={80}
                  placeholder="Anonymous Reader"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="name"
                  spellCheck={false}
                  className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                />
              </div>
              <div>
                <label htmlFor="contact-sender-email" className="font-utility text-ink block mb-2">
                  Email Address
                </label>
                <input
                  id="contact-sender-email"
                  type="email"
                  inputMode="email"
                  maxLength={120}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                  spellCheck={false}
                  className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="font-utility text-ink block mb-2">
                Message *
              </label>
              <textarea
                id="contact-message"
                rows={5}
                maxLength={2000}
                placeholder="What's on your mind?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                autoComplete="off"
                spellCheck={true}
                className="w-full bg-surface border border-line p-4 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              />
            </div>

            <div>
              <label htmlFor="contact-reading-ref" className="font-utility text-ink block mb-2">
                Recommended Reading/Link (Optional)
              </label>
              <input
                id="contact-reading-ref"
                type="text"
                inputMode="url"
                maxLength={200}
                placeholder="https://…"
                value={form.readingRef}
                onChange={(e) => setForm({ ...form, readingRef: e.target.value })}
                autoComplete="url"
                spellCheck={false}
                className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              />
            </div>

            {feedback && (
              <p
                className={`text-base font-utility mt-4 ${status === 'success' ? 'text-ink' : 'text-limitation'}`}
              >
                {feedback}
              </p>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center gap-2 bg-ink text-canvas px-8 py-3 rounded-md font-utility hover:bg-white/20 hover:text-ink active:scale-[0.97] active:opacity-80 disabled:opacity-50 transition-all duration-250 ease-[var(--ease-out-quart)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas shadow-subtle"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending…</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Sent</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
