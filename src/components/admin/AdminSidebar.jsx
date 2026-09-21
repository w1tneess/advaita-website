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
import { preloadRoute } from '@/lib/preload.js'

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
  return `flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono tracking-wider uppercase transition-all ${
    isActive 
      ? 'bg-[#1c1a18] text-[#f2ede6] font-semibold border-l-2 border-[#c2956a] shadow-sm' 
      : 'text-neutral-400 hover:bg-[#151413] hover:text-[#f2ede6] border-l-2 border-transparent'
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
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 h-screen shrink-0 flex flex-col overflow-hidden border-r border-[#242220] bg-[#0F0E0D] transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Sync State Header */}
        <div className="flex items-center justify-between gap-2 border-b border-[#242220] px-5 py-4 shrink-0 bg-[#141312]">
          <div>
            <p className="font-display text-base font-medium text-[#f2ede6] tracking-tight">Advaita Studio</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isRemote ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <Cloud className="h-2.5 w-2.5" /> Supabase Synced
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                  Disconnected
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg border border-[#242220] p-1.5 text-neutral-400 hover:text-[#f2ede6] lg:hidden cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
          {/* Quick Create Action */}
          <div className="relative mb-6" ref={menuRef}>
            <button
              type="button"
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-[#c2956a] bg-[#c2956a]/10 px-3.5 py-2 text-xs font-mono tracking-wider uppercase text-[#c2956a] font-semibold transition-all hover:bg-[#c2956a]/20 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-3.5 w-3.5" />
                <span>Create New</span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${quickAddOpen ? 'rotate-180' : ''}`} />
            </button>

            {quickAddOpen && (
              <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-[#282523] bg-[#161514] p-1.5 shadow-2xl z-50">
                <Link
                  to="/admin/blog/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f2ede6] transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-[#c2956a]" /> New Article
                </Link>
                <Link
                  to="/admin/projects/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f2ede6] transition-colors"
                >
                  <FolderGit2 className="h-3.5 w-3.5 text-[#c2956a]" /> New Project
                </Link>
                <Link
                  to="/admin/photography/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f2ede6] transition-colors"
                >
                  <Camera className="h-3.5 w-3.5 text-[#c2956a]" /> New Photo
                </Link>
                <Link
                  to="/admin/notes/new"
                  onClick={() => { setQuickAddOpen(false); onClose(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f2ede6] transition-colors"
                >
                  <BookMarked className="h-3.5 w-3.5 text-[#c2956a]" /> New Reading Note
                </Link>
              </div>
            )}
          </div>

          <nav aria-label="Admin sections" className="space-y-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.title}>
                <h2 className="mb-2 px-3 text-[10px] font-mono font-bold tracking-widest text-neutral-500 uppercase">
                  {group.title}
                </h2>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon
                    return (
                      <li key={item.to}>
                        <NavLink to={item.to} end={item.end} onClick={onClose} className={itemClasses}>
                          <ItemIcon className="h-3.5 w-3.5 shrink-0 text-[#c2956a]/80" aria-hidden="true" />
                          <span>{item.label}</span>
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
        <div className="shrink-0 border-t border-[#242220] p-4 bg-[#141312]">
          <Link
            to="/"
            onPointerEnter={() => preloadRoute('/')}
            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-400 hover:text-[#f2ede6] transition-colors mb-2.5"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#c2956a]" aria-hidden="true" />
            <span>View Public Site</span>
          </Link>
          
          <div className="flex items-center justify-between rounded-xl border border-[#242220] p-2.5 bg-[#181716]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-[#22201d] border border-[#2d2926] flex items-center justify-center shrink-0">
                <span className="text-xs font-mono font-semibold text-[#c2956a]">
                  {displayName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono font-medium text-[#f2ede6] truncate">{displayName}</p>
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
              className="h-7 w-7 inline-flex items-center justify-center rounded-lg text-neutral-400 hover:bg-[#22201d] hover:text-[#f2ede6] transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
