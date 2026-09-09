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
  BookMarked,
  Bell,
  Clock,
  Cloud,
  HardDrive,
  RefreshCw
} from 'lucide-react'
import { useLocation, Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'

import { NAV_GROUPS } from './AdminSidebar.jsx'
import { useContent } from '../../lib/content.jsx'

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
    <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#242626] bg-[#121414] text-[11px] font-mono text-neutral-400">
      <Clock className="h-3 w-3 text-[#D1B18A]" />
      <span>
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
    { label: 'New Note', icon: BookMarked, to: '/admin/notes/new' },
    { label: 'New Project', icon: FolderGit2, to: '/admin/projects/new' },
    { label: 'New Photo', icon: Camera, to: '/admin/photography/new' },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#D1B18A] bg-[#D1B18A]/10 text-[#D1B18A] hover:bg-[#D1B18A]/20 transition-all cursor-pointer"
        aria-label="Create new"
        title="Create new item"
      >
        <Plus className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-48 rounded-xl border border-[#242626] bg-[#121414] p-1.5 shadow-2xl z-50"
          >
            <div className="px-2 py-1 text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-widest mb-1">
              Create Document
            </div>
            {actions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-mono text-neutral-300 hover:bg-[#1b1c1c] hover:text-[#E8E6E1] transition-colors"
              >
                <action.icon className="h-3.5 w-3.5 text-[#D1B18A]" />
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
  const { previewDrafts, setPreviewDrafts, isRemote, syncStatus, syncToRemote } = useContent()
  const [syncing, setSyncing] = useState(false)

  const openSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }

  const handleManualSync = async () => {
    setSyncing(true)
    await syncToRemote()
    setSyncing(false)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#242626] bg-[#0F0F0F]/85 backdrop-blur-xl">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          aria-controls="admin-sidebar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#242626] bg-[#141616] text-neutral-400 hover:text-[#E8E6E1] lg:hidden shrink-0 transition-colors"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Breadcrumb Section Label */}
        <div className="flex items-center min-w-[120px]">
          <p className="truncate font-mono text-xs uppercase tracking-wider text-[#E8E6E1] font-medium">
            {sectionLabel(pathname)}
          </p>
        </div>

        {/* Global Search Button */}
        <div className="flex-1 max-w-lg mx-auto px-4 hidden sm:block">
          <button
            onClick={openSearch}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#242626] bg-[#141616] px-3 py-1.5 text-xs font-mono text-neutral-400 transition-all hover:border-[#D1B18A]/50 hover:text-[#E8E6E1]"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#D1B18A]" />
              <span>Search documents &amp; tools...</span>
            </div>
            <kbd className="hidden sm:inline-flex h-4.5 items-center gap-1 rounded border border-[#292a2a] bg-[#0F0F0F] px-1.5 font-mono text-[9px] text-neutral-400">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & Sync Indicators */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto">
          {/* Cloud Sync Status Pill */}
          {isRemote && syncStatus === 'synced' ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-900/40 bg-emerald-950/20 text-emerald-400 text-[11px] font-mono">
              <Cloud className="h-3 w-3" />
              <span>Cloud Synced</span>
            </div>
          ) : (
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#D1B18A]/30 bg-[#D1B18A]/10 text-[#D1B18A] text-[11px] font-mono hover:bg-[#D1B18A]/20 transition-all cursor-pointer"
              title="Click to sync local changes to Supabase"
            >
              {syncing ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <HardDrive className="h-3 w-3" />
              )}
              <span className="hidden md:inline">
                {syncing ? 'Syncing...' : 'Local (Sync Now)'}
              </span>
            </button>
          )}

          <LiveClock />

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono text-neutral-400 hover:text-[#E8E6E1] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-[#D1B18A]" aria-hidden="true" />
            <span className="hidden lg:inline">Site</span>
          </a>
          
          <button
            type="button"
            onClick={() => setPreviewDrafts(!previewDrafts)}
            aria-pressed={previewDrafts}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-mono transition-colors shrink-0 cursor-pointer ${
              previewDrafts
                ? 'border-[#D1B18A] bg-[#D1B18A]/15 text-[#D1B18A]'
                : 'border-[#242626] bg-[#141616] text-neutral-400 hover:text-[#E8E6E1]'
            }`}
            title="Toggle Drafts Preview in Public Site"
          >
            {previewDrafts ? (
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">Preview</span>
          </button>

          <Link
            to="/admin/messages"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-[#141616] hover:text-[#E8E6E1] transition-colors relative"
            title="Messages"
          >
            <Bell className="h-4 w-4" />
          </Link>

          <CreateDropdown />
        </div>
      </div>
    </header>
  )
}
