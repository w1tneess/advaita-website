import { Eye, EyeOff, Menu } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { NAV_GROUPS } from './AdminSidebar.jsx'
import ThemeToggle from '../ThemeToggle.jsx'
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

        <p className="min-w-0 flex-1 truncate text-sm font-medium">{sectionLabel(pathname)}</p>

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

        <ThemeToggle />
      </div>
    </header>
  )
}
