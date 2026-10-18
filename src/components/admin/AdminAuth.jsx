import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Loader2, Mail, Shield, AlertTriangle, LogIn, KeyRound, CheckCircle2 } from 'lucide-react'

import { supabase, isSupabaseConfigured } from '../../lib/supabase/client.js'
import PasswordInput from '../ui/PasswordInput.jsx'
import { useToast } from '../../lib/toast'
import { useContent } from '../../lib/content.jsx'

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
  const { reloadContent } = useContent()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('signin') // 'signin' | 'forgot' | 'recovery'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const isConfigured = isSupabaseConfigured()

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  // Verify active Supabase session on mount & check for recovery hash
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return
    }

    let isMounted = true

    // Check if URL hash indicates a password recovery callback
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setMode('recovery')
    }

    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          // Validate session with the server via getUser() to prevent local session spoofing
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          if (isMounted) {
            if (user && !userError) {
              setSession(session)
            } else {
              setSession(null)
            }
          }
        } else if (isMounted) {
          setSession(null)
        }
      } catch (error) {
        console.error('Auth verification error:', error)
        if (isMounted) setSession(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return
      if (event === 'PASSWORD_RECOVERY') {
        setMode('recovery')
        setSession(session || null)
      } else {
        setSession(session || null)
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [isConfigured])

  // Visitors hold the draft-free public copy; once signed in, load the full row to edit.
  const userId = session?.user?.id
  useEffect(() => {
    if (userId) reloadContent({ full: true })
  }, [userId, reloadContent])

  const handleAuthSubmit = async (e) => {
    e.preventDefault()

    if (!isConfigured) {
      toast.error('Authentication service is unavailable.')
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        toast.error(error.message || 'Authentication failed')
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

  const handleForgotSubmit = async (e) => {
    e.preventDefault()

    if (!isConfigured) {
      toast.error('Authentication service is unavailable.')
      return
    }

    const cleanEmail = email.trim()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      toast.error('Please provide a valid email address.')
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/admin`,
      })

      if (error) {
        toast.error(error.message || 'Failed to send recovery email.')
      } else {
        setResetSent(true)
        setCooldown(60)
        toast.success('Recovery link sent! Please check your email inbox.')
      }
    } catch (err) {
      toast.error('Password reset error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRecoverySubmit = async (e) => {
    e.preventDefault()

    if (!isConfigured) {
      toast.error('Authentication service is unavailable.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters in length.')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match. Please verify.')
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        toast.error(error.message || 'Failed to update password.')
      } else {
        toast.success('Password updated successfully! Welcome back.')
        if (typeof window !== 'undefined' && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname)
        }
        setMode('signin')
        setNewPassword('')
        setConfirmPassword('')
        if (data?.session) {
          setSession(data.session)
        }
      }
    } catch (err) {
      toast.error('Password update error: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignOut = useCallback(async () => {
    try {
      if (isConfigured) {
        await supabase.auth.signOut()
      }
      setSession(null)
      toast.success('Signed out')
    } catch (_error) {
      toast.error('Sign out failed')
    }
  }, [isConfigured, toast])

  const updatePassword = useCallback(
    async (newPass) => {
      if (!isConfigured) throw new Error('Supabase is not configured')
      const { data, error } = await supabase.auth.updateUser({ password: newPass })
      if (error) throw error
      return data
    },
    [isConfigured],
  )

  const contextValue = useMemo(
    () => ({
      session,
      user: session?.user || null,
      logout: handleSignOut,
      updatePassword,
    }),
    [session, handleSignOut, updatePassword],
  )

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0F0E0D] px-6 text-[#f2ede6]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-7 w-7 animate-spin text-[#c2956a]" />
          <p className="font-mono text-xs tracking-wider uppercase text-neutral-400">Verifying credentials...</p>
        </div>
      </div>
    )
  }

  // Render Login / Recovery Card if not authenticated
  if (!session || mode === 'recovery') {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#0F0E0D] p-6 text-[#f2ede6] overflow-hidden selection:bg-[#c2956a]/20">
        {/* Subtle Darkroom Glow */}
        <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-30">
          <div className="h-[450px] w-[450px] rounded-full bg-[#c2956a]/10 blur-[130px]" />
        </div>

        <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
          {/* Brand Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-[#2c2825] bg-[#161514] text-[#c2956a] shadow-lg">
              {mode === 'recovery' ? (
                <KeyRound className="h-6 w-6" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </div>
            <h1 className="font-display text-3xl font-light tracking-tight text-[#f2ede6]">
              Advaita <span className="italic text-[#c2956a]">Workspace</span>
            </h1>
            <p className="mt-1 font-mono text-xs tracking-wider uppercase text-neutral-400">
              {mode === 'recovery'
                ? 'Security Terminal • Set New Password'
                : mode === 'forgot'
                  ? 'Security Terminal • Reset Password'
                  : 'Content Studio & Archival Terminal'}
            </p>
          </div>

          {/* Unconfigured Alert */}
          {!isConfigured && (
            <div className="mb-6 w-full rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 text-xs text-neutral-300 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <p className="font-semibold text-[#f2ede6]">Authentication Service Unavailable</p>
                <p className="mt-1 text-neutral-400">
                  Supabase backend is not connected. Admin login is currently disabled.
                </p>
              </div>
            </div>
          )}

          {/* Auth Card */}
          <div className="w-full rounded-2xl border border-[#242220] bg-[#141312] p-7 sm:p-9 shadow-2xl relative">
            {mode === 'recovery' ? (
              /* Password Recovery Form */
              <form onSubmit={handleRecoverySubmit} className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[#f2ede6]">Set New Admin Password</h2>
                  <p className="mt-1 text-xs text-neutral-400">
                    Enter a secure password of at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="recovery-new-password"
                    className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5"
                  >
                    New Password
                  </label>
                  <PasswordInput
                    id="recovery-new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="recovery-confirm-password"
                    className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <PasswordInput
                    id="recovery-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !isConfigured}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#c2956a] bg-[#c2956a] py-3 text-xs font-mono uppercase tracking-wider text-[#0F0E0D] font-semibold transition-all duration-250 ease-[var(--ease-out-quart)] hover:bg-[#d4a87d] active:scale-[0.97] hover:-translate-y-0.5 hover:shadow-subtle disabled:opacity-40 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        <span>Update Password &amp; Enter</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : mode === 'forgot' ? (
              /* Forgot Password Form */
              <form onSubmit={handleForgotSubmit} className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-[#f2ede6]">Reset Password</h2>
                  <p className="mt-1 text-xs text-neutral-400">
                    We will send an encrypted recovery link to your admin email address.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="forgot-email" className="block font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@domain.org"
                      required
                      disabled={submitting}
                      className="block w-full rounded-lg border border-[#2c2825] bg-[#1a1918] py-2.5 pl-10 pr-4 text-sm text-[#f2ede6] placeholder:text-neutral-600 focus:border-[#c2956a] focus:outline-none transition-all duration-250 ease-[var(--ease-out-quart)] focus:-translate-y-0.5 focus:shadow-subtle"
                    />
                  </div>
                </div>

                {resetSent && (
                  <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-3 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Check your email inbox for the reset link!</span>
                  </div>
                )}

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting || !isConfigured || cooldown > 0}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#c2956a] bg-[#c2956a] py-3 text-xs font-mono uppercase tracking-wider text-[#0F0E0D] font-semibold transition-all duration-250 ease-[var(--ease-out-quart)] hover:bg-[#d4a87d] active:scale-[0.97] hover:-translate-y-0.5 hover:shadow-subtle disabled:opacity-40 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : cooldown > 0 ? (
                      <span>Resend in {cooldown}s</span>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <span>Send Password Reset Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin')
                      setResetSent(false)
                    }}
                    className="w-full text-center font-mono text-xs text-neutral-400 hover:text-[#c2956a] transition-colors py-1 cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* Regular Sign In Form */
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
                      className="block w-full rounded-lg border border-[#2c2825] bg-[#1a1918] py-2.5 pl-10 pr-4 text-sm text-[#f2ede6] placeholder:text-neutral-600 focus:border-[#c2956a] focus:outline-none transition-all duration-250 ease-[var(--ease-out-quart)] focus:-translate-y-0.5 focus:shadow-subtle"
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
                      className="h-4 w-4 rounded border-[#2c2825] bg-[#1a1918] text-[#c2956a] focus:ring-0 cursor-pointer"
                    />
                    <span className="font-mono text-xs text-neutral-400">Remember session</span>
                  </label>

                  {isConfigured && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="font-mono text-xs text-neutral-500 hover:text-[#c2956a] transition-colors duration-150 ease-[var(--ease-out-quart)] active:opacity-80 cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting || !isConfigured}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#c2956a] bg-[#c2956a] py-3 text-xs font-mono uppercase tracking-wider text-[#0F0E0D] font-semibold transition-all duration-250 ease-[var(--ease-out-quart)] hover:bg-[#d4a87d] active:scale-[0.97] hover:-translate-y-0.5 hover:shadow-subtle disabled:opacity-40 cursor-pointer"
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
                </div>
              </form>
            )}
          </div>

          <Link
            to="/"
            className="group mt-8 inline-flex items-center gap-2 font-mono text-xs text-neutral-500 hover:text-[#E8E6E1] transition-colors duration-150 ease-[var(--ease-out-quart)] active:opacity-80"
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

