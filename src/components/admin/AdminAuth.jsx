import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)
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
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <p className="text-sm font-medium text-muted">Checking access...</p>
        </div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!session) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center bg-canvas px-6 py-12 overflow-hidden selection:bg-accent/20">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
          <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent-strong/5 blur-[120px]" />
        </div>

        <Container className="relative z-10 w-full max-w-md animate-rise">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Return to Website
            </Link>
            
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-surface shadow-sm ring-1 ring-white/5">
              <Lock className="h-7 w-7 text-ink" />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Admin Access
            </h1>
            <p className="mt-3 text-sm text-muted">
              Sign in securely to manage your content.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-line bg-surface/80 p-1 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.375rem] border border-line/50 bg-canvas/30 p-6 sm:p-8">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-ink">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
                      <Mail className="h-4.5 w-4.5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      disabled={signingIn}
                      className="block w-full rounded-xl border border-line bg-canvas/50 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted/40 transition-all hover:border-line/80 focus:border-accent focus:bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-ink">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted">
                      <Lock className="h-4.5 w-4.5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      disabled={signingIn}
                      className="block w-full rounded-xl border border-line bg-canvas/50 py-3 pl-11 pr-12 text-sm text-ink placeholder:text-muted/40 transition-all hover:border-line/80 focus:border-accent focus:bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={signingIn}
                      className="absolute inset-y-0 right-0 flex items-center px-3.5 text-muted transition-colors hover:text-ink focus:outline-none disabled:opacity-50"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={signingIn}
                  className="group relative mt-2 w-full overflow-hidden rounded-xl py-3 text-base font-medium shadow-sm"
                >
                  <div className="absolute inset-0 flex items-center justify-center gap-2">
                    {signingIn ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </div>
                  {/* Invisible placeholder to maintain button height */}
                  <div className="invisible flex items-center gap-2">
                    <Loader2 className="h-5 w-5" />
                    <span>Authenticating...</span>
                  </div>
                </Button>
              </form>
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
