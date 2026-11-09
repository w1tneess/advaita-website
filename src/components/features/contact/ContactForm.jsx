import { useState, useCallback, useEffect } from 'react'
import { CONTACT_EMAIL } from '@/config/site.js'
import { motion } from 'framer-motion'
import { Send, AlertCircle, Loader2 } from 'lucide-react'
import { submitContactForm } from '@/lib/supabase/api.js'

const TOPICS = [
  { value: 'general', label: 'General' },
  { value: 'collaboration', label: 'Research or collaboration' },
  { value: 'project-feedback', label: 'Project feedback' },
  { value: 'correction', label: 'Correction or source' },
  { value: 'other', label: 'Other' },
]

const INITIAL_FORM = { name: '', email: '', topic: '', message: '', hp_check: '' }
const RATE_LIMIT_KEY = 'advaita_contact_last_submit'
const RATE_LIMIT_MS = 30000 // 30 seconds

function validateForm(form) {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = 'Name is required'
  } else if (form.name.length > 80) {
    errors.name = 'Name must be 80 characters or fewer'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  if (!form.topic) {
    errors.topic = 'Please select an inquiry topic'
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required'
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters'
  } else if (form.message.trim().length > 2000) {
    errors.message = 'Message must be 2000 characters or fewer'
  }

  return errors
}

/**
 * Modernized contact form with interactive topic chips, responsive grid,
 * real-time character counter, client validation, and Supabase submission.
 */
export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Initialize and tick rate limiting
  useEffect(() => {
    const checkRateLimit = () => {
      try {
        const lastSubmit = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || '0', 10)
        const now = Date.now()
        const elapsed = now - lastSubmit

        if (elapsed < RATE_LIMIT_MS) {
          setTimeRemaining(Math.ceil((RATE_LIMIT_MS - elapsed) / 1000))
        } else {
          setTimeRemaining(0)
        }
      } catch (_) {
        // Ignore localStorage errors (e.g. strict privacy modes)
      }
    }

    checkRateLimit()
    const timer = setInterval(checkRateLimit, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))

      // Clear specific error on change
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors],
  )

  const handleTopicSelect = useCallback(
    (topicValue) => {
      setForm((prev) => ({ ...prev, topic: topicValue }))
      if (errors.topic) {
        setErrors((prev) => ({ ...prev, topic: undefined }))
      }
    },
    [errors.topic],
  )

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      // Honeypot anti-spam check
      if (form.hp_check) {
        setStatus('success')
        setForm(INITIAL_FORM)
        return
      }

      if (timeRemaining > 0) {
        setStatus('error')
        setErrorMessage(`Please wait ${timeRemaining} seconds before submitting again.`)
        return
      }

      const validationErrors = validateForm(form)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setStatus('submitting')
      setErrorMessage('')

      try {
        await submitContactForm({
          name: form.name.trim(),
          email: form.email.trim(),
          topic: form.topic,
          message: form.message.trim(),
        })

        try {
          localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString())
        } catch (_) {
          // Ignore localStorage errors
        }

        setStatus('success')
        setForm(INITIAL_FORM)
      } catch (err) {
        setStatus('error')
        const isNetworkErr =
          err?.message?.includes('Failed to fetch') ||
          err?.message?.includes('NetworkError') ||
          err?.message?.includes('network') ||
          err?.name === 'TypeError'

        setErrorMessage(
          isNetworkErr
            ? `Connection to the message service could not be established (this is often caused by an adblocker or strict privacy shield). You can also write directly to ${CONTACT_EMAIL}.`
            : err?.hint === 'rate_limited'
              ? err.message
              : `Something went wrong. Please try again or reach out directly at ${CONTACT_EMAIL}.`,
        )
      }
    },
    [form, timeRemaining],
  )

  if (status === 'success') {
    return (
      <motion.div
        className="border-t border-line pt-10"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="mark-label" data-ink="fact">received</p>
        <h3 className="mt-4 text-[length:var(--text-3xl)] tracking-[-0.035em]">Message sent</h3>
        <p className="mt-3 max-w-md text-[17px] leading-relaxed text-muted">
          Thank you for writing. I read every message and reply when I can.
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="btn-ink is-ghost"
          >
            Write another
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot field for bot spam deterrence */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-hp" aria-hidden="true">Leave this field blank</label>
        <input
          id="contact-hp"
          type="text"
          name="hp_check"
          value={form.hp_check}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      {/* Name and Email side-by-side on sm+ */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block text-[14px] text-muted mb-1.5">
            Name <span className="text-accent" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            spellCheck={false}
            className={`block w-full rounded-[6px] border bg-surface px-3.5 py-3 text-base text-text transition duration-250 ease-[var(--ease-out-quart)] placeholder:text-text-3/40 focus:border-ink focus:bg-canvas focus:-translate-y-0.5 focus:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/30 ${
              errors.name ? 'border-accent' : 'border-line hover:border-line-strong'
            }`}
            placeholder="Advaita Chandra"
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1 text-[14px] text-accent flex items-center gap-1" role="alert">
              <span aria-hidden="true">›</span> {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block text-[14px] text-muted mb-1.5">
            Email <span className="text-accent" aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            spellCheck={false}
            className={`block w-full rounded-[6px] border bg-surface px-3.5 py-3 text-base text-text transition duration-250 ease-[var(--ease-out-quart)] placeholder:text-text-3/40 focus:border-ink focus:bg-canvas focus:-translate-y-0.5 focus:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/30 ${
              errors.email ? 'border-accent' : 'border-line hover:border-line-strong'
            }`}
            placeholder="name@institution.edu"
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1 text-[14px] text-accent flex items-center gap-1" role="alert">
              <span aria-hidden="true">›</span> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Modern Interactive Topic Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label id="contact-topic-label" className="block text-[14px] text-muted">
            Topic <span className="text-accent" aria-hidden="true">*</span>
          </label>
        </div>

        <div
          role="radiogroup"
          aria-labelledby="contact-topic-label"
          className="flex flex-wrap gap-2"
        >
          {TOPICS.map((t) => {
            const isSelected = form.topic === t.value
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleTopicSelect(t.value)}
                className={`px-3 py-2 border rounded-[6px] text-[14px] transition-colors duration-150 active:scale-[0.98] cursor-pointer ${
                  isSelected
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-line text-muted hover:border-line-strong hover:text-ink'
                }`}
              >
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {errors.topic && (
          <p id="contact-topic-error" className="mt-1.5 text-[14px] text-accent flex items-center gap-1" role="alert">
            <span aria-hidden="true">›</span> {errors.topic}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="contact-message" className="block text-[14px] text-muted">
            Message <span className="text-accent" aria-hidden="true">*</span>
          </label>
          <span className={`text-[13px] tabular-nums ${
            form.message.length > 1900 ? 'text-limitation' : 'text-text-3'
          }`}>
            {form.message.length} / 2000
          </span>
        </div>

        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          autoComplete="off"
          spellCheck={true}
          className={`block w-full resize-y rounded-[6px] border bg-surface px-3.5 py-3 text-base leading-relaxed text-text transition duration-250 ease-[var(--ease-out-quart)] placeholder:text-text-3/40 focus:border-ink focus:bg-canvas focus:-translate-y-0.5 focus:shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/30 ${
            errors.message ? 'border-accent' : 'border-line hover:border-line-strong'
          }`}
          placeholder="Share your perspectives, research inquiries, recommended readings, or constructive critique…"
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={errors.message ? 'true' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 text-[14px] text-accent flex items-center gap-1" role="alert">
            <span aria-hidden="true">›</span> {errors.message}
          </p>
        )}
      </div>

      {/* Error banner */}
      {status === 'error' && errorMessage && (
        <div
          className="flex items-start gap-3 border-l-2 border-accent pl-4 py-1"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-[15px] text-ink leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Submit footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-line">
        <button
          type="submit"
          disabled={status === 'submitting' || timeRemaining > 0}
          className="btn-ink mt-6 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? (
            <>
              <span>Sending…</span>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            </>
          ) : timeRemaining > 0 ? (
            <>
              <span>Cooldown ({timeRemaining}s)</span>
              <Loader2 className="h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <span>Send</span>
              <Send className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="text-[14px] text-text-3">Only I read these.</p>
      </div>
    </form>
  )
}
