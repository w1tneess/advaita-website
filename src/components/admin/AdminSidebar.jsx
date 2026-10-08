import {
  BookMarked,
  Database,
  ExternalLink,
  FileText,
  FolderGit2,
  Home,
  LayoutDashboard,
  Link2,
  MessageSquare,
  Milestone,
  Compass,
  Settings,
  Tags,
  User,
  Wrench,
  X,
  Camera,
  LogOut,
  Plus,
  ChevronDown,
  Cloud,
} from 'lucide-react'
import { NavLink, Link } from 'react-router'
import { useState, useRef, useEffect } from 'react'

import { useAdminAuth } from './AdminAuth.jsx'
import { useContent } from '@/lib/content.jsx'
import { preloadRoute } from '@/lib/preload'

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
      { to: '/admin/profile', label: 'Profile & Bio', icon: User },
      { to: '/admin/home', label: 'Home Page', icon: Home },
      { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
      { to: '/admin/blog', label: 'Blog & Articles', icon: FileText },
      { to: '/admin/philosophy', label: 'Philosophy', icon: Compass },
      { to: '/admin/notes', label: 'Reading Notes', icon: BookMarked },
      { to: '/admin/photography', label: 'Photography', icon: Camera },
    ],
  },
  {
    title: 'Organization',
    items: [
      { to: '/admin/taxonomy', label: 'Categories', icon: Tags },
      { to: '/admin/skills', label: 'Skills & Tools', icon: Wrench },
      { to: '/admin/timeline', label: 'Timeline', icon: Milestone },
      { to: '/admin/social', label: 'Social Links', icon: Link2 },
    ],
  },
  {
    title: 'System',
    items: [
      { to: '/admin/settings', label: 'Site Settings', icon: Settings },
      { to: '/admin/data', label: 'Database & Sync', icon: Database },
    ],
  },
]

function itemClasses({ isActive }) {
  return `group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-sans font-medium tracking-tight transition-all duration-250 ease-[var(--ease-out-quart)] hover:translate-x-0.5 active:scale-[0.97] ${
    isActive 
      ? 'bg-[#c2956a]/15 text-[#f8f6f0] shadow-sm font-semibold' 
      : 'text-neutral-400 hover:bg-[#181716] hover:text-[#f8f6f0]'
  }`
}

export default function AdminSidebar({ open, onClose }) {
  const { session, logout } = useAdminAuth()
  const { isRemote } = useContent()
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
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen shrink-0 flex flex-col overflow-hidden border-r border-[#242220] bg-[#0c0b0a]/95 backdrop-blur-2xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Sync State Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#242220] px-5 py-4 shrink-0 bg-[#121110]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-[15px] font-normal text-[#f8f6f0] tracking-tight">
                Advaita Studio
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(194,149,106,0.6)]" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isRemote ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <Cloud className="h-2.5 w-2.5" /> Supabase Synced
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                  Local Mode
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg border border-[#242220] p-1.5 text-neutral-400 hover:text-[#f8f6f0] lg:hidden cursor-pointer active:scale-[0.97] transition-all duration-250 ease-[var(--ease-out-quart)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3.5 py-4 scrollbar-thin">
          {/* Quick Create Action */}
          <div className="relative mb-5" ref={menuRef}>
            <button
              type="button"
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-[#c2956a]/30 bg-[#c2956a]/10 px-3.5 py-2 text-xs font-sans font-medium tracking-tight text-[#c2956a] transition-all duration-250 ease-[var(--ease-out-quart)] hover:bg-[#c2956a]/20 active:scale-[0.97] cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-3.5 w-3.5" />
                <span>Create New</span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${quickAddOpen ? 'rotate-180' : ''}`} />
            </button>

            {quickAddOpen && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-2xl border border-[#282523] bg-[#161514] p-1.5 shadow-2xl z-50 backdrop-blur-xl">
                <Link
                  to="/admin/blog/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-sans font-medium text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f8f6f0] transition-colors duration-150 ease-[var(--ease-out-quart)]"
                >
                  <FileText className="h-3.5 w-3.5 text-[#c2956a]" /> New Article
                </Link>
                <Link
                  to="/admin/projects/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-sans font-medium text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f8f6f0] transition-colors duration-150 ease-[var(--ease-out-quart)]"
                >
                  <FolderGit2 className="h-3.5 w-3.5 text-[#c2956a]" /> New Project
                </Link>
                <Link
                  to="/admin/photography/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-sans font-medium text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f8f6f0] transition-colors duration-150 ease-[var(--ease-out-quart)]"
                >
                  <Camera className="h-3.5 w-3.5 text-[#c2956a]" /> New Photo
                </Link>
                <Link
                  to="/admin/notes/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-sans font-medium text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f8f6f0] transition-colors duration-150 ease-[var(--ease-out-quart)]"
                >
                  <BookMarked className="h-3.5 w-3.5 text-[#c2956a]" /> New Reading Note
                </Link>
              </div>
            )}
          </div>

          <nav aria-label="Admin sections" className="space-y-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="mb-1.5 px-3 text-[10px] font-mono font-semibold tracking-wider text-neutral-500 uppercase">
                  {group.title}
                </h2>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <li key={item.to}>
                        <NavLink to={item.to} end={item.end} onClick={onClose} className={itemClasses}>
                          {({ isActive }) => (
                            <>
                              <ItemIcon 
                                className={`h-4 w-4 shrink-0 transition-colors ${
                                  isActive ? 'text-[#c2956a]' : 'text-neutral-400 group-hover:text-neutral-200'
                                }`} 
                                aria-hidden="true" 
                              />
                              <span>{item.label}</span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Profile Box */}
        <div className="shrink-0 border-t border-[#242220] p-3.5 bg-[#121110]">
          <Link
            to="/"
            onPointerEnter={() => preloadRoute('/')}
            className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-sans font-medium text-neutral-400 hover:text-[#f8f6f0] hover:bg-[#181716] transition-colors duration-150 ease-[var(--ease-out-quart)] mb-2"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-3.5 w-3.5 text-[#c2956a]" aria-hidden="true" />
              <span>View Public Site</span>
            </span>
            <span className="font-mono text-[10px] text-neutral-500">↗</span>
          </Link>
          
          <div className="flex items-center justify-between rounded-xl border border-[#242220] p-2.5 bg-[#181716]/90 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-[#22201d] border border-[#2d2926] flex items-center justify-center shrink-0">
                <span className="text-xs font-sans font-semibold text-[#c2956a]">
                  {displayName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-sans font-medium text-[#f8f6f0] truncate">{displayName}</p>
                <p className="text-[10px] font-mono text-neutral-500 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={logout}
              aria-label="Sign out"
              title="Sign out"
              className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:bg-[#22201d] hover:text-[#f8f6f0] active:scale-[0.97] transition-all duration-250 ease-[var(--ease-out-quart)] shrink-0 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
