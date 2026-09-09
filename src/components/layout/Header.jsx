import { useEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router"
import { ArrowUpRight } from "lucide-react"
import { NAV_ITEMS } from '@/config/nav.js'
import { useContent } from '@/lib/content.jsx'
import { preloadRoute } from '@/lib/preload.js'

export default function Header() {
	const [open, setOpen] = useState(false)
	const location = useLocation()
	const { profile, publicSocialLinks } = useContent()

	useEffect(() => {
		setOpen(false)
	}, [location.pathname])

	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [open])

	useEffect(() => {
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(false)
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [])

	// Filter out Home from horizontal desktop nav for clean elegance (handled by brand logo)
	// and keep Contact separated as a sharp CTA button on desktop
	const desktopLinks = NAV_ITEMS.filter((route) => route.path !== "/" && route.path !== "/contact")
	const configuredSocials = (publicSocialLinks || []).filter((link) => link.url)

	return (
		<header className="sticky top-0 z-50">
			{/* 1. Header Bar with backdrop blur (kept on this child div so it doesn't constrain fixed descendants) */}
			<div className="border-b border-white/[0.08] bg-canvas/85 backdrop-blur-xl transition-colors duration-300">
				<div className="shell flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
					{/* Brand Wordmark */}
					<Link
						to="/"
						onPointerEnter={() => preloadRoute('/')}
						onFocus={() => preloadRoute('/')}
						onTouchStart={() => preloadRoute('/')}
						className="group flex items-center gap-3 text-text"
						aria-label={`${profile?.name || 'Advaita Chandra'}, home`}
					>
						<span className="font-display text-lg sm:text-xl font-normal tracking-tight transition-colors duration-300 group-hover:text-copper">
							{profile?.name || 'Advaita Chandra'}
						</span>
						<span
							aria-hidden="true"
							className="h-1.5 w-1.5 rounded-full bg-copper shadow-[0_0_8px_rgba(194,149,106,0.6)]"
						/>
						<span
							aria-hidden="true"
							className="hidden h-px w-4 bg-copper/50 transition-all duration-300 group-hover:w-8 sm:block"
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
						{desktopLinks.map((route) => (
							<NavLink
								key={route.path}
								to={route.path}
								onPointerEnter={() => preloadRoute(route.path)}
								onFocus={() => preloadRoute(route.path)}
								onTouchStart={() => preloadRoute(route.path)}
								className={({ isActive }) =>
									`relative text-[0.82rem] font-mono tracking-wider uppercase transition-colors duration-300 py-1 ${
										isActive
											? "text-copper font-medium after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[1.5px] after:bg-copper"
											: "text-text-3 hover:text-text"
									}`
								}
							>
								{route.label}
							</NavLink>
						))}
					</nav>

					{/* Desktop Contact Action */}
					<div className="hidden sm:flex items-center gap-3.5">
						<NavLink
							to="/contact"
							onPointerEnter={() => preloadRoute('/contact')}
							onFocus={() => preloadRoute('/contact')}
							onTouchStart={() => preloadRoute('/contact')}
							className={({ isActive }) =>
								`group inline-flex items-center gap-1.5 border px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
									isActive
										? "border-copper bg-copper text-canvas font-medium"
										: "border-copper/60 hover:border-copper bg-copper/5 hover:bg-copper text-copper hover:text-canvas"
								}`
							}
						>
							<span>Contact</span>
							<ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</NavLink>
					</div>

					{/* Mobile Menu Toggle Button (44x44px touch target) */}
					<button
						type="button"
						onClick={() => setOpen((value) => !value)}
						className="-mr-2 flex h-11 w-11 items-center justify-center text-text-2 hover:text-text transition-colors md:hidden cursor-pointer"
						aria-expanded={open}
						aria-controls="mobile-nav"
						aria-label={open ? "Close navigation menu" : "Open navigation menu"}
					>
						<span className="relative block h-3 w-5">
							<span
								className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
									open ? "top-1.5 rotate-45 text-copper" : "top-0"
								}`}
							/>
							<span
								className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
									open ? "top-1.5 -rotate-45 text-copper" : "top-2.5"
								}`}
							/>
						</span>
					</button>
				</div>
			</div>

			{/* 2. Full-Screen Mobile Navigation Overlay (Covers entire screen cleanly) */}
			{open ? (
				<div
					id="mobile-nav"
					className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#050505] md:hidden overflow-y-auto overscroll-contain"
				>
					{/* Mobile Top Bar (preserves branding & close action at top) */}
					<div className="border-b border-white/[0.08] bg-canvas/95">
						<div className="shell flex h-16 items-center justify-between gap-6">
							<Link
								to="/"
								onClick={() => setOpen(false)}
								className="group flex items-center gap-3 text-text"
								aria-label={`${profile?.name || 'Advaita Chandra'}, home`}
							>
								<span className="font-display text-lg sm:text-xl font-normal tracking-tight text-[#E8E6E1]">
									{profile?.name || 'Advaita Chandra'}
								</span>
								<span
									aria-hidden="true"
									className="h-1.5 w-1.5 rounded-full bg-copper shadow-[0_0_8px_rgba(194,149,106,0.6)]"
								/>
							</Link>

							<button
								type="button"
								onClick={() => setOpen(false)}
								className="-mr-2 flex h-11 w-11 items-center justify-center text-text-2 hover:text-copper transition-colors cursor-pointer"
								aria-label="Close navigation menu"
							>
								<span className="relative block h-4 w-4">
									<span className="absolute left-0 top-2 block h-[1.5px] w-4 bg-current rotate-45" />
									<span className="absolute left-0 top-2 block h-[1.5px] w-4 bg-current -rotate-45" />
								</span>
							</button>
						</div>
					</div>

					<div className="shell flex flex-col justify-between flex-1 py-6">
						{/* Nav links section */}
						<div>
							<div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.06]">
								<span className="font-mono text-[10px] uppercase tracking-widest text-text-3">
									Directory
								</span>
								<span className="font-mono text-[10px] text-copper/80">
									{NAV_ITEMS.length} SECTIONS
								</span>
							</div>

							<ul className="flex flex-col divide-y divide-white/[0.05]">
								{NAV_ITEMS.map((route, idx) => (
									<li key={route.path}>
										<NavLink
											to={route.path}
											onClick={() => setOpen(false)}
											className={({ isActive }) =>
												`group flex items-center justify-between py-3.5 px-1 transition-colors ${
													isActive ? "text-copper" : "text-[#E8E6E1] hover:text-copper"
												}`
											}
										>
											<div className="flex items-center gap-3">
												<span
													className="h-1.5 w-1.5 rounded-full bg-copper transition-opacity"
													style={{
														opacity: location.pathname === route.path ? 1 : 0,
													}}
												/>
												<span className="font-serif text-2xl tracking-tight">
													{route.label}
												</span>
											</div>
											<span className="font-mono text-xs text-text-3 group-hover:text-copper transition-colors">
												0{idx + 1}
											</span>
										</NavLink>
									</li>
								))}
							</ul>
						</div>

						{/* Bottom meta & action area */}
						<div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-col gap-4">
							{/* Direct Contact Button */}
							<Link
								to="/contact"
								onClick={() => setOpen(false)}
								className="flex items-center justify-between p-3.5 bg-copper/10 border border-copper/40 text-copper hover:bg-copper hover:text-canvas transition-all font-mono text-xs tracking-wider uppercase"
							>
								<span>Initiate Contact</span>
								<ArrowUpRight className="h-4 w-4" />
							</Link>

							{/* Social Links Row */}
							<div className="flex items-center justify-between pt-1 font-mono text-[11px] text-text-3">
								<div className="flex items-center gap-3">
									{configuredSocials.map((link) => (
										<a
											key={link.id || link.label}
											href={link.kind === 'email' ? `mailto:${link.url}` : link.url}
											target={link.kind === 'email' ? undefined : '_blank'}
											rel={link.kind === 'email' ? undefined : 'noopener noreferrer'}
											className="hover:text-copper transition-colors py-1 px-1"
											aria-label={link.label}
										>
											{link.label}
										</a>
									))}
								</div>
								<div className="flex items-center gap-2">
									<span className="h-1.5 w-1.5 rounded-full bg-copper animate-pulse" />
									<span className="text-copper tracking-wider uppercase">India</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</header>
	)
}
