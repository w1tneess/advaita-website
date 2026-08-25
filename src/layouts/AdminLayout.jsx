import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import AdminHeader from '../components/admin/AdminHeader.jsx'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import DemoBanner from '../components/admin/DemoBanner.jsx'
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
    <div className="min-h-dvh bg-canvas text-foreground">
      <Seo
        title="Content admin"
        description="Local demo content editor."
        path={pathname}
        noindex
      />

      <SkipLink />
      <DemoBanner />

      <div className="flex">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-w-0 flex-1">
          <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />

          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto max-w-4xl px-4 py-8 focus:outline-none sm:px-6 sm:py-10"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
