import { LockKeyhole } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '../Button.jsx'

const PASSWORD_HASH = (import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase()
const SESSION_KEY = 'advaita-site.admin-authenticated'

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hasSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

function setSession() {
  try {
    sessionStorage.setItem(SESSION_KEY, 'true')
  } catch {
    return false
  }
  return true
}

export default function AdminAuth({ children }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setAuthenticated(hasSession())
  }, [])

  if (!PASSWORD_HASH) {
    return (
      <AuthShell>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Admin unavailable</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This deployment has no admin password configured. Set{' '}
          <code className="rounded bg-raised px-1.5 py-0.5 text-xs">VITE_ADMIN_PASSWORD_HASH</code>{' '}
          to a SHA-256 password hash before using the admin panel.
        </p>
      </AuthShell>
    )
  }

  if (authenticated) return children

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const matches = (await hashPassword(password)) === PASSWORD_HASH
      if (!matches) {
        setError('That password is not correct.')
        setPassword('')
        return
      }

      setSession()
      setAuthenticated(true)
    } catch {
      setError('The password could not be checked in this browser.')
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <LockKeyhole className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Admin panel</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">Enter the password to continue.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
            autoComplete="current-password"
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'admin-password-error' : undefined}
            className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
          {error && (
            <p id="admin-password-error" className="mt-1.5 text-xs text-limitation" role="alert">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Unlock admin panel
        </Button>
      </form>
    </AuthShell>
  )
}

function AuthShell({ children }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-6 py-12 text-ink">
      <section className="w-full max-w-sm rounded-card border border-line bg-surface p-6 shadow-raised sm:p-8">
        {children}
      </section>
    </main>
  )
}