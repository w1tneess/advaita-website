import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Loader2, Mail, Shield, AlertTriangle, LogIn, Laptop } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../../lib/supabase/client.js'
import PasswordInput from '../ui/PasswordInput.jsx'
import { useToast } from '../../lib/toast.jsx'

const AdminAuthContext = createContext(null)
const LOCAL_AUTH_KEY = 'advaita-site.local-auth'

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
  const [submitting, setSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const isConfigured = isSupabaseConfigured()

  // Check auth on mount (both Supabase session and Local session)
  useEffect(() => {
    // 1. Check local offline mode session (development only)
    if (import.meta.env.DEV) {
      try {
        const localStored = localStorage.getItem(LOCAL_AUTH_KEY) || sessionStorage.getItem(LOCAL_AUTH_KEY)
        if (localStored) {
          const parsed = JSON.parse(localStored)
          if (parsed?.user) {
            setSession(parsed)
            setLoading(false)
            return
          }
        }
      } catch (_) {
        // Ignore storage access error
      }
    }

    // 2. If Supabase is unconfigured, finish loading
    if (!isConfigured) {
      setLoading(false)
      return
    }

    // 3. Check active Supabase session
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          setSession(session)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session)
      }
    })

    return () => subscription?.unsubscribe()
  }, [isConfigured])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()

    if (!isConfigured) {
      toast.error('Supabase is not configured.')
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Login failed')
        return
      }

      if (data?.session) {
        setSession(data.session)
        toast.success('Signed in to workspace!')
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      toast.error('Authentication error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnterLocalMode = () => {
    const localSession = {
      user: { email: 'local-admin@advaita.local', id: 'local-admin' },
      isLocalMode: true,
      created_at: new Date().toISOString(),
    }
    try {
      if (rememberMe) {
        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localSession))
      } else {
        sessionStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(localSession))
      }
    } catch (_) {
      // Ignore storage access error
    }
    setSession(localSession)
    toast.success('Entered Local Mode. All edits save locally.')
  }

  const handleSignOut = useCallback(async () => {
    try {
      try {
        localStorage.removeItem(LOCAL_AUTH_KEY)
        sessionStorage.removeItem(LOCAL_AUTH_KEY)
      } catch (_) {
        // Ignore storage access error
      }

      if (isConfigured) {
        await supabase.auth.signOut()
      }
      setSession(null)
      toast.success('Signed out')
    } catch (_error) {
      toast.error('Sign out failed')
    }
  }, [isConfigured, toast])

  const contextValue = useMemo(
    () => ({
      session,
      isLocalMode: !!session?.isLocalMode,
      logout: handleSignOut,
    }),
    [session, handleSignOut],
  )

  const handleForgotPassword = () => {
    toast.info('To reset your admin password, use your Supabase Project Dashboard → Authentication → Users.')
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0F0F0F] px-6 text-[#E8E6E1]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-7 w-7 animate-spin text-[#D1B18A]" />
          <p className="font-mono text-xs tracking-wider uppercase text-neutral-400">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Render Login Card if not authenticated
  if (!session) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#0F0F0F] p-6 text-[#E8E6E1] overflow-hidden selection:bg-[#D1B18A]/20">
        {/* Subtle Darkroom Glow */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-30">
          <div className="h-[450px] w-[450px] rounded-full bg-[#D1B18A]/10 blur-[130px]" />
        </div>

        <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
          {/* Brand Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#292a2a] bg-[#141616] text-[#D1B18A] shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-light tracking-tight text-[#E8E6E1]">
              Advaita <span className="italic text-[#D1B18A]">Workspace</span>
            </h1>
            <p className="mt-1 font-mono text-xs tracking-wider uppercase text-neutral-400">
              Content Studio &amp; Archival Terminal
            </p>
          </div>

          {/* Unconfigured Alert (Development only) */}
          {!isConfigured && import.meta.env.DEV && (
            <div className="mb-6 w-full rounded-xl border border-[#D1B18A]/30 bg-[#D1B18A]/5 p-4 text-xs text-neutral-300 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#D1B18A] mt-0.5" />
              <div>
                <p className="font-semibold text-[#E8E6E1]">Supabase Unconfigured</p>
                <p className="mt-1 text-neutral-400">
                  You can enter <strong className="text-[#D1B18A]">Local Mode</strong> to view and edit content offline, or connect credentials in <code className="font-mono text-[#D1B18A]">.env.local</code>.
                </p>
              </div>
            </div>
          )}

          {/* Auth Card */}
          <div className="w-full rounded-2xl border border-[#242626] bg-[#121414] p-7 sm:p-9 shadow-2xl relative">
            <form onSubmit={handleAuthSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@domain.org"
                    required
                    disabled={submitting}
                    className="block w-full rounded-lg border border-[#292a2a] bg-[#191b1b] py-2.5 pl-10 pr-4 text-sm text-[#E8E6E1] placeholder:text-neutral-600 focus:border-[#D1B18A] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-password" className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5">
                  Password
                </label>
                <PasswordInput
                  id="auth-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-[#292a2a] bg-[#191b1b] text-[#D1B18A] focus:ring-0 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-neutral-400">Remember session</span>
                </label>

                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="font-mono text-xs text-neutral-500 hover:text-[#D1B18A] transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={submitting || !isConfigured}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#D1B18A] bg-[#D1B18A] py-3 text-xs font-mono uppercase tracking-wider text-[#0F0F0F] font-semibold transition-all hover:bg-[#c4a279] active:scale-[0.99] disabled:opacity-40 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Sign In to Studio</span>
                    </>
                  )}
                </button>

                {/* Local Mode Alternative (Development only) */}
                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={handleEnterLocalMode}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#292a2a] bg-[#191b1b] py-2.5 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:border-[#D1B18A] hover:text-[#E8E6E1] transition-all cursor-pointer"
                  >
                    <Laptop className="h-3.5 w-3.5 text-[#D1B18A]" />
                    <span>Continue in Local Mode (Dev Only)</span>
                  </button>
                )}
              </div>
            </form>
          </div>

          <Link
            to="/"
            className="group mt-8 inline-flex items-center gap-2 font-mono text-xs text-neutral-500 hover:text-[#E8E6E1] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
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
