import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { Link, NavLink, useLocation } from "react-router"
import { ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { NAV_ITEMS } from '@/config/nav.js'
import { useContent } from '@/lib/content.jsx'
import { getRoutePreloadProps } from '@/lib/preload.js'
import { stopScroll, startScroll } from '@/lib/smooth-scroll.js'

export default function Header() {
	const [open, setOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const location = useLocation()
	const { profile, publicSocialLinks } = useContent()

	useEffect(() => {
		setOpen(false)
	}, [location.pathname])

	// Smooth scroll listener for frosted glass header
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}
		window.addEventListener('scroll', handleScroll, { passive: true })
		handleScroll()
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
			stopScroll()
		} else {
			document.body.style.overflow = ''
			startScroll()
		}
		return () => {
			document.body.style.overflow = ''
			startScroll()
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
		<header
			className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-canvas/85 backdrop-blur-md border-b border-line shadow-subtle pt-[max(0.5rem,env(safe-area-inset-top))] pb-2.5 sm:py-3"
					: "bg-transparent border-b border-transparent pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-5 pb-2"
			}`}
		>
			<div className="shell flex h-12 sm:h-14 items-center justify-between gap-[var(--spacing-fluid-md)]">
				{/* Brand Wordmark */}
				<Link
					to="/"
					{...getRoutePreloadProps('/')}
					className="group flex items-center gap-2.5 sm:gap-3 text-ink"
					aria-label={`${profile?.name || 'Advaita Chandra'}, home`}
				>
					<span className="font-display text-xl sm:text-2xl font-normal tracking-tight transition-colors duration-300 group-hover:text-accent">
						{profile?.name || 'Advaita Chandra'}
					</span>
					<span
						aria-hidden="true"
						className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(194,149,106,0.6)]"
					/>
					<span
						aria-hidden="true"
						className="hidden h-px w-4 bg-accent/50 transition-all duration-300 group-hover:w-8 sm:block"
					/>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden items-center gap-7 lg:gap-8 md:flex" aria-label="Primary">
					{desktopLinks.map((route) => (
						<NavLink
							key={route.path}
							to={route.path}
							{...getRoutePreloadProps(route.path)}
							className={({ isActive }) =>
								`relative text-[length:var(--text-label)] font-sans tracking-wide transition-colors duration-300 py-1 ${
									isActive
										? "text-ink font-medium"
										: "text-muted hover:text-ink"
								}`
							}
						>
							{({ isActive }) => (
								<>
									<span>{route.label}</span>
									{isActive && (
										<motion.span
											layoutId="activeNavIndicator"
											className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
											transition={{ type: "spring", stiffness: 380, damping: 30 }}
										/>
									)}
								</>
							)}
						</NavLink>
					))}
				</nav>

				{/* Desktop Contact Action */}
				<div className="hidden sm:flex items-center gap-3.5">
					<NavLink
						to="/contact"
						{...getRoutePreloadProps('/contact')}
						className={({ isActive }) =>
							`group inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[length:var(--text-label)] font-sans tracking-wide border rounded-sm transition-all duration-300 active:scale-[0.98] ${
								isActive
									? "text-ink border-accent bg-accent/10"
									: "text-muted border-line hover:text-ink hover:border-line-strong hover:bg-surface"
							}`
						}
					>
						<span>Contact</span>
						<ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-accent" />
					</NavLink>
				</div>

				{/* Mobile Menu Toggle Button (Touch target min 44x44px) */}
				<button
					type="button"
					onClick={() => setOpen((value) => !value)}
					className="-mr-2 relative z-50 flex h-11 w-11 items-center justify-center text-muted hover:text-ink transition-colors md:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
					aria-expanded={open}
					aria-controls="mobile-nav"
					aria-label={open ? "Close navigation menu" : "Open navigation menu"}
				>
					<span className="relative block h-3.5 w-5 pointer-events-none">
						<span
							className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
								open ? "top-1.5 rotate-45 text-accent" : "top-0.5"
							}`}
						/>
						<span
							className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
								open ? "top-1.5 -rotate-45 text-accent" : "top-2.5"
							}`}
						/>
					</span>
				</button>
			</div>

			{/* Full-Screen Mobile Navigation Overlay (Portaled to document.body so header backdrop-blur never traps fixed positioning) */}
			{typeof document !== 'undefined' &&
				createPortal(
					<AnimatePresence>
						{open && (
							<motion.div
								id="mobile-nav"
								initial={{ opacity: 0, y: -8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
								className="fixed inset-0 z-[100] flex flex-col justify-between bg-canvas/98 backdrop-blur-2xl md:hidden overflow-y-auto overscroll-contain pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
							>
								{/* Mobile Top Bar */}
								<div className="border-b border-line bg-surface/40">
									<div className="shell flex h-14 sm:h-16 items-center justify-between gap-6">
										<Link
											to="/"
											onClick={() => setOpen(false)}
											className="group flex items-center gap-2.5 text-ink"
											aria-label={`${profile?.name || 'Advaita Chandra'}, home`}
										>
											<span className="font-display text-xl font-normal tracking-tight text-ink">
												{profile?.name || 'Advaita Chandra'}
											</span>
											<span
												aria-hidden="true"
												className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(194,149,106,0.6)]"
											/>
										</Link>

										<button
											type="button"
											onClick={() => setOpen(false)}
											className="-mr-2 flex h-11 w-11 items-center justify-center text-muted hover:text-accent transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm active:scale-95"
											aria-label="Close navigation menu"
										>
											<span className="relative block h-4 w-4 pointer-events-none">
												<span className="absolute left-0 top-2 block h-[1.5px] w-4 bg-current rotate-45" />
												<span className="absolute left-0 top-2 block h-[1.5px] w-4 bg-current -rotate-45" />
											</span>
										</button>
									</div>
								</div>

								<div className="shell flex flex-col justify-between flex-1 py-5">
									{/* Nav links section */}
									<div>
										<div className="flex items-center justify-between pb-2.5 mb-2 border-b border-line">
											<span className="font-mono text-xs text-muted">
												Navigation
											</span>
											<span className="font-mono text-xs text-accent">
												Directory
											</span>
										</div>

										<ul className="flex flex-col divide-y divide-line">
											{NAV_ITEMS.map((route, idx) => (
												<motion.li
													key={route.path}
													initial={{ opacity: 0, x: -6 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: idx * 0.025, duration: 0.2 }}
												>
													<NavLink
														to={route.path}
														onClick={() => setOpen(false)}
														{...getRoutePreloadProps(route.path)}
														className={({ isActive }) =>
															`group flex items-center justify-between py-3.5 px-2 rounded-md transition-all active:scale-[0.98] ${
																isActive ? "text-accent bg-surface/50" : "text-ink hover:text-accent hover:bg-surface/30"
															}`
														}
													>
														<div className="flex flex-col pr-4">
															<div className="flex items-center gap-2.5">
																<span
																	className="h-1.5 w-1.5 rounded-full bg-accent transition-opacity"
																	style={{
																		opacity: location.pathname === route.path ? 1 : 0,
																	}}
																/>
																<span className="font-sans text-lg font-normal tracking-tight">
																	{route.label}
																</span>
															</div>
															{route.desc && (
																<span className="text-xs text-muted pl-4 mt-0.5 line-clamp-1 font-sans">
																	{route.desc}
																</span>
															)}
														</div>
														<ArrowUpRight className="h-4 w-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-50 group-hover:opacity-100 flex-shrink-0" />
													</NavLink>
												</motion.li>
											))}
										</ul>
									</div>

									{/* Bottom meta & action area */}
									<div className="mt-6 pt-5 border-t border-line flex flex-col gap-3.5">
										{/* Direct Contact Button */}
										<Link
											to="/contact"
											onClick={() => setOpen(false)}
											{...getRoutePreloadProps('/contact')}
											className="flex items-center justify-between p-3.5 bg-surface border border-line hover:border-accent text-ink hover:text-accent transition-all font-mono text-xs rounded-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
										>
											<span>Get in touch</span>
											<ArrowUpRight className="h-4 w-4 text-accent" />
										</Link>

										{/* Social Links Row */}
										<div className="flex items-center justify-between pt-1 font-mono text-xs text-muted">
											<div className="flex items-center gap-3">
												{configuredSocials.map((link) => (
													<a
														key={link.id || link.label}
														href={link.kind === 'email' ? `mailto:${link.url}` : link.url}
														target={link.kind === 'email' ? undefined : '_blank'}
														rel={link.kind === 'email' ? undefined : 'noopener noreferrer'}
														className="hover:text-accent transition-colors py-1 px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm"
														aria-label={link.label}
													>
														{link.label}
													</a>
												))}
											</div>
											<div className="flex items-center gap-2">
												<span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
												<span className="text-muted">India</span>
											</div>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body
				)}
		</header>
	)
}
