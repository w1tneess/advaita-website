import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

import Icon from '@/components/meta/Icon.jsx'
import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { getRoutePreloadProps } from '@/lib/preload.js'

export default function Footer() {
  const { profile, publicSocialLinks } = useContent()
  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()

  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-line bg-surface/40 text-ink py-[clamp(2.5rem,5vw,4.5rem)] font-sans">
      <div className="shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-[clamp(1.5rem,3.5vw,3rem)] mb-[clamp(1.5rem,3.5vw,3rem)]">
          {/* Left Column - Get in touch & Socials */}
          <div className="sm:col-span-2 md:col-span-5 flex flex-col space-y-[clamp(0.75rem,2vw,1.25rem)]">
            <h2 className="text-[clamp(1.35rem,1.1rem+1vw,2.25rem)] font-normal font-display tracking-tight leading-[1.15]">
              Get in touch<br />
              <span className="flex items-center gap-2">
                with{' '}
                <span className="italic text-accent">
                  {profile?.name ? profile.name.split(' ')[0] : 'Advaita'}
                </span>
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-md leading-relaxed">
              Open to constructive feedback, research notes, questions, and book recommendations.
            </p>
            
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {configured.slice(0, 5).map((link) => (
                <a 
                  key={link.id || link.label}
                  href={hrefFor(link)} 
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-line bg-surface flex items-center justify-center text-muted hover:text-accent hover:border-accent/60 hover:bg-accent/10 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  {...(link.kind === 'email' ? {} : { target: '_blank', rel: 'me noopener noreferrer' })}
                  aria-label={link.label}
                >
                  <Icon name={link.icon} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Middle Column - Navigation */}
          <div className="md:col-span-4 space-y-[clamp(0.5rem,1.5vw,1rem)]">
            <h3 className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-accent font-semibold">
              Directory
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-4 sm:gap-x-6">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    {...getRoutePreloadProps(item.path)}
                    className="group relative inline-flex items-center text-muted hover:text-ink transition-colors py-0.5"
                  >
                    <span className="text-xs sm:text-sm font-normal tracking-wide">{item.label}</span>
                    <ArrowUpRight className="ml-1 w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Location & Dispatch */}
          <div className="md:col-span-3 space-y-[clamp(0.5rem,1.5vw,1rem)] text-xs sm:text-sm">
            <h3 className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-accent font-semibold">
              Location & Reach
            </h3>
            <div className="space-y-1.5 text-muted">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span>West Bengal, India</span>
              </div>
              <p className="text-[11px] text-muted">Timezone: IST (UTC+5:30)</p>
            </div>
            {profile?.email && (
              <div className="pt-1">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-mono text-[11px] sm:text-xs text-ink border-b border-line hover:border-accent hover:text-accent transition-colors"
                >
                  {profile.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-[clamp(1rem,2.5vw,1.75rem)] border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10px] sm:text-[11px] text-muted">
            <Link to="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
            <span className="text-line">•</span>
            <Link to="/terms" className="hover:text-ink transition-colors">Terms of Use</Link>
          </div>
          
          <div className="font-mono text-[10px] sm:text-[11px] text-muted">
            &copy; {year} {profile.name || 'Advaita Chandra'}. Built with care.
          </div>
        </div>
      </div>
    </footer>
  )
}

