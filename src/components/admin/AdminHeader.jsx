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
    <header className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
          aria-controls="admin-sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted hover:text-accent lg:hidden shrink-0"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Breadcrumbs / Page Title */}
        <div className="flex items-center">
          <p className="truncate text-sm font-semibold">{sectionLabel(pathname)}</p>
        </div>

        {/* Global Search Button */}
        <div className="flex-1 max-w-xl mx-auto px-4">
          <button
            onClick={openSearch}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-line bg-surface/50 px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Search...</span>
            </div>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-line bg-canvas px-1.5 font-mono text-[10px] font-medium text-muted">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Preview shows drafts on the real public pages rather than in a mock-up of them. */}
        <button
          type="button"
          onClick={() => setPreviewDrafts(!previewDrafts)}
          aria-pressed={previewDrafts}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors shrink-0 ${
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
      </div>
    </header>
  )
}
