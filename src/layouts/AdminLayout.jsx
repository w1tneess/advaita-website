import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'

import AdminHeader from '../components/admin/AdminHeader.jsx'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import AdminFooter from '../components/admin/AdminFooter.jsx'
import CommandPalette from '../components/admin/CommandPalette.jsx'
import Seo from '@/components/meta/Seo.jsx'
import SkipLink from '@/components/layout/SkipLink.jsx'

/**
 * Shell for the Admin Panel.
 *
 * Fixed Layout Architecture:
 * - Admin Sidebar: Fixed on the left (height: 100vh)
 * - Admin Header: Fixed at the top
 * - Admin Footer: Fixed at the bottom as an application dock/status bar
 * - Main content area (<main>): Independently scrollable viewport ("let the rest move")
 */
export default function AdminLayout() {
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#0F0F0F] text-[#E8E6E1] font-sans">
      <Seo title="Content admin" description="Live content editor." path={pathname} noindex />

      <SkipLink />
      <CommandPalette />

      {/* Fixed Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Viewport Container */}
      <div className="min-w-0 flex-1 flex flex-col h-screen overflow-hidden bg-[#0F0F0F] relative">
        {/* Fixed Header */}
        <AdminHeader onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Scrollable Content Pane ("let the rest move") */}
        <main
          id="main-content"
          tabIndex={-1}
          className="w-full flex-1 overflow-y-auto px-4 py-6 focus:outline-none sm:px-8 sm:py-8 scrollbar-thin"
        >
          <div className="max-w-[1400px] mx-auto pb-10">
            <Outlet />
          </div>
        </main>
        
        {/* Fixed Footer Status Bar */}
        <AdminFooter />
      </div>
    </div>
  )
}
