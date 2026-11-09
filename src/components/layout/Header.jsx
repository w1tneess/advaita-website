import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_ITEMS } from '@/config/nav.js'
import { useContent } from '@/lib/content.jsx'
import { getRoutePreloadProps } from '@/lib/preload'
import { stopScroll, startScroll } from '@/lib/smooth-scroll.js'
import { InkKeys, useLensReset } from '@/components/features/ink/InkLens.jsx'
import PenCircle from '@/components/features/ink/PenCircle.jsx'

const EASE = [0.22, 1, 0.36, 1]

// A margin note for each page, in his voice, shown in the phone menu.
const NOTES = {
	'/': 'start here',
	'/philosophy': 'what I am reading',
	'/photography': 'what caught my eye',
	'/blog': 'longer pieces',
	'/projects': 'things I built',
	'/about': 'who I am',
	'/contact': 'write to me',
}

export default function Header() {
	const [open, setOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [tucked, setTucked] = useState(false)
	const location = useLocation()
	const { profile } = useContent()
	const menuRef = useRef(null)
	useLensReset()
	const name = profile?.name || 'Advaita Chandra'
	const [first, ...rest] = name.split(' ')

	useEffect(() => setOpen(false), [location.pathname])

	// The bar steps aside while reading down the page and returns as soon as you scroll up.
	useEffect(() => {
		let last = window.scrollY
		let ticking = false
		const update = () => {
			const y = window.scrollY
			setScrolled(y > 24)
			if (Math.abs(y - last) > 6) setTucked(y > last && y > 160)
			last = y
			ticking = false
		}
		const onScroll = () => {
			if (!ticking) { ticking = true; requestAnimationFrame(update) }
		}
		update()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
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
			onFocusCapture={() => setTucked(false)}
			className={`fixed inset-x-0 top-0 z-50 border-b bg-canvas transition-[transform,border-color] duration-500 ease-[var(--ease-soft)] ${
				scrolled ? 'border-line' : 'border-transparent'
			} ${tucked && !open ? '-translate-y-full' : ''}`}
		>
			<div className="shell flex h-16 items-center justify-between gap-6 pt-[env(safe-area-inset-top)]">
				<Link to="/" {...getRoutePreloadProps('/')} className="group flex items-baseline gap-1 text-[15px] tracking-[-0.01em]" aria-label={`${name}, home`}>
					<span className="font-medium text-ink">{first}</span>{' '}
					<span className="text-muted transition-colors duration-200 group-hover:text-ink">{rest.join(' ')}</span>
				</Link>

				<div className="hidden items-center gap-2 lg:flex">
					<span className="mark-label !text-[1.125rem] text-text-3" aria-hidden="true">read by</span>
					<InkKeys />
				</div>

				<nav className="hidden md:block" aria-label="Primary">
					<ul className="flex items-center gap-7">
						{links.map((route) => (
							<li key={route.path}>
								<NavLink
									to={route.path}
									{...getRoutePreloadProps(route.path)}
									className={({ isActive }) =>
										`nav-link relative inline-block py-1 text-[14px] transition-colors ${isActive ? 'text-ink' : 'pen-link text-muted hover:text-ink'}`
									}
								>
									{({ isActive }) => (
										<>
											{route.label}
											{isActive && <PenCircle key={location.pathname} />}
										</>
									)}
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
					Menu
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
								transition={{ duration: 0.24, ease: EASE }}
								className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-canvas md:hidden pt-[env(safe-area-inset-top)] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
							>
								<div className="shell flex h-16 shrink-0 items-center justify-between">
									<Link to="/" className="flex items-baseline gap-1.5 text-[15px]">
										<span className="font-medium text-ink">{first}</span>{' '}
										<span className="text-muted">{rest.join(' ')}</span>
									</Link>
									<button type="button" onClick={() => setOpen(false)} className="-mr-2 flex h-11 items-center px-2 text-[15px] text-ink">
										Close
									</button>
								</div>

								<nav className="shell mt-6 flex-1" aria-label="Mobile">
									<ul>
										{NAV_ITEMS.map((route, i) => (
											<motion.li
												key={route.path}
												initial={{ opacity: 0, y: 14 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.05 + i * 0.045, duration: 0.45, ease: EASE }}
											>
												<NavLink to={route.path} end={route.path === '/'} className="group flex items-baseline justify-between gap-4 py-3">
													{({ isActive }) => (
														<>
															<span className={`relative text-[2.25rem] leading-none tracking-[-0.04em] ${isActive ? 'text-ink' : 'text-muted group-active:text-ink'}`}>
																{route.label}
																{isActive && <PenCircle />}
															</span>
															<span className="mark-label !text-[1.125rem] text-text-3">{NOTES[route.path]}</span>
														</>
													)}
												</NavLink>
											</motion.li>
										))}
									</ul>
								</nav>

								<div className="shell mt-10 shrink-0 border-t border-line pt-6 text-[14px] text-muted">
									<p><span className="mark-label !text-[1.125rem] text-fact">online I’m w1tneess</span></p>
									<p className="mark-label mt-3 !text-[1.125rem] text-ink">ex duris gloria</p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</header>
	)
}
