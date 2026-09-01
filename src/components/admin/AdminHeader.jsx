import { useEffect, useState, useRef } from 'react'
import {
  Eye,
  EyeOff,
  LogOut,
  Menu,
  Plus,
  FileText,
  FolderGit2,
  Camera,
  ChevronDown,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { NAV_GROUPS } from './AdminSidebar.jsx'
import { useAdminAuth } from './AdminAuth.jsx'
import { useContent } from '../../lib/content.jsx'

/** Longest matching nav item wins, so /admin/projects/abc still reads "Projects". */
function sectionLabel(pathname) {
  const items = NAV_GROUPS.flatMap((group) => group.items)
  const match = items
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0]
  return match?.label ?? 'Admin'
}

export default function AdminHeader({ onOpenSidebar }) {
  const { pathname } = useLocation()
  const { previewDrafts, setPreviewDrafts } = useContent()
  const { session, logout } = useAdminAuth()

  const [time, setTime] = useState(new Date())
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setQuickAddOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getGreeting = () => {
    const hour = time.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const userIdentifier = session?.user?.email?.split('@')[0] || 'Admin'
  const displayName = userIdentifier.charAt(0).toUpperCase() + userIdentifier.slice(1)

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          aria-controls="admin-sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted hover:text-accent lg:hidden"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Dynamic Greeting & Context */}
        <div className="min-w-0 flex-1 flex items-center gap-4">
          <p className="truncate text-sm font-medium">{sectionLabel(pathname)}</p>
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-line text-sm text-muted">
            <span>{getGreeting()}, {displayName}</span>
            <span className="opacity-50">•</span>
            <span className="tabular-nums">{timeString}</span>
          </div>
        </div>

        {/* Quick Add Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-accent text-on-accent px-2.5 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-accent-strong"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create</span>
            <ChevronDown className={`h-3.5 w-3.5 opacity-70 transition-transform ${quickAddOpen ? 'rotate-180' : ''}`} />
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-line bg-surface p-1 shadow-lg shadow-black/20 animate-rise origin-top-right">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted">Quick Add</div>
              <Link
                to="/admin/blog/new"
                onClick={() => setQuickAddOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink hover:bg-raised transition-colors"
              >
                <FileText className="h-4 w-4 text-muted" /> Write Post
              </Link>
              <Link
                to="/admin/projects/new"
                onClick={() => setQuickAddOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink hover:bg-raised transition-colors"
              >
                <FolderGit2 className="h-4 w-4 text-muted" /> Add Project
              </Link>
              <Link
                to="/admin/photography/new"
                onClick={() => setQuickAddOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink hover:bg-raised transition-colors"
              >
                <Camera className="h-4 w-4 text-muted" /> Upload Photo
              </Link>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-line hidden sm:block"></div>

        {/* Preview shows drafts on the real public pages rather than in a mock-up of them. */}
        <button
          type="button"
          onClick={() => setPreviewDrafts(!previewDrafts)}
          aria-pressed={previewDrafts}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            previewDrafts
              ? 'border-opinion bg-opinion/12 text-opinion'
              : 'border-line bg-surface text-muted hover:text-accent'
          }`}
        >
          {previewDrafts ? (
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Preview drafts</span>
          <span className="sm:hidden">Preview</span>
        </button>

        <Link
          to="/"
          className="hidden rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-accent sm:inline-flex"
        >
          View site
        </Link>

        <button
          type="button"
          onClick={logout}
          aria-label="Sign out"
          title="Sign out"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-accent"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}
