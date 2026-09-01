import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '../../lib/supabase/client.js'
import Button from '../Button.jsx'
import Container from '../Container.jsx'
import { useToast } from '../../lib/toast.jsx'

/**
 * Real Supabase authentication for admin panel.
 * Requires email/password login. No demo access.
 */

const AdminAuthContext = createContext(null)

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used inside AdminAuth provider')
  }
  return context
}

export default function AdminAuth({ children }) {
  const _navigate = useNavigate()
  const toast = useToast()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signingIn, setSigningIn] = useState(false)

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleSignIn = async (e) => {
    e.preventDefault()
    setSigningIn(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Login failed')
        return
      }

      toast.success('Logged in!')
      setEmail('')
      setPassword('')
    } catch (_error) {
      toast.error('An error occurred')
    } finally {
      setSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out')
    } catch (_error) {
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    )
  }

  // Show login if not authenticated
  if (!session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas px-6 py-12">
        <Container className="w-full max-w-md">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-ink">Admin Panel</h1>
              <p className="mt-2 text-sm text-muted">Sign in to manage content</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={signingIn}
                  className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={signingIn}
                  className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-canvas"
                />
              </div>

              <Button type="submit" disabled={signingIn} className="w-full">
                {signingIn ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="space-y-2 rounded-lg border border-line bg-raised p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Authentication
              </p>
              <p className="text-sm text-muted">
                This admin panel requires real Supabase authentication. Only authorized users can
                access.
              </p>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  // Show admin panel with logout button
  return (
    <AdminAuthContext.Provider
      value={{
        session,
        logout: handleSignOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
