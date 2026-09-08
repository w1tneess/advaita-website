import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { submitContactForm } from '@/lib/supabase/api.js'

const TOPICS = [
  { value: 'general', label: 'General' },
  { value: 'collaboration', label: 'Research & Collaboration' },
  { value: 'project-feedback', label: 'Project Feedback' },
  { value: 'correction', label: 'Correction / Source' },
  { value: 'other', label: 'Other' },
]

const INITIAL_FORM = { name: '', email: '', topic: '', message: '' }
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
        setErrorMessage(
          err?.message ||
            'Something went wrong. Please try again or use an alternative contact method.',
        )
      }
    },
    [form, timeRemaining],
  )

  if (status === 'success') {
    return (
      <motion.div
        className="rounded-xl border border-accent/40 bg-accent/5 p-8 text-center"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <CheckCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">Message dispatched</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted max-w-md mx-auto">
          Thank you for writing. Your note has been logged directly into my correspondence record. I reply to every thoughtful inquiry as time allows.
        </p>
        <div className="mt-6 pt-5 border-t border-line/40 flex justify-center">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="filter-pill filter-pill-active"
          >
            Send another note
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name and Email side-by-side on sm+ */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="contact-name" className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1.5">
            Your Name <span className="text-accent">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
            className={`block w-full rounded-lg border bg-surface/60 px-3.5 py-2.5 text-sm text-ink transition-all placeholder:text-muted/40 focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15 focus:outline-none ${
              errors.name ? 'border-limitation bg-limitation/5' : 'border-line hover:border-ink/20'
            }`}
            placeholder="Advaita Chandra"
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            aria-invalid={errors.name ? 'true' : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1 text-xs text-limitation flex items-center gap-1" role="alert">
              <span aria-hidden="true">›</span> {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium mb-1.5">
            Email Address <span className="text-accent">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            className={`block w-full rounded-lg border bg-surface/60 px-3.5 py-2.5 text-sm text-ink transition-all placeholder:text-muted/40 focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15 focus:outline-none ${
              errors.email ? 'border-limitation bg-limitation/5' : 'border-line hover:border-ink/20'
            }`}
            placeholder="name@institution.edu"
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            aria-invalid={errors.email ? 'true' : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1 text-xs text-limitation flex items-center gap-1" role="alert">
              <span aria-hidden="true">›</span> {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Modern Interactive Topic Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label id="contact-topic-label" className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium">
            Inquiry Topic <span className="text-accent">*</span>
          </label>
          {form.topic && (
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
              Selected
            </span>
          )}
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
                className={`filter-pill text-xs transition-all duration-150 ${
                  isSelected ? 'filter-pill-active scale-[1.02]' : 'hover:border-accent/40'
                }`}
              >
                {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />}
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        {errors.topic && (
          <p id="contact-topic-error" className="mt-1.5 text-xs text-limitation flex items-center gap-1" role="alert">
            <span aria-hidden="true">›</span> {errors.topic}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="contact-message" className="block font-mono text-[11px] uppercase tracking-wider text-muted font-medium">
            Message <span className="text-accent">*</span>
          </label>
          <span className={`font-mono text-[11px] tabular-nums ${
            form.message.length > 1900 ? 'text-limitation' : 'text-muted/60'
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
          className={`block w-full resize-y rounded-lg border bg-surface/60 px-3.5 py-3 text-sm leading-relaxed text-ink transition-all placeholder:text-muted/40 focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/15 focus:outline-none ${
            errors.message ? 'border-limitation bg-limitation/5' : 'border-line hover:border-ink/20'
          }`}
          placeholder="Share your thoughts, recommended readings, or constructive critique..."
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={errors.message ? 'true' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1 text-xs text-limitation flex items-center gap-1" role="alert">
            <span aria-hidden="true">›</span> {errors.message}
          </p>
        )}
      </div>

      {/* Error banner */}
      {status === 'error' && errorMessage && (
        <div
          className="flex items-start gap-3 rounded-lg border border-limitation/40 bg-limitation/10 p-3.5"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-limitation" aria-hidden="true" />
          <p className="text-xs sm:text-sm text-limitation leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Submit footer */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-line/40">
        <button
          type="submit"
          disabled={status === 'submitting' || timeRemaining > 0}
          className="group inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent shadow-subtle transition-all duration-200 hover:bg-accent-strong hover:shadow active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Transmitting…</span>
            </>
          ) : timeRemaining > 0 ? (
            <>
              <Loader2 className="h-4 w-4" aria-hidden="true" />
              <span>Cooldown ({timeRemaining}s)</span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="font-mono text-[11px] text-muted/70 flex items-center gap-1.5">
          <span className="text-accent">🔒</span>
          <span>Logged to private correspondence log</span>
        </p>
      </div>
    </form>
  )
}
