import { LockKeyhole } from 'lucide-react'
import { createContext, useContext, useState } from 'react'

import Button from '../Button.jsx'

const SESSION_KEY = 'advaita-site.admin-authenticated'
const AdminAuthContext = createContext(null)

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

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used inside AdminAuth')
  return context
}

export default function AdminAuth({ children }) {
  const [authenticated, setAuthenticated] = useState(hasSession)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (authenticated) {
    return (
      <AdminAuthContext.Provider
        value={{
          logout() {
            try {
              sessionStorage.removeItem(SESSION_KEY)
            } catch {}
            setAuthenticated(false)
          },
        }}
      >
        {children}
      </AdminAuthContext.Provider>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      if (!password.trim()) throw new Error('empty password')
      setSession()
      setAuthenticated(true)
    } catch {
      setError('Enter a password to unlock this local editor.')
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
        <LockKeyhole className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">Admin panel</h1>
      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">Local editor access only. This does not secure GitHub or the published site.</p>

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
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
          {error && (
            <p id="admin-password-error" className="mt-1.5 text-xs text-danger" role="alert">
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
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-6 py-12 text-foreground">
      <section className="w-full max-w-sm rounded-card border border-border bg-surface p-6 shadow-raised sm:p-8">
        {children}
      </section>
    </main>
  )
}