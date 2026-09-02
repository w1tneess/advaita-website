import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import AdminHeader from '../components/admin/AdminHeader.jsx'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import AdminFooter from '../components/admin/AdminFooter.jsx'
import CommandPalette from '../components/admin/CommandPalette.jsx'
import Seo from '../components/Seo.jsx'
import SkipLink from '../components/SkipLink.jsx'

/**
 * Shell for the demo admin panel.
 *
 * `noindex, nofollow` on every admin page, and the route is excluded from sitemap.xml and
 * disallowed in robots.txt. That is not access control — there is none — it just keeps a
 * local editing tool out of search results.
 */
export default function AdminLayout() {
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-dvh flex flex-col bg-canvas text-ink w-full">
      <Seo title="Content admin" description="Live content editor." path={pathname} noindex />

      <SkipLink />
      <CommandPalette />

      <div className="flex flex-1 w-full">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-w-0 flex-1 flex flex-col bg-[#050505]">
          <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />

          <main
            id="main-content"
            tabIndex={-1}
            className="w-full flex-1 px-4 py-8 focus:outline-none sm:px-6 sm:py-10"
          >
            <Outlet />
          </main>
          
          <AdminFooter />
        </div>
      </div>
    </div>
  )
}
