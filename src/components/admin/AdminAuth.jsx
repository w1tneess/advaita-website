import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Loader2, Mail, AlertTriangle } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../../lib/supabase/client.js'
import Button from '../ui/Button.jsx'
import PasswordInput from '../ui/PasswordInput.jsx'
import { useToast } from '../../lib/toast.jsx'

/**
 * Real Supabase authentication for admin panel.
 * Requires email/password login.
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
  const toast = useToast()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const isConfigured = isSupabaseConfigured()

  // Check auth on mount
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription?.unsubscribe()
  }, [isConfigured])

  const handleSignIn = async (e) => {
    e.preventDefault()

    if (!isConfigured) {
      toast.error('Supabase is not configured. Please set your credentials in .env.local.')
      return
    }

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

  const handleSignOut = useCallback(async () => {
    try {
      if (isConfigured) {
        await supabase.auth.signOut()
      }
      setSession(null)
      toast.success('Logged out')
    } catch (_error) {
      toast.error('Logout failed')
    }
  }, [isConfigured, toast])

  const contextValue = useMemo(
    () => ({
      session,
      logout: handleSignOut,
    }),
    [session, handleSignOut],
  )

  const handleForgotPassword = () => {
    toast.info('To reset your admin password, use your Supabase project dashboard.')
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
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-canvas p-6 overflow-hidden selection:bg-accent/20">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center mix-blend-screen opacity-50">
          <div
            className="absolute top-[10%] left-[20%] h-[400px] w-[400px] rounded-full bg-accent/20 blur-[120px] animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          <div
            className="absolute bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-accent-strong/10 blur-[120px] animate-pulse"
            style={{ animationDuration: '6s', animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[440px] animate-rise flex flex-col items-center">
          {/* Logo Area */}
          <div className="mb-10 flex flex-col items-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
              <div
                className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-accent/40 to-white/20 blur-xl animate-pulse"
                style={{ animationDuration: '4s' }}
              />

              <div className="relative flex h-full w-full items-center justify-center rounded-[1.25rem] border border-white/10 bg-surface shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white drop-shadow-md"
                >
                  <circle cx="12" cy="16" r="8" stroke="url(#logo-grad)" strokeWidth="1.5" />
                  <circle cx="20" cy="16" r="8" stroke="url(#logo-grad)" strokeWidth="1.5" />
                  <circle cx="16" cy="16" r="2" fill="url(#logo-grad)" />
                  <defs>
                    <linearGradient
                      id="logo-grad"
                      x1="4"
                      y1="16"
                      x2="28"
                      y2="16"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#ffffff" />
                      <stop offset="1" stopColor="var(--color-accent, #64748b)" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-ink">Advaita</h1>
            <p className="mt-2 text-sm text-muted">Sign in to workspace</p>
          </div>

          {/* Configuration Warning Notice if Supabase is unconfigured */}
          {!isConfigured && (
            <div className="mb-6 w-full rounded-2xl border border-opinion/30 bg-opinion/10 p-4 text-xs text-opinion flex items-start gap-3 backdrop-blur-md">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink">Supabase unconfigured</p>
                <p className="mt-1 text-muted">
                  Set <code className="font-mono text-opinion">VITE_SUPABASE_URL</code> and{' '}
                  <code className="font-mono text-opinion">VITE_SUPABASE_ANON_KEY</code> in{' '}
                  <code className="font-mono text-opinion">.env.local</code> to connect authentication.
                </p>
              </div>
            </div>
          )}

          {/* Glassmorphic Login Card */}
          <div className="w-full rounded-3xl border border-white/[0.08] bg-surface/40 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <form onSubmit={handleSignIn} className="space-y-6 relative z-10">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-ink">
                  Email
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted group-focus-within:text-accent transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={signingIn}
                    className="block w-full rounded-xl border border-line bg-canvas/50 py-3.5 pl-12 pr-4 text-sm text-ink placeholder:text-muted/40 transition-all hover:border-line/80 focus:border-accent focus:bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 shadow-inner"
                  />
                </div>
              </div>

              {/* Password Field */}
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={signingIn}
              />

              {/* Extras */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer h-4.5 w-4.5 appearance-none rounded-md border border-line bg-canvas/50 checked:border-accent checked:bg-accent transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/40 focus:ring-offset-2 focus:ring-offset-surface"
                    />
                    <svg
                      className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      viewBox="0 0 14 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 5L4.5 8.5L13 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-muted group-hover:text-ink transition-colors">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-muted hover:text-ink transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={signingIn}
                  className="w-full rounded-xl py-3.5 text-base font-medium shadow-lg transition-all active:scale-[0.98] relative overflow-hidden group border border-white/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  {signingIn ? (
                    <span className="flex items-center justify-center gap-2 relative z-10">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <span className="relative z-10">Log In</span>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <Link
            to="/"
            className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink bg-surface/50 px-4 py-2 rounded-full border border-line/50 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to public site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AdminAuthContext.Provider value={contextValue}>
      {children}
    </AdminAuthContext.Provider>
  )
}
