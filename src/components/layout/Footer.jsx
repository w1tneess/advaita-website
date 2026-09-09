import { Link } from 'react-router'
import { ArrowUp, ArrowUpRight } from 'lucide-react'

import Container from '@/components/layout/Container.jsx'
import Icon from '@/components/meta/Icon.jsx'
import CopyButton from '@/components/ui/CopyButton.jsx'
import { useContent } from '@/lib/content.jsx'
import { NAV_ITEMS } from '@/config/nav.js'
import { preloadRoute } from '@/lib/preload.js'
import { scrollToTop } from '@/lib/smooth-scroll.js'

/**
 * Modern Architectural Colophon & Registry Footer.
 *
 * Implements a high-aesthetic, multi-column editorial layout:
 *   - Column 1: Monograph Colophon, Mission Thesis, and Live Telemetry Beacon
 *   - Column 2: Complete Site Directory Navigation
 *   - Column 3: Transmission Channels & External Networks
 *   - Colophon Bar: Copyright, Typography Registry, Shortcut Helper, and Back to Top
 */
export default function Footer() {
  const { profile, publicSocialLinks } = useContent()
  const configured = publicSocialLinks.filter((link) => link.url)
  const year = new Date().getFullYear()

  const hrefFor = (link) => (link.kind === 'email' ? `mailto:${link.url}` : link.url)

  return (
    <footer className="mt-auto border-t border-line/60 bg-[#08080a] text-text pt-16 pb-12">
      <Container>
        {/* Main Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* 1. Colophon & Brand Pillar (6 cols) */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <Link
                to="/"
                onPointerEnter={() => preloadRoute('/')}
                onFocus={() => preloadRoute('/')}
                onTouchStart={() => preloadRoute('/')}
                className="group inline-flex items-center gap-2.5 font-display text-2xl sm:text-3xl font-normal tracking-tight text-text hover:text-copper transition-colors"
              >
                <span>{profile.name || 'Advaita Chandra'}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-copper shadow-[0_0_8px_rgba(194,149,106,0.6)]" />
              </Link>

              <p className="mt-4 max-w-md text-sm text-text-2 font-light leading-relaxed">
                Student and independent learner based in India studying philosophy, history, and computer systems. Projects, reading notes, and open questions on data and ideas.
              </p>
            </div>

            {/* Location Badge */}
            <div className="flex items-center gap-2.5 font-mono text-xs text-text-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-copper opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-copper" />
              </span>
              <span className="text-text-2 tracking-wider">Based in India</span>
            </div>

            {/* Direct Email Action */}
            {profile.email && (
              <div className="pt-1 flex items-center gap-3">
                <CopyButton
                  text={profile.email}
                  label="Copy Email"
                  showText={true}
                  notify={true}
                  className="py-1.5 px-3 text-xs font-mono border border-line bg-surface/60 hover:border-copper/60 hover:text-copper transition-colors"
                />
                <a
                  href={`mailto:${profile.email}`}
                  className="text-xs font-mono text-text-3 hover:text-copper transition-colors"
                >
                  Write directly &rarr;
                </a>
              </div>
            )}
          </div>

          {/* 2. Site Directory (3 cols) */}
          <div className="md:col-span-3 space-y-4 font-mono">
            <div className="text-[11px] text-copper tracking-widest uppercase pb-2 border-b border-line/40 font-medium">
              Navigation
            </div>
            <ul className="space-y-2.5 text-xs">
              {NAV_ITEMS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onPointerEnter={() => preloadRoute(item.path)}
                    onFocus={() => preloadRoute(item.path)}
                    onTouchStart={() => preloadRoute(item.path)}
                    className="group inline-flex items-center gap-2.5 text-text-2 hover:text-copper transition-all duration-200 hover:translate-x-1"
                  >
                    <span className="w-1 h-1 rounded-full bg-copper/50 group-hover:bg-copper group-hover:scale-125 transition-all" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Connect & Social Links (3 cols) */}
          <div className="md:col-span-3 space-y-4 font-mono">
            <div className="text-[11px] text-copper tracking-widest uppercase pb-2 border-b border-line/40 font-medium">
              Connect
            </div>
            {configured.length > 0 ? (
              <ul className="space-y-2.5 text-xs">
                {configured.map((link) => (
                  <li key={link.id}>
                    <a
                      href={hrefFor(link)}
                      className="group flex items-center justify-between text-text-2 hover:text-copper transition-colors py-0.5"
                      {...(link.kind === 'email'
                        ? {}
                        : { target: '_blank', rel: 'me noopener noreferrer' })}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name={link.icon} className="h-3.5 w-3.5 text-text-3 group-hover:text-copper transition-colors" />
                        <span>{link.label}</span>
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-text-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="pt-3 border-t border-line/40">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-1.5 text-xs text-copper hover:text-copper-strong transition-colors tracking-wider"
              >
                <span>Send a message</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-14 pt-8 border-t border-line/40 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[11px] text-text-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {year} {profile.name || 'Advaita Chandra'}. All rights reserved.</span>
            <span className="hidden sm:inline text-line-strong">|</span>
            <Link to="/privacy" className="hover:text-copper transition-colors underline underline-offset-4">
              Privacy Policy
            </Link>
            <span className="text-line-strong">•</span>
            <Link to="/terms" className="hover:text-copper transition-colors underline underline-offset-4">
              Terms of Use
            </Link>
          </div>

          <div className="hidden lg:block tracking-wider uppercase text-[10px]">
            TYPESET IN INSTRUMENT SERIF, NEWSREADER, LORA &amp; SPACE MONO
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-text-2 hover:text-copper transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </Container>
    </footer>
  )
}
