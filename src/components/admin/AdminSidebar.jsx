import {
  Database,
  ExternalLink,
  FileText,
  FolderGit2,
  Home,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Milestone,
  Settings,
  Tags,
  User,
  Wrench,
  X,
  Camera,
  LogOut,
  Plus,
  ChevronDown
} from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

import { useAdminAuth } from './AdminAuth.jsx'

/**
 * Admin navigation.
 *
 * A fixed drawer on large screens, an overlay drawer on small ones. The overlay closes on
 * navigation, which is handled by AdminLayout listening for route changes.
 */

export const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/profile', label: 'Profile & interests', icon: User },
      { to: '/admin/home', label: 'Home page', icon: Home },
      { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
      { to: '/admin/blog', label: 'Writing', icon: FileText },
      { to: '/admin/photography', label: 'Photography', icon: Camera },
    ],
  },
  {
    title: 'Lists',
    items: [
      { to: '/admin/taxonomy', label: 'Categories & tags', icon: Tags },
      { to: '/admin/skills', label: 'Skills', icon: Wrench },
      { to: '/admin/timeline', label: 'Timeline', icon: Milestone },
      { to: '/admin/social', label: 'Social links', icon: Link2 },
    ],
  },
  {
    title: 'Site',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/data', label: 'Data', icon: Database },
    ],
  },
]

function itemClasses({ isActive }) {
  return `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
    isActive 
      ? 'bg-zinc-800/80 text-zinc-100 shadow-sm border border-zinc-700/50' 
      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent'
  }`
}

export default function AdminSidebar({ open, onClose }) {
  const { session, logout } = useAdminAuth()
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setQuickAddOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userIdentifier = session?.user?.email?.split('@')[0] || 'Admin'
  const displayName = userIdentifier.charAt(0).toUpperCase() + userIdentifier.slice(1)

  return (
    <>
      {/* Mobile backdrop. Hidden from assistive tech: the close button is the labelled control. */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col overflow-hidden border-r border-zinc-800/60 bg-[#0a0a0a] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800/60 px-5 py-4 shrink-0">
          <div>
            <p className="font-display text-base font-semibold text-zinc-100">Content admin</p>
            <p className="text-xs text-zinc-500 font-medium">Live · synced</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg border border-line p-1.5 text-muted hover:text-ink lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
          {/* Quick Add Button */}
          <div className="relative mb-8" ref={menuRef}>
            <button
              type="button"
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="flex w-full items-center justify-between rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm transition-all hover:bg-white hover:shadow focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create New...</span>
              </div>
              <ChevronDown className={`h-4 w-4 opacity-70 transition-transform ${quickAddOpen ? 'rotate-180' : ''}`} />
            </button>

            {quickAddOpen && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-zinc-800/60 bg-[#0a0a0a] p-1.5 shadow-xl shadow-black/40 animate-rise z-50">
                <Link
                  to="/admin/blog/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                >
                  <FileText className="h-4 w-4 text-zinc-500" /> Write Post
                </Link>
                <Link
                  to="/admin/projects/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                >
                  <FolderGit2 className="h-4 w-4 text-zinc-500" /> Add Project
                </Link>
                <Link
                  to="/admin/photography/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
                >
                  <Camera className="h-4 w-4 text-zinc-500" /> Upload Photo
                </Link>
              </div>
            )}
          </div>

          <nav aria-label="Admin sections" className="mb-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="mb-4 last:mb-0">
                <h2 className="mb-1.5 px-3 text-[10px] font-bold tracking-widest text-muted/80 uppercase">
                  {group.title}
                </h2>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <li key={item.to}>
                        <NavLink to={item.to} end={item.end} onClick={onClose} className={itemClasses}>
                          <ItemIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {item.label}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Bottom Section: View Site & User Profile */}
          <div className="border-t border-zinc-800/60 pt-4 mt-auto">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 font-medium transition-colors hover:bg-zinc-900 hover:text-zinc-200 mb-2"
            >
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              View public site
            </Link>
            
            <div className="flex items-center justify-between rounded-lg border border-zinc-800/60 p-3 bg-zinc-900/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700/50">
                  <span className="text-sm font-semibold text-zinc-300">
                    {displayName.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-200 truncate">{displayName}</p>
                  <p className="text-xs text-zinc-500 truncate">{session?.user?.email}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={logout}
                aria-label="Sign out"
                title="Sign out"
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors shrink-0"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
