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
    <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border border-line bg-surface/60 text-[11px] font-mono text-muted backdrop-blur-sm">
      <Clock className="h-3 w-3 text-accent" />
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
        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 active:scale-[0.97] transition-all duration-250 ease-[var(--ease-out-quart)] cursor-pointer shadow-sm"
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
            className="absolute right-0 mt-2 w-48 rounded-2xl border border-line-strong bg-surface/95 backdrop-blur-2xl p-1.5 shadow-2xl z-50"
          >
            <div className="px-2.5 py-1 text-[10px] font-mono font-semibold text-muted uppercase tracking-widest mb-1">
              Create Document
            </div>
            {actions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-sans font-medium text-neutral-300 hover:bg-[#1d1b19] hover:text-[#f8f6f0] transition-colors duration-150 ease-[var(--ease-out-quart)]"
              >
                <action.icon className="h-3.5 w-3.5 text-accent" />
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
    <header className="sticky top-0 z-20 border-b border-line bg-[#0F0E0D]/85 backdrop-blur-2xl">
      <div className="flex h-14 items-center gap-3 sm:gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          aria-controls="admin-sidebar"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-surface/60 text-neutral-400 hover:text-[#f8f6f0] lg:hidden shrink-0 transition-colors duration-150 ease-[var(--ease-out-quart)] cursor-pointer active:scale-[0.97]"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Breadcrumb Section Label */}
        <div className="flex items-center min-w-[100px] sm:min-w-[120px]">
          <span className="truncate font-sans text-[13.5px] font-semibold text-ink tracking-tight">
            {sectionLabel(pathname)}
          </span>
        </div>

        {/* Global Search Button - Desktop (macOS Spotlight Style) */}
        <div className="flex-1 max-w-lg mx-auto px-4 hidden sm:block">
          <button
            onClick={openSearch}
            className="flex w-full items-center justify-between gap-2 rounded-full border border-line bg-surface/60 hover:bg-surface hover:border-line-strong px-3.5 py-1.5 text-[13px] font-sans text-muted transition-all duration-250 ease-[var(--ease-out-quart)] active:scale-[0.97] cursor-pointer shadow-subtle"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-accent" />
              <span>Search documents &amp; tools...</span>
            </div>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded-md border border-line bg-canvas px-1.5 font-mono text-[9px] text-muted">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Mobile Search Button */}
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search documents"
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-surface/60 text-neutral-400 hover:text-[#f8f6f0] sm:hidden shrink-0 transition-colors duration-150 ease-[var(--ease-out-quart)] cursor-pointer active:scale-[0.97]"
        >
          <Search className="h-3.5 w-3.5 text-accent" />
        </button>

        {/* Right Action Icons & Sync Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Cloud Sync Status Pill */}
          {isRemote && syncStatus === 'synced' ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-900/40 bg-emerald-950/25 text-emerald-400 text-[11px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Cloud Synced</span>
            </div>
          ) : (
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/40 bg-accent/10 text-accent text-[11px] font-mono hover:bg-accent/20 active:scale-[0.97] transition-all duration-250 ease-[var(--ease-out-quart)] cursor-pointer"
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
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-line/60 bg-surface/40 hover:bg-surface px-2.5 py-1.5 text-xs font-sans font-medium text-neutral-400 hover:text-[#f8f6f0] active:scale-[0.97] transition-all duration-250 ease-[var(--ease-out-quart)]"
          >
            <ExternalLink className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span className="hidden lg:inline">Site</span>
          </a>
          
          <button
            type="button"
            onClick={() => setPreviewDrafts(!previewDrafts)}
            aria-pressed={previewDrafts}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-sans font-medium transition-all duration-250 ease-[var(--ease-out-quart)] active:scale-[0.97] shrink-0 cursor-pointer ${
              previewDrafts
                ? 'border-accent bg-accent/15 text-accent shadow-sm'
                : 'border-line bg-surface/60 text-neutral-400 hover:text-[#f8f6f0] hover:bg-surface'
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
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-surface hover:text-[#f8f6f0] transition-colors duration-150 ease-[var(--ease-out-quart)] relative"
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
