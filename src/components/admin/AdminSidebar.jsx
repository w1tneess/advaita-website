import {
  Database,
  ExternalLink,
  FileText,
  FolderGit2,
  Home,
  LayoutDashboard,
  Link2,
  Milestone,
  Settings,
  Tags,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'

/**
 * Admin navigation.
 *
 * A fixed drawer on large screens, an overlay drawer on small ones. The overlay closes on
 * navigation, which is handled by AdminLayout listening for route changes.
 */

export const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/profile', label: 'Profile & interests', icon: User },
      { to: '/admin/home', label: 'Home page', icon: Home },
      { to: '/admin/projects', label: 'Projects', icon: FolderGit2 },
      { to: '/admin/blog', label: 'Writing', icon: FileText },
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
  return `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
    isActive ? 'bg-accent/12 font-medium text-accent' : 'text-muted hover:bg-raised hover:text-ink'
  }`
}

export default function AdminSidebar({ open, onClose }) {
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
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-line bg-surface transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-4">
          <div>
            <p className="font-display text-base font-semibold">Content admin</p>
            <p className="text-xs text-muted">Live · synced</p>
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

        <nav aria-label="Admin sections" className="px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              <h2 className="mb-1.5 px-3 text-xs font-semibold tracking-wide text-muted uppercase">
                {group.title}
              </h2>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <li key={item.to}>
                      <NavLink to={item.to} end={item.end} className={itemClasses}>
                        <ItemIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {item.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          <div className="mt-6 border-t border-line pt-4">
            <Link
              to="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-raised hover:text-ink"
            >
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              View public site
            </Link>
          </div>
        </nav>
      </div>
    </>
  )
}
