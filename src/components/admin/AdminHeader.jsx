import { useState, useEffect, useRef } from 'react'
import {
  Eye,
  EyeOff,
  Menu,
  Search,
  ExternalLink,
  Plus,
  FileText,
  FolderGit2,
  Camera,
  Bell,
  Clock
} from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { NAV_GROUPS } from './AdminSidebar.jsx'
import { useContent } from '../../lib/content.jsx'

/** Longest matching nav item wins, so /admin/projects/abc still reads "Projects". */
function sectionLabel(pathname) {
  const items = NAV_GROUPS.flatMap((group) => group.items)
  const match = items
    .filter((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0]
  return match?.label ?? 'Admin'
}

function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800/60 bg-[#0a0a0a] text-xs font-medium text-zinc-400">
      <Clock className="h-3.5 w-3.5 text-zinc-500" />
      <span className="font-mono">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  )
}

function CreateDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const actions = [
    { label: 'New Post', icon: FileText, to: '/admin/blog/new' },
    { label: 'New Project', icon: FolderGit2, to: '/admin/projects/new' },
    { label: 'New Photo', icon: Camera, to: '/admin/photography/new' },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent/20 hover:scale-105 active:scale-95 transition-all"
        aria-label="Create new"
      >
        <Plus className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-[#0a0a0a] p-1 shadow-xl z-50"
          >
            <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
              Create
            </div>
            {actions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
              >
                <action.icon className="h-4 w-4 text-zinc-500" />
                {action.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminHeader({ onOpenSidebar }) {
  const { pathname } = useLocation()
  const { previewDrafts, setPreviewDrafts } = useContent()

  const openSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/60 bg-[#050505]/80 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          aria-controls="admin-sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100 lg:hidden shrink-0 transition-colors"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Breadcrumbs / Page Title */}
        <div className="flex items-center min-w-[120px]">
          <p className="truncate text-sm font-semibold text-zinc-200">{sectionLabel(pathname)}</p>
        </div>

        {/* Global Search Button */}
        <div className="flex-1 max-w-xl mx-auto px-4 hidden sm:block">
          <button
            onClick={openSearch}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-zinc-800/60 bg-[#0a0a0a] px-3 py-1.5 text-sm text-zinc-500 transition-all hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search across admin...</span>
            </div>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <LiveClock />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden lg:inline">View Site</span>
          </a>
          
          <button
            type="button"
            onClick={() => setPreviewDrafts(!previewDrafts)}
            aria-pressed={previewDrafts}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors shrink-0 ${
              previewDrafts
                ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500'
                : 'border-zinc-800 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
          {previewDrafts ? (
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">Preview</span>
          </button>

          <div className="w-px h-4 bg-zinc-800 hidden sm:block mx-1"></div>

          <Link to="/admin/messages" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
          </Link>

          <CreateDropdown />
        </div>
      </div>
    </header>
  )
}
