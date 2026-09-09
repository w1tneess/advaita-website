import { ExternalLink, Settings, Database, Server, Cloud } from 'lucide-react'
import { Link } from 'react-router'
import { useContent } from '@/lib/content.jsx'

export default function AdminFooter() {
  const { isRemote } = useContent()

  return (
    <footer className="w-full shrink-0 h-9 sm:h-10 border-t border-[#242626] bg-[#0c0d0d] px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono text-neutral-400 z-10 select-none">
      {/* Left Gateway & Sync Status */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-neutral-400">
          <Server className="h-3 w-3 text-emerald-400" />
          <span className="hidden sm:inline">Gateway:</span> India [UTC +05:30]
        </span>

        <span className="text-neutral-700">|</span>

        {isRemote ? (
          <span className="flex items-center gap-1 text-emerald-400">
            <Cloud className="h-3 w-3" />
            <span className="hidden md:inline">Supabase Cloud</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-neutral-500">
            <span className="hidden md:inline">Disconnected</span>
          </span>
        )}
      </div>

      {/* Center Shortcuts */}
      <div className="hidden md:flex items-center gap-3 text-neutral-400">
        <Link to="/admin/settings" className="hover:text-[#D1B18A] transition-colors flex items-center gap-1">
          <Settings className="h-3 w-3 text-[#D1B18A]" />
          Settings
        </Link>
        <span className="text-neutral-700">•</span>
        <Link to="/admin/data" className="hover:text-[#D1B18A] transition-colors flex items-center gap-1">
          <Database className="h-3 w-3 text-[#D1B18A]" />
          Sync &amp; Backups
        </Link>
        <span className="text-neutral-700">•</span>
        <a href="/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E8E6E1] transition-colors flex items-center gap-1">
          <ExternalLink className="h-3 w-3 text-[#D1B18A]" />
          Public Site
        </a>
      </div>

      {/* Right Studio Version & Copyright */}
      <div className="flex items-center gap-2 text-neutral-500">
        <span className="hidden lg:inline text-neutral-600">&copy; {new Date().getFullYear()} Advaita Chandra</span>
        <span className="hidden lg:inline text-neutral-700">•</span>
        <span className="text-neutral-400">Studio v1.0</span>
      </div>
    </footer>
  )
}
