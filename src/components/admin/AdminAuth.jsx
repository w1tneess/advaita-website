import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, Loader2, Sparkles } from 'lucide-react'

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
      <div className="flex min-h-dvh bg-canvas selection:bg-accent/20">
        
        {/* Left Side - Visual / Branding (Desktop Only) */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-surface p-12 lg:flex xl:p-20 border-r border-line/40">
          <div className="absolute inset-0 pointer-events-none mix-blend-screen">
            {/* Soft, large gradients */}
            <div className="absolute -top-[25%] -left-[25%] h-[80%] w-[80%] rounded-full bg-accent/20 blur-[120px]" />
            <div className="absolute -bottom-[25%] -right-[25%] h-[80%] w-[80%] rounded-full bg-accent-strong/20 blur-[120px]" />
          </div>

          <div className="relative z-10">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Return to public site
            </Link>
          </div>

          <div className="relative z-10 animate-rise max-w-lg">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-ink ring-1 ring-line/50 shadow-sm">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-ink md:text-6xl text-balance leading-tight">
              Advaita
              <br />
              <span className="text-muted font-normal">Workspace</span>
            </h1>
            <p className="mt-6 text-lg text-muted text-pretty">
              Securely manage your content, configure site taxonomy, and update your portfolio.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-32">
          <div className="mx-auto w-full max-w-sm animate-rise">
            
            {/* Mobile-only header elements */}
            <div className="mb-12 lg:hidden">
              <Link
                to="/"
                className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to public site
              </Link>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface text-ink ring-1 ring-line">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-ink">Admin Access</h2>
              <p className="mt-2 text-muted">Sign in to manage your content.</p>
            </div>

            {/* Desktop header */}
            <div className="hidden lg:block mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-ink">Sign In</h2>
              <p className="mt-2 text-muted">Enter your credentials to continue.</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-8">
              
              <div className="relative group">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={signingIn}
                  className="peer block w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base text-ink placeholder:text-transparent transition-all focus:border-transparent focus:outline-none focus:ring-0 disabled:opacity-50"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-5 text-sm font-medium text-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted/60 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-accent cursor-text"
                >
                  Email Address
                </label>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-300 peer-focus:w-full group-hover:bg-accent/50 group-hover:w-full peer-focus:group-hover:bg-accent" />
              </div>

              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={signingIn}
                  className="peer block w-full border-0 border-b border-line bg-transparent px-0 py-3 pr-10 text-base text-ink placeholder:text-transparent transition-all focus:border-transparent focus:outline-none focus:ring-0 disabled:opacity-50"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-5 text-sm font-medium text-muted transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-muted/60 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-accent cursor-text"
                >
                  Password
                </label>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent transition-all duration-300 peer-focus:w-full group-hover:bg-accent/50 group-hover:w-full peer-focus:group-hover:bg-accent" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={signingIn}
                  className="absolute right-0 top-3 text-muted transition-colors hover:text-ink focus:outline-none disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={signingIn}
                  className="w-full rounded-full py-4 text-base font-medium shadow-sm transition-all active:scale-[0.98]"
                >
                  {signingIn ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>
          </div>
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
