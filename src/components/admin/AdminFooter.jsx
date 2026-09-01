import { ExternalLink, Github, Settings, Database, Server } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminFooter() {
  return (
    <footer className="w-full mt-auto border-t border-zinc-800/60 bg-[#050505]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Brand & Copyright */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-200">Advaita Chandra</h3>
            <p className="text-zinc-500">
              Content Administration Panel.<br />
              All changes are synced live.
            </p>
            <p className="text-xs text-zinc-600 pt-2">
              &copy; {new Date().getFullYear()} Advaita Chandra. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-200 uppercase tracking-wide text-xs">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/admin/settings" className="text-zinc-500 hover:text-accent transition-colors flex items-center gap-2">
                  <Settings className="h-3.5 w-3.5" />
                  Site Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/data" className="text-zinc-500 hover:text-accent transition-colors flex items-center gap-2">
                  <Database className="h-3.5 w-3.5" />
                  Database Management
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-zinc-200 uppercase tracking-wide text-xs">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-2">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Live Site
                </a>
              </li>
              <li>
                <a href="https://github.com/w1tneess/advaita-website" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-200 transition-colors flex items-center gap-2">
                  <Github className="h-3.5 w-3.5" />
                  Source Code
                </a>
              </li>
              <li>
                <span className="text-zinc-500 flex items-center gap-2">
                  <Server className="h-3.5 w-3.5" />
                  Status: All systems operational
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
