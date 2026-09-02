import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react'

import { supabase } from '../../lib/supabase/client.js'
import Button from '../Button.jsx'
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

// Geometric corner pattern component
const GeometricPattern = ({ className }) => (
  <svg
    className={`absolute text-line/40 ${className}`}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 200L200 0" stroke="currentColor" strokeWidth="1" />
    <path d="M0 160L160 0" stroke="currentColor" strokeWidth="1" />
    <path d="M0 120L120 0" stroke="currentColor" strokeWidth="1" />
    <path d="M0 80L80 0" stroke="currentColor" strokeWidth="1" />
    <path d="M40 200L200 40" stroke="currentColor" strokeWidth="1" />
    <path d="M80 200L200 80" stroke="currentColor" strokeWidth="1" />
    <path d="M120 200L200 120" stroke="currentColor" strokeWidth="1" />
  </svg>
)

export default function AdminAuth({ children }) {
  const _navigate = useNavigate()
  const toast = useToast()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signingIn, setSigningIn] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-canvas p-6 overflow-hidden selection:bg-accent/20">
        
        {/* Decorative corner patterns to match reference */}
        <GeometricPattern className="top-[-50px] left-[-50px] rotate-0" />
        <GeometricPattern className="top-[-50px] right-[-50px] rotate-90" />
        <GeometricPattern className="bottom-[-50px] left-[-50px] -rotate-90" />
        <GeometricPattern className="bottom-[-50px] right-[-50px] rotate-180" />

        <div className="relative z-10 w-full max-w-[420px] animate-rise flex flex-col items-center">
          
          {/* Logo / Branding Area */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center bg-accent text-white mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-ink">Advaita</span>
          </div>

          {/* High Contrast Login Card */}
          <div className="w-full bg-[#f8f9fa] shadow-2xl p-8 sm:p-10 text-zinc-900 rounded-sm">
            <h1 className="text-2xl font-semibold mb-2">Admin Log In</h1>
            <p className="text-sm text-zinc-500 mb-8">Please enter your details</p>

            <form onSubmit={handleSignIn} className="space-y-6">
              
              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="block text-xs font-medium text-zinc-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={signingIn}
                  className="block w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-sm text-zinc-900 transition-colors focus:border-accent focus:outline-none focus:ring-0 disabled:opacity-50"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-xs font-medium text-zinc-700 mb-1">
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
                  className="block w-full border-0 border-b-2 border-zinc-300 bg-transparent px-0 py-2 text-sm text-zinc-900 transition-colors focus:border-accent focus:outline-none focus:ring-0 disabled:opacity-50"
                />
              </div>

              {/* Extras (Remember me & Forgot Password) */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-accent focus:ring-accent accent-accent cursor-pointer"
                  />
                  <span className="text-xs text-zinc-600">Remember me</span>
                </label>
                
                <Link to="#" className="text-xs font-medium text-zinc-900 hover:text-accent transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={signingIn}
                  className="w-full bg-accent hover:bg-accent-strong text-white rounded-sm py-3 text-sm font-medium shadow-sm transition-all active:scale-[0.98] rounded-none"
                >
                  {signingIn ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    'Log In'
                  )}
                </Button>
              </div>
            </form>
          </div>

          <Link
            to="/"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to public site
          </Link>
        </div>
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
