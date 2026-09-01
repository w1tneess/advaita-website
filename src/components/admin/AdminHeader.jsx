import {
  Eye,
  EyeOff,
  Menu,
  Search,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'

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
        <div className="flex items-center gap-3 ml-auto">
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
          <span className="hidden sm:inline">Preview drafts</span>
          <span className="sm:hidden">Preview</span>
          </button>
        </div>
      </div>
    </header>
  )
}
