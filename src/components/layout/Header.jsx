import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '@/config/nav.js'
import { useContent } from '@/lib/content.jsx'
import { getRoutePreloadProps } from '@/lib/preload'
import { stopScroll, startScroll } from '@/lib/smooth-scroll.js'
import { InkKeys, useLensReset } from '@/components/features/ink/InkLens.jsx'

const EASE = [0.22, 1, 0.36, 1]

export default function Header() {
	const [open, setOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const location = useLocation()
	const { profile } = useContent()
	const menuRef = useRef(null)
	useLensReset()
	const name = profile?.name || 'Advaita Chandra'

	useEffect(() => setOpen(false), [location.pathname])

	// Hairline under the bar once the page leaves the top.
	useEffect(() => {
		const sentinel = document.createElement('div')
		sentinel.style.cssText = 'position:absolute;top:0;height:24px;width:1px;pointer-events:none'
		document.body.prepend(sentinel)
		const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting))
		io.observe(sentinel)
		return () => { io.disconnect(); sentinel.remove() }
	}, [])

	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden'
			stopScroll()
			menuRef.current?.querySelector('a')?.focus()
		} else {
			document.body.style.overflow = ''
			startScroll()
		}
		const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
		window.addEventListener('keydown', onKey)
		return () => {
			window.removeEventListener('keydown', onKey)
			document.body.style.overflow = ''
			startScroll()
		}
	}, [open])

	const links = NAV_ITEMS.filter((route) => route.path !== '/')

	return (
		<header
			className={`fixed inset-x-0 top-0 z-50 bg-canvas transition-[border-color] duration-200 border-b ${scrolled ? 'border-line' : 'border-transparent'}`}
		>
			<div className="shell flex h-16 items-center justify-between gap-6 pt-[env(safe-area-inset-top)]">
				<Link
					to="/"
					{...getRoutePreloadProps('/')}
					className="pen-link text-[15px] font-medium tracking-[-0.01em] text-ink"
					aria-label={`${name}, home`}
				>
					{name}
				</Link>

				<InkKeys className="hidden lg:block" />

				<nav className="hidden md:block" aria-label="Primary">
					<ul className="flex items-center gap-7">
						{links.map((route) => (
							<li key={route.path}>
								<NavLink
									to={route.path}
									{...getRoutePreloadProps(route.path)}
									className={({ isActive }) =>
										`pen-link py-1 text-[14px] transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
									}
								>
									{route.label}
								</NavLink>
							</li>
						))}
					</ul>
				</nav>

				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="-mr-2 flex h-11 items-center px-2 text-[15px] text-ink md:hidden"
					aria-expanded={open}
					aria-controls="mobile-nav"
				>
					{open ? 'Close' : 'Menu'}
				</button>
			</div>

			{typeof document !== 'undefined' &&
				createPortal(
					<AnimatePresence>
						{open && (
							<motion.div
								id="mobile-nav"
								ref={menuRef}
								role="dialog"
								aria-modal="true"
								aria-label="Site menu"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2, ease: EASE }}
								className="fixed inset-0 z-[100] flex flex-col bg-canvas md:hidden pt-[env(safe-area-inset-top)] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
							>
								<div className="shell flex h-16 items-center justify-between">
									<Link to="/" className="text-[15px] font-medium text-ink">{name}</Link>
									<button
										type="button"
										onClick={() => setOpen(false)}
										className="-mr-2 flex h-11 items-center px-2 text-[15px] text-ink"
									>
										Close
									</button>
								</div>
								<nav className="shell mt-8 flex-1" aria-label="Mobile">
									<ul>
										{NAV_ITEMS.map((route, i) => (
											<motion.li
												key={route.path}
												initial={{ opacity: 0, y: 12 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.04 + i * 0.04, duration: 0.42, ease: EASE }}
												className="border-b border-line"
											>
												<NavLink
													to={route.path}
													end={route.path === '/'}
													className={({ isActive }) =>
														`flex items-baseline justify-between py-4 text-[2rem] tracking-[-0.03em] ${isActive ? 'text-ink' : 'text-muted'}`
													}
												>
													{({ isActive }) => (
														<>
															<span>{route.label}</span>
															{isActive && <span className="mark-label text-accent">here</span>}
														</>
													)}
												</NavLink>
											</motion.li>
										))}
									</ul>
								</nav>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</header>
	)
}
