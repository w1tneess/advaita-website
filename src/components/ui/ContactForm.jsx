import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { submitContactForm } from '@/lib/supabase/api.js'

const TOPICS = [
  { value: '', label: 'Select a topic…' },
  { value: 'general', label: 'General' },
  { value: 'project-feedback', label: 'Project Feedback' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'correction', label: 'Correction' },
  { value: 'other', label: 'Other' },
]

const INITIAL_FORM = { name: '', email: '', topic: '', message: '' }

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Contact form with client-side validation and Supabase submission.
 * Includes rate-limiting (30s cooldown between submissions).
 */
export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [lastSubmitTime, setLastSubmitTime] = useState(0)

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target
      setForm((prev) => ({ ...prev, [name]: value }))
      // Clear error on change
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }))
      }
    },
    [errors],
  )

  const validate = useCallback(() => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!form.topic) newErrors.topic = 'Please select a topic'
    if (!form.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters'
    }
    return newErrors
  }, [form])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      // Rate limiting
      const now = Date.now()
      if (now - lastSubmitTime < 30000) {
        setStatus('error')
        setErrorMessage('Please wait 30 seconds before submitting again.')
        return
      }

      const validationErrors = validate()
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

        setStatus('success')
        setLastSubmitTime(Date.now())
        setForm(INITIAL_FORM)
      } catch (err) {
        setStatus('error')
        setErrorMessage(
          err?.message ||
            'Something went wrong. Please try again or use an alternative contact method.',
        )
      }
    },
    [form, validate, lastSubmitTime],
  )

  if (status === 'success') {
    return (
      <motion.div
        className="rounded-xl border border-line bg-surface p-8 text-center shadow-subtle"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CheckCircle className="mx-auto h-10 w-10 text-accent" aria-hidden="true" />
        <h3 className="mt-4 text-lg font-semibold">Message sent</h3>
        <p className="mt-2 text-sm text-muted">
          Thank you for reaching out. I'll get back to you when I can — replies may be slow since
          I'm a student.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-accent underline underline-offset-4 hover:text-accent-strong"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          autoComplete="name"
          className={`mt-1.5 block w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent ${
            errors.name ? 'border-limitation' : 'border-line'
          }`}
          placeholder="Your name"
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          aria-invalid={errors.name ? 'true' : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="mt-1.5 text-xs text-limitation" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          className={`mt-1.5 block w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent ${
            errors.email ? 'border-limitation' : 'border-line'
          }`}
          placeholder="you@example.com"
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="mt-1.5 text-xs text-limitation" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Topic */}
      <div>
        <label htmlFor="contact-topic" className="block text-sm font-medium">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          value={form.topic}
          onChange={handleChange}
          className={`mt-1.5 block w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:ring-1 focus:ring-accent ${
            errors.topic ? 'border-limitation' : 'border-line'
          } ${!form.topic ? 'text-muted/50' : ''}`}
          aria-describedby={errors.topic ? 'contact-topic-error' : undefined}
          aria-invalid={errors.topic ? 'true' : undefined}
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value} disabled={!t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {errors.topic && (
          <p id="contact-topic-error" className="mt-1.5 text-xs text-limitation" role="alert">
            {errors.topic}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          className={`mt-1.5 block w-full resize-y rounded-lg border bg-surface px-3.5 py-2.5 text-sm leading-relaxed transition-colors placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent ${
            errors.message ? 'border-limitation' : 'border-line'
          }`}
          placeholder="What's on your mind?"
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          aria-invalid={errors.message ? 'true' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-xs text-limitation" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Error banner */}
      {status === 'error' && errorMessage && (
        <div
          className="flex items-start gap-3 rounded-lg border border-limitation/30 bg-limitation/5 p-4"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-limitation" aria-hidden="true" />
          <p className="text-sm text-limitation">{errorMessage}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-accent shadow-subtle transition-all hover:bg-accent-strong active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send message
          </>
        )}
      </button>
    </form>
  )
}
