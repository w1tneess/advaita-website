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
	const [lensOpen, setLensOpen] = useState(false)
	const pageRef = useRef(null)
	const lensRef = useRef(null)
	const location = useLocation()
	const { profile } = useContent()
	const menuRef = useRef(null)
	useLensReset()
	const name = profile?.name || 'Advaita Chandra'
	const [first, ...rest] = name.split(' ')

	useEffect(() => setOpen(false), [location.pathname])

	// Hairline once the page leaves the top, and the page count as you read.
	useEffect(() => {
		let ticking = false
		const update = () => {
			const y = window.scrollY
			setScrolled(y > 24)
			// Page count, like a notebook: one page per screen of reading.
			if (pageRef.current) {
				const total = Math.max(1, Math.round(document.documentElement.scrollHeight / window.innerHeight))
				const now = Math.min(total, Math.floor((y + window.innerHeight * 0.5) / window.innerHeight) + 1)
				pageRef.current.textContent = `p. ${now} / ${total}`
			}
			ticking = false
		}
		const onScroll = () => {
			if (!ticking) { ticking = true; requestAnimationFrame(update) }
		}
		update()
		window.addEventListener('scroll', onScroll, { passive: true })
		window.addEventListener('resize', onScroll)
		return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
	}, [location.pathname])

	// The lens panel closes on a click outside it, on Escape, and on navigation.
	useEffect(() => setLensOpen(false), [location.pathname])
	useEffect(() => {
		if (!lensOpen) return
		const onDown = (e) => { if (!lensRef.current?.contains(e.target)) setLensOpen(false) }
		const onKey = (e) => { if (e.key === 'Escape') setLensOpen(false) }
		document.addEventListener('pointerdown', onDown)
		window.addEventListener('keydown', onKey)
		return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey) }
	}, [lensOpen])

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

	const links = NAV_ITEMS.filter((route) => route.path !== '/' && route.path !== '/contact')

	return (
		<header
			className={`fixed inset-x-0 top-0 z-50 border-b bg-canvas transition-[border-color] duration-300 ${scrolled ? 'border-line' : 'border-transparent'}`}
		>
			<div className="shell grid h-[72px] grid-cols-[1fr_auto] items-center gap-6 pt-[env(safe-area-inset-top)] md:grid-cols-[1fr_auto_1fr]">
				{/* Signed, like the inside cover of a notebook: the name in type, the surname in his hand. */}
				<Link to="/" {...getRoutePreloadProps('/')} className="group relative flex w-fit items-baseline gap-2" aria-label={`${name}, home`}>
					<span className="text-[20px] font-medium tracking-[-0.04em] text-ink">{first}</span>{' '}
					<span className="mark-label !text-[1.5rem] text-fact transition-transform duration-500 ease-[var(--ease-soft)] group-hover:-rotate-3">{rest.join(' ')}</span>
				</Link>

				<nav className="hidden md:block" aria-label="Primary">
					<ul className="flex items-center gap-6">
						{links.map((route) => (
							<li key={route.path}>
								<NavLink
									to={route.path}
									{...getRoutePreloadProps(route.path)}
									className={({ isActive }) =>
										`nav-link relative inline-block px-1 py-1 text-[14px] transition-colors ${isActive ? 'text-ink' : 'nav-swipe text-muted hover:text-ink'}`
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

				<div className="hidden items-center justify-end gap-4 md:flex">
					<span ref={pageRef} aria-hidden="true" className="mark-label hidden !text-[1.25rem] tabular-nums text-text-3 xl:inline">p. 1 / 1</span>
					<div ref={lensRef} className="relative hidden lg:block">
						<button
							type="button"
							onClick={() => setLensOpen((v) => !v)}
							aria-expanded={lensOpen}
							aria-controls="lens-panel"
							title="Lens: read by one kind of claim"
							className={`flex h-10 items-center gap-2.5 rounded-[6px] border px-3 text-[14px] transition-colors duration-200 ${lensOpen ? 'border-ink text-ink' : 'border-line text-muted hover:border-line-strong hover:text-ink'}`}
						>
							<span className="flex gap-1" aria-hidden="true">
								{['fact', 'analysis', 'opinion', 'limitation'].map((k) => (
									<span key={k} className="h-2 w-2 rounded-full" style={{ background: `var(--color-${k})` }} />
								))}
							</span>
							<span className="sr-only">Lens: read by one kind of claim</span>
						</button>
						<AnimatePresence>
							{lensOpen && (
								<motion.div
									id="lens-panel"
									initial={{ opacity: 0, y: -6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.22, ease: EASE }}
									className="absolute right-0 top-full mt-3 w-[22rem] rounded-[8px] border border-line bg-raised p-5 shadow-raised"
								>
									<p className="mark-label !text-[1.25rem] text-text-3">read by one kind of claim</p>
									<InkKeys variant="hero" className="mt-4 [&_ul]:!grid [&_ul]:grid-cols-2 [&_ul]:gap-x-4" />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
					<NavLink to="/contact" {...getRoutePreloadProps('/contact')} className="btn-ink !px-4 !py-2.5 text-[14px]">
						Write to me
					</NavLink>
				</div>

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
										<span className="mark-label !text-[1.4rem] text-fact">{rest.join(' ')}</span>
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
