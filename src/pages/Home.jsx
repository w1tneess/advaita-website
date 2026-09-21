import { useState } from "react"
import { Link } from "react-router"
import { ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react"
import { useContent } from "@/lib/content.jsx"
import { submitContactForm } from "@/lib/supabase/api.js"
import Seo from "@/components/meta/Seo.jsx"
import { PUBLIC_ROUTES } from "@/config/nav.js"

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

function Hero() {
	const branches = [
		{ label: "Philosophy", desc: "Krishnamurti, Camus, inquiry notes", path: "/philosophy" },
		{ label: "Projects & Tools", desc: "Data analysis, code experiments", path: "/projects" },
		{ label: "Photography", desc: "Visual documentation & geometry", path: "/photography" },
		{ label: "Notes & Logs", desc: "Working essays & observations", path: "/blog" },
	]

	return (
		<section className="shell relative pt-[clamp(9.5rem,17vw,15rem)] pb-[clamp(3rem,6vw,5.5rem)] overflow-hidden">
			{/* Atmospheric Ambient Glows */}
			<div 
				className="ambient-glow top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(48rem,95vw)] h-[min(48rem,95vw)] opacity-20" 
				aria-hidden="true" 
			/>

			<div className="relative z-10 w-full">
				{/* Top Status Eyebrow */}
				<div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full border border-line bg-surface/60 text-muted font-mono text-[11px] mb-6 sm:mb-8 backdrop-blur-sm">
					<span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
					<span className="text-ink font-medium">Advaita Chandra</span>
					<span className="text-line">•</span>
					<span>Archive &amp; Notebook</span>
				</div>

				<div className="max-w-5xl">
					<h1 className="text-[clamp(2.15rem,1.4rem+3.5vw,4.5rem)] font-normal tracking-tight text-ink mb-[clamp(1rem,2vw,1.5rem)] leading-[1.12] text-balance">
						I am someone who notices, thinks, builds, photographs, reads, and writes.
					</h1>
					
					<p className="text-[clamp(1rem,0.95rem+0.4vw,1.25rem)] text-muted leading-relaxed mb-[clamp(1.5rem,3vw,2.5rem)] max-w-3xl">
						Working drafts, code experiments, and study notes tracking my interests in creative computing, philosophy, history, and internet infrastructure.
					</p>

					{/* Primary Call to Action */}
					<div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-[clamp(2.5rem,5vw,4rem)]">
						<Link
							to="/projects"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-accent text-canvas font-mono text-xs uppercase tracking-wider font-semibold hover:bg-accent-strong active:scale-[0.98] transition-all shadow-subtle"
						>
							<span>Explore Projects</span>
							<ArrowUpRight className="h-3.5 w-3.5" />
						</Link>
						<a
							href="#inquiries"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-line bg-surface/50 text-muted hover:text-ink hover:border-line-strong active:scale-[0.98] transition-all font-mono text-xs uppercase tracking-wider"
						>
							<span>Reading Archive</span>
							<span aria-hidden="true">&darr;</span>
						</a>
					</div>
				</div>

				{/* Archive Directory Explorer Strip - Spans full width */}
				<div className="pt-6 border-t border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
					{branches.map((b) => (
						<Link
							key={b.path}
							to={b.path}
							className="group p-3.5 sm:p-4 rounded-sm border border-line/60 bg-surface/30 hover:bg-surface/70 hover:border-line-strong transition-all duration-200 active:scale-[0.99] flex flex-col justify-between"
						>
							<div className="flex items-center justify-between mb-1.5">
								<span className="font-mono text-xs text-ink group-hover:text-accent transition-colors font-medium">
									{b.label}
								</span>
								<ArrowUpRight className="h-3 w-3 text-muted group-hover:text-accent transition-colors opacity-60 group-hover:opacity-100" />
							</div>
							<p className="text-[11px] text-muted leading-relaxed line-clamp-2">
								{b.desc}
							</p>
						</Link>
					))}
				</div>
			</div>
		</section>
	)
}

function SelectedProjects({ featuredProjects }) {
	return (
		<section className="shell pt-[clamp(2rem,4vw,3.5rem)] border-t border-line" id="projects">
			<div className="flex flex-wrap items-end justify-between gap-4 mb-6">
				<h2 className="text-xl sm:text-2xl font-normal text-ink text-balance">Currently building</h2>
				<Link
					to="/projects"
					className="font-mono text-xs tracking-wide text-ink border-b border-line-strong hover:text-accent hover:border-accent transition-colors"
				>
					View all projects &rarr;
				</Link>
			</div>

			<div className="divide-y divide-line border-t border-b border-line">
				{featuredProjects.map((project) => {
					const category = project.categories?.[0] || project.status || "Project"
					const rawLink = project.links?.live || project.links?.repository
					const link = rawLink ? rawLink : null

					return (
						<article key={project.id} className="group py-5 sm:py-6 grid gap-3 sm:grid-cols-[1fr_2fr] items-baseline transition-all hover:bg-surface/60 -mx-3 px-3 sm:-mx-4 sm:px-4 rounded">
							<div className="font-mono text-xs tracking-widest uppercase text-muted">
								{category}
							</div>
							<div>
								<h3 className="text-base sm:text-lg font-normal text-ink group-hover:text-accent transition-colors leading-snug mb-1.5">
									{link ? (
										<a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-2">
											<span>{project.title}</span>
											<ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity text-accent" />
										</a>
									) : (
										project.title
									)}
								</h3>
								<p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-2xl">
									{project.summary || project.description}
								</p>
							</div>
						</article>
					)
				})}
			</div>
		</section>
	)
}

function ActiveInquiries({ philosophy = {} }) {
	const thinkers = philosophy?.thinkers?.slice(0, 5) || [
		{ name: "J. Krishnamurti", role: "Observer & Mental Habits" },
		{ name: "Albert Camus", role: "The Absurd as Baseline" },
		{ name: "Fyodor Dostoevsky", role: "Rational Egoism & Will" },
		{ name: "Ramana Maharshi", role: "Practical Self-Inquiry" },
		{ name: "Osho", role: "Competing Historical Narratives" },
	]

	const inquiries = [
		{
			category: "Philosophy & Psychology",
			status: "Active inquiry",
			title: "Attention, observation, and mental habits",
			summary:
				"Reading J. Krishnamurti alongside modern cognitive psychology to explore how non-verbal attention affects habits of thought and reaction.",
			locus: "Philosophy",
			text: "J. Krishnamurti / Albert Camus",
			link: "/philosophy",
			linkText: "Read note",
		},
		{
			category: "History & Data Analysis",
			status: "Completed study",
			title: "Terrorism in India: Data Visualisation, 1947–2026",
			summary:
				"A Python data project collecting and visualising records from 1947 to 2026. Highlights where different historical databases conflict and preserves data gaps rather than hiding them.",
			locus: "Historical Data",
			text: "Python / Matplotlib",
			link: "/projects",
			linkText: "View project",
		},
		{
			category: "Historical Accounts",
			status: "Documentary research",
			title: "Osho: Comparing Conflicting Accounts",
			summary:
				"A study comparing published books and memoirs about Osho and his movements. Records conflicting versions side by side instead of choosing a single narrative.",
			locus: "Published Sources",
			text: "Comparative Analysis",
			link: "/projects",
			linkText: "Read document",
		},
		{
			category: "Computer Systems",
			status: "Ongoing learning",
			title: "Fundamentals of Computer Systems & Security",
			summary:
				"Learning the basics of networks, operating systems, and defensive security by building small tools and studying how systems handle failures.",
			locus: "Systems & Security",
			text: "Networking / Linux",
			link: "/about",
			linkText: "View log",
		},
		{
			category: "Public Policy & Governance",
			status: "Study notes",
			title: "Policy Decisions: Costs, Incentives, and Outcomes",
			summary:
				"Notes tracking how policies transition from initial proposals to ground realities in India, looking at budgets, incentives, and measurable results.",
			locus: "Indian Governance",
			text: "Policy Analysis",
			link: "/about",
			linkText: "View log",
		},
	]

	return (
		<section className="shell pt-[clamp(2rem,4vw,3.5rem)]" id="inquiries">
			<div className="border-b border-line pb-4 mb-6">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div>
						<h2 className="text-xl sm:text-2xl font-normal text-ink leading-snug text-balance">
							Currently studying &amp; reading
						</h2>
					</div>
					<div className="max-w-xs md:text-right">
						<p className="text-sm text-muted leading-relaxed">
							Notes, studies, and questions I am exploring in philosophy, history, governance, and computer systems.
						</p>
					</div>
				</div>
			</div>

			<div className="grid-asymmetric items-start">
				<div className="space-y-[var(--spacing-fluid-lg)] lg:sticky lg:top-12 border-b lg:border-b-0 lg:border-r border-line pb-10 lg:pb-0 lg:pr-[var(--spacing-fluid-md)]">
					<div>
						<h3 className="font-sans text-sm tracking-wide text-ink mb-4">How I Work</h3>
						<p className="text-muted text-base leading-relaxed">
							I study topics through primary sources and datasets. These notes track questions that come up across books, official records, and data projects.
						</p>
					</div>

					<div className="pt-8 border-t border-line">
						<div className="flex items-center justify-between mb-6">
							<h3 className="font-sans text-sm tracking-wide text-ink">Readings &amp; Thinkers</h3>
							<Link
								to="/philosophy"
								className="font-sans text-sm tracking-wide text-ink border-b border-line-strong hover:text-muted hover:border-muted transition-colors"
							>
								Reading log &rarr;
							</Link>
						</div>
						<ul className="space-y-5 text-base">
							{thinkers.map((thinker) => (
								<li
									key={thinker.name}
									className="flex justify-between items-start gap-4 text-muted hover:text-ink transition-colors"
								>
									<span className="font-normal whitespace-nowrap text-ink">{thinker.name}</span>
									<span className="text-right italic">
										{thinker.description ? thinker.description.split(".")[0].slice(0, 24) : thinker.role || "Inquiry"}
									</span>
								</li>
							))}
						</ul>
					</div>

					<div className="pt-8 border-t border-line">
						<h3 className="font-sans text-sm tracking-wide text-ink mb-4">Guiding Rule</h3>
						<blockquote className="text-lg leading-relaxed text-muted italic font-display">
							&ldquo;On this site I try to separate four things: facts from sources, my inferences, my opinions, and things I do not know.&rdquo;
						</blockquote>
					</div>
				</div>

				<div className="divide-y divide-line border-t border-b border-line lg:border-t-0 lg:border-b-0">
					{inquiries.map((item, idx) => (
						<article
							key={idx}
							className="group py-7 sm:py-9 grid gap-3 sm:grid-cols-[1fr_2fr] items-baseline transition-all hover:bg-surface/60 -mx-3 px-3 sm:-mx-6 sm:px-6 rounded first:pt-4"
						>
							<div className="font-sans text-xs tracking-widest uppercase text-muted">
								{item.category}
							</div>

							<div>
								<h3 className="text-[length:var(--text-2xl)] font-normal text-ink group-hover:text-accent transition-colors leading-snug mb-2 sm:mb-3">
									<Link to={item.link} className="inline-flex items-baseline gap-2">
										<span>{item.title}</span>
										<ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0 text-accent" />
									</Link>
								</h3>

								<p className="text-lg text-muted font-sans leading-relaxed max-w-2xl">
									{item.summary}
								</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

const RATE_LIMIT_KEY = 'advaita_contact_last_submit'
const RATE_LIMIT_MS = 30000

function Correspondence({ publicSocialLinks }) {
	const links = (publicSocialLinks || []).filter((l) => l.url && l.kind !== "email")

	const [form, setForm] = useState({
		name: "",
		email: "",
		topic: "General Inquiry",
		message: "",
		readingRef: "",
		hp_check: "",
	})
	const [status, setStatus] = useState("idle")
	const [feedback, setFeedback] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (form.hp_check) {
			setStatus("success")
			setFeedback("Message sent. Thank you for taking the time to write.")
			return
		}

		try {
			const lastSubmit = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || "0", 10)
			const elapsed = Date.now() - lastSubmit
			if (elapsed < RATE_LIMIT_MS) {
				const waitSec = Math.ceil((RATE_LIMIT_MS - elapsed) / 1000)
				setStatus("error")
				setFeedback(`Please wait ${waitSec}s before sending another dispatch.`)
				return
			}
		} catch (_) {
			/* ignore localStorage access errors */
		}

		if (!form.message.trim()) {
			setFeedback("Please enter a note or message.")
			return
		}

		if (form.message.trim().length < 5) {
			setFeedback("Message is too short (minimum 5 characters).")
			return
		}

		if (form.email.trim()) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
			if (!emailRegex.test(form.email.trim())) {
				setFeedback("Please enter a valid email address.")
				return
			}
		}

		setStatus("submitting")
		setFeedback("")
		try {
			const finalMessage = form.readingRef.trim()
				? `${form.message.trim()}\n\n[Reference/Link]: ${form.readingRef.trim().slice(0, 200)}`
				: form.message.trim()

			await submitContactForm({
				name: form.name.trim() || "Anonymous Reader",
				email: form.email.trim() || "reader@local",
				topic: form.topic,
				message: finalMessage,
			})

			try {
				localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString())
			} catch (_) {
				/* ignore localStorage write errors */
			}

			setStatus("success")
			setFeedback("Message sent. Thank you for taking the time to write.")
			setForm({
				name: "",
				email: "",
				topic: "General Inquiry",
				message: "",
				readingRef: "",
				hp_check: "",
			})
		} catch (err) {
			console.error(err)
			setStatus("error")
			const isNetworkErr =
				err?.message?.includes("Failed to fetch") ||
				err?.message?.includes("NetworkError") ||
				err?.message?.includes("network") ||
				err?.name === "TypeError"

			setFeedback(
				isNetworkErr
					? "Notice: Could not connect to transmission service (possibly blocked by an adblocker or privacy shield). You can write directly to advaita974@gmail.com."
					: "Notice: Message could not be sent right now. You can also reach me directly at advaita974@gmail.com."
			)
		}
	}

	return (
		<section className="shell py-[var(--spacing-fluid-section)]" id="correspondence">
			<div className="w-full border-t border-line mb-[var(--spacing-fluid-xl)]" />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-fluid-lg)] items-start">
				<div className="space-y-[var(--spacing-fluid-md)]">
					<div>
						<span className="font-utility text-muted block mb-3">
							Get in Touch
						</span>
						<h2 className="text-[length:var(--text-4xl)] font-normal text-ink leading-[1.1] text-balance">
							Questions, corrections, or book recommendations.
						</h2>
					</div>

					<p className="text-lg text-muted leading-relaxed max-w-xl">
						I appreciate constructive feedback and book recommendations. If you spot an error in my data, a missing citation, or want to discuss any of the topics here, please write directly.
					</p>

					<div className="max-w-xl space-y-4 pt-6 border-t border-line">
						<div className="flex items-center justify-between font-utility">
							<span className="text-ink">Location</span>
							<span className="text-muted">India</span>
						</div>
						<div className="flex items-center justify-between font-utility">
							<span className="text-ink">Response Time</span>
							<span className="text-muted">Within ~24–48 hours</span>
						</div>
					</div>

					<div className="pt-6 border-t border-line max-w-xl">
						<h3 className="font-utility text-ink mb-4">Direct Channels</h3>
						<div className="flex flex-wrap gap-6 font-utility">
							{links.map((link) => (
								<a
									key={link.id}
									href={link.url}
									target="_blank"
									rel="me noopener noreferrer"
									className="text-ink border-b border-transparent hover:border-ink transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
								>
									<span>{link.label}</span>
									<ArrowUpRight className="h-3 w-3" />
								</a>
							))}
							<Link
								to="/contact"
								className="text-ink border-b border-transparent hover:border-ink transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
							>
								<span>Full Form</span>
								<ArrowRight className="h-3 w-3" />
							</Link>
						</div>
					</div>
				</div>

				<div>
					<div className="mb-6">
						<h3 className="text-xl sm:text-2xl font-normal text-ink mb-2">Send a Message</h3>
						<p className="text-sm text-muted">Fields marked with * are required.</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="hidden" aria-hidden="true">
							<label htmlFor="contact-hp-home">Leave blank</label>
							<input
								id="contact-hp-home"
								type="text"
								name="hp_check"
								value={form.hp_check}
								onChange={(e) => setForm({ ...form, hp_check: e.target.value })}
								tabIndex={-1}
								autoComplete="off"
							/>
						</div>

						<div>
							<label htmlFor="contact-topic" className="font-utility text-ink block mb-2">
								Topic of Inquiry
							</label>
							<select 
								id="contact-topic"
								value={form.topic}
								onChange={(e) => setForm({ ...form, topic: e.target.value })}
								autoComplete="off"
								className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
							>
								{["General Inquiry", "Correction / Citation", "Book Recommendation", "Project Discussion"].map((t) => (
									<option key={t} value={t}>{t}</option>
								))}
							</select>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							<div>
								<label htmlFor="contact-sender-name" className="font-utility text-ink block mb-2">
									Your Name
								</label>
								<input
									id="contact-sender-name"
									type="text"
									maxLength={80}
									placeholder="Anonymous Reader"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									autoComplete="name"
									spellCheck={false}
									className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
								/>
							</div>
							<div>
								<label htmlFor="contact-sender-email" className="font-utility text-ink block mb-2">
									Email Address
								</label>
								<input
									id="contact-sender-email"
									type="email"
									inputMode="email"
									maxLength={120}
									placeholder="you@example.com"
									value={form.email}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									autoComplete="email"
									spellCheck={false}
									className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="contact-message" className="font-utility text-ink block mb-2">
								Message *
							</label>
							<textarea
								id="contact-message"
								rows={5}
								maxLength={2000}
								placeholder="What's on your mind?"
								value={form.message}
								onChange={(e) => setForm({ ...form, message: e.target.value })}
								autoComplete="off"
								spellCheck={true}
								className="w-full bg-surface border border-line p-4 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
							/>
						</div>

						<div>
							<label htmlFor="contact-reading-ref" className="font-utility text-ink block mb-2">
								Recommended Reading/Link (Optional)
							</label>
							<input
								id="contact-reading-ref"
								type="text"
								inputMode="url"
								maxLength={200}
								placeholder="https://…"
								value={form.readingRef}
								onChange={(e) => setForm({ ...form, readingRef: e.target.value })}
								autoComplete="url"
								spellCheck={false}
								className="w-full bg-surface border border-line px-4 py-3 text-base text-ink focus:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
							/>
						</div>

						{feedback && (
							<p className={`text-base font-utility mt-4 ${status === "success" ? "text-ink" : "text-limitation"}`}>
								{feedback}
							</p>
						)}

						<div className="pt-4 flex items-center justify-between">
							<button
								type="submit"
								disabled={status === "submitting"}
								className="inline-flex items-center gap-2 bg-ink text-canvas px-6 py-3 font-utility hover:bg-muted disabled:opacity-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
							>
								{status === "submitting" ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Sending…</span>
									</>
								) : status === "success" ? (
									<>
										<Check className="h-4 w-4" />
										<span>Sent</span>
									</>
								) : (
									<>
										<span>Submit</span>
										<ArrowRight className="h-4 w-4" />
									</>
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default function Home() {
	const { featuredProjects, philosophy, publicSocialLinks } = useContent()

	return (
		<>
			<Seo title={ROUTE.title} description={ROUTE.description} path="/" />
			<Hero />
			<SelectedProjects featuredProjects={featuredProjects} />
			<ActiveInquiries philosophy={philosophy} />
			<Correspondence publicSocialLinks={publicSocialLinks} />
		</>
	)
}
