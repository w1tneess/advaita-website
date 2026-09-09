import { useState } from "react"
import { Link } from "react-router"
import { ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react"
import Reveal from "@/components/ui/Reveal.jsx"
import SectionIntro from "@/components/ui/SectionIntro.jsx"
import ProjectCard from "@/components/features/ProjectCard.jsx"
import { useContent } from "@/lib/content.jsx"
import { submitContactForm } from "@/lib/supabase/api.js"
import Seo from "@/components/meta/Seo.jsx"
import { PUBLIC_ROUTES } from "@/config/nav.js"

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'home')

function Hero({ profile }) {
	return (
		<section className="shell pt-8 sm:pt-16 md:pt-28 lg:pt-36 pb-16 md:pb-28">
			<div className="relative grid items-start gap-y-8 sm:gap-y-12 lg:grid-cols-12 lg:gap-x-16 xl:gap-x-20">
				{/* Left Editorial Pillar (7 cols) */}
				<div className="relative z-20 lg:col-span-7 flex flex-col justify-between">
					<Reveal y={18} delay={0.04}>
						<h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-normal tracking-[-0.02em] text-[#E8E6E1] leading-[1.08] sm:leading-[1.02] select-none break-words">
							<span className="inline sm:block">Advaita </span>
							<span className="inline sm:block sm:mt-1.5 text-[#E8E6E1]">Chandra</span>
						</h1>
						<div className="w-12 sm:w-16 h-[1px] bg-copper/70 my-4 sm:mt-8 sm:mb-7" />
					</Reveal>

					<Reveal y={14} delay={0.1}>
						<div className="max-w-[34rem]">
							<p className="font-serif text-base sm:text-xl text-text/90 font-normal leading-snug">
								Student and independent learner based in India.
							</p>
							<p className="text-xs sm:text-sm md:text-base leading-relaxed text-text-2/80 font-light mt-2 sm:mt-3">
								I study philosophy, history, and computer systems. This website collects my projects, reading notes, and open questions on data and ideas.
							</p>
						</div>
					</Reveal>

					<Reveal y={14} delay={0.16}>
						<div className="mt-6 sm:mt-10 flex flex-row items-center gap-2.5 sm:gap-4">
							<a
								href="#projects"
								className="group inline-flex items-center justify-center gap-2 border border-text px-4 py-2.5 sm:px-6 sm:py-3 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-text bg-transparent hover:bg-text hover:text-canvas transition-all flex-1 sm:flex-initial text-center"
							>
								<span>Selected Projects</span>
								<span className="transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
							</a>
							<Link
								to="/projects"
								className="inline-flex items-center justify-center gap-1.5 border border-line px-3.5 py-2.5 sm:px-5 sm:py-3 text-[11px] sm:text-xs font-mono uppercase tracking-wider text-text-2 hover:border-copper hover:text-copper transition-all flex-1 sm:flex-initial text-center"
							>
								<span>Projects Index</span>
								<ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-copper" />
							</Link>
						</div>
					</Reveal>
				</div>

				{/* Right Darkroom Film Contact Sheet (5 cols) */}
				<Reveal y={22} delay={0.08} className="relative z-10 lg:col-span-5 mt-4 lg:mt-0">
					<div className="bg-[#0b0c0c] border border-line p-3 sm:p-4 shadow-2xl relative">
						{/* Contact Sheet Header Metadata */}
						<div className="flex justify-between items-center font-mono text-[10px] text-text-3 pb-2.5 mb-3 border-b border-line">
							<span className="text-copper font-medium">FRAME 04</span>
							<span className="tracking-wider">ILFORD HP5+ 400</span>
						</div>

						{/* Film Frame Container with Corner Registration Marks */}
						<div className="relative overflow-hidden group bg-[#050505]">
							{/* Corner Optical Registration Brackets */}
							<span className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-copper/80 z-20 pointer-events-none" />
							<span className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-copper/80 z-20 pointer-events-none" />
							<span className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-copper/80 z-20 pointer-events-none" />
							<span className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-copper/80 z-20 pointer-events-none" />

							<img
								src="/pfp.png"
								alt={`Portrait of ${profile.name || "Advaita Chandra"}`}
								width={1200}
								height={1500}
								fetchPriority="high"
								className="relative block aspect-[3/4] w-full object-cover grayscale contrast-[1.08] brightness-[1.02] transition-all duration-700 group-hover:contrast-[1.12]"
							/>

							{/* In-Negative Exposure Notation Overlay */}
							<div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-center font-mono text-[10px] text-text/80 bg-canvas/85 backdrop-blur-sm px-3 py-1.5 border border-line">
								<span className="tracking-widest">ISO 400 &middot; f/1.8 &middot; 50mm</span>
								<span className="text-copper font-medium uppercase text-[9px] tracking-wider">PORTRAIT</span>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	)
}

function SelectedProjects({ home, featuredProjects }) {
	return (
		<section className="shell pt-16 md:pt-24 border-t border-line" id="projects">
			<div className="flex flex-wrap items-end justify-between gap-6">
				<SectionIntro eyebrow="Selected projects" title={home.featuredHeading || "What I'm building"} />
				<Reveal>
					<Link
						to="/projects"
						className="link-sweep text-meta text-copper"
					>
						All projects
					</Link>
				</Reveal>
			</div>

			<div className="mt-10 grid gap-4 sm:grid-cols-2">
				{featuredProjects.map((project, index) => (
					<Reveal key={project.id} delay={index * 0.05}>
						<ProjectCard project={project} />
					</Reveal>
				))}
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
			id: "01",
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
			id: "02",
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
			id: "03",
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
			id: "04",
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
			id: "05",
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
		<section className="shell pt-20 md:pt-32" id="inquiries">
			{/* Editorial Section Header */}
			<div className="border-b border-line pb-8 mb-12">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div>
						<div className="flex items-center gap-2 font-mono text-xs text-copper uppercase tracking-wider mb-3">
							<span className="w-1.5 h-1.5 bg-copper" />
							<span>Research &amp; Notes</span>
						</div>
						<h2 className="font-display text-h1 text-text leading-[1.05] tracking-tight">
							Current Projects &amp; <br />
							<span className="italic font-normal text-copper">Open Questions</span>
						</h2>
					</div>
					<div className="max-w-xs md:text-right">
						<p className="text-sm text-text-2 leading-relaxed font-light">
							Notes, studies, and questions I am exploring in philosophy, history, governance, and computer systems.
						</p>
					</div>
				</div>
			</div>

			{/* Asymmetrical Editorial Catalog Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-12 items-start">
				{/* Left Sidebar: Premise & Thinkers (Col 1-4) */}
				<div className="lg:col-span-4 space-y-10 lg:sticky lg:top-28 border-b lg:border-b-0 lg:border-r border-line pb-10 lg:pb-0 lg:pr-8">
					<div>
						<span className="font-mono text-xs tracking-wider text-copper uppercase block mb-2 font-medium">
							How I Work
						</span>
						<p className="text-text-2 text-sm leading-relaxed font-light">
							I study topics through primary sources and datasets. These notes track questions that come up across books, official records, and data projects.
						</p>
					</div>

					{/* Theoretical Counterparts */}
					<div className="pt-6 border-t border-line">
						<div className="flex items-center justify-between mb-4">
							<span className="font-mono text-xs tracking-wider text-copper uppercase block font-medium">
								Readings &amp; Thinkers
							</span>
							<Link
								to="/philosophy"
								className="text-xs font-mono text-text-3 hover:text-copper transition-colors"
							>
								Reading log &rarr;
							</Link>
						</div>
						<ul className="space-y-3 font-mono text-xs">
							{thinkers.map((thinker, i) => (
								<li
									key={thinker.id || thinker.name}
									className="flex justify-between items-center text-text-2 hover:text-text transition-colors py-0.5"
								>
									<span>0{i + 1}. {thinker.name}</span>
									<span className="text-text-3 text-[11px]">
										{thinker.description ? thinker.description.split(".")[0].slice(0, 24) : thinker.role || "Inquiry"}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Desk Manifesto Box */}
					<div className="p-5 border border-line bg-surface">
						<div className="flex items-center gap-2 text-copper mb-2">
							<span className="font-mono text-xs tracking-wider uppercase font-medium">
								Guiding Rule
							</span>
						</div>
						<p className="text-xs leading-relaxed text-text-2 font-light">
							&ldquo;On this site I try to separate four things: facts from sources, my inferences, my opinions, and things I do not know.&rdquo;
						</p>
					</div>
				</div>

				{/* Right Index Ledger: Detailed Inquiries (Col 5-12) */}
				<div className="lg:col-span-8 divide-y divide-line">
					{inquiries.map((item) => (
						<article
							key={item.id}
							className="group py-8 first:pt-0 last:pb-0 transition-all duration-300 hover:pl-2"
						>
							<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
								<div className="flex items-baseline gap-3">
									<span className="font-mono text-xs text-copper font-semibold">
										[{item.id}]
									</span>
									<span className="font-mono text-[11px] tracking-wider text-text-3 uppercase">
										{item.category}
									</span>
								</div>
								<span className="font-mono text-[10px] tracking-wider text-text-3 group-hover:text-copper transition-colors">
									{item.status}
								</span>
							</div>

							<h3 className="font-display text-xl sm:text-2xl text-text font-normal mb-3 group-hover:text-copper transition-colors">
								{item.title}
							</h3>

							<p className="text-text-2 text-sm leading-relaxed mb-4 max-w-2xl">
								{item.summary}
							</p>

							<div className="flex flex-wrap items-center gap-y-2 gap-x-5 font-mono text-xs text-text-3">
								<span>
									<strong className="text-text-2 font-medium">Field:</strong> {item.locus}
								</span>
								<span>
									<strong className="text-text-2 font-medium">Context:</strong> {item.text}
								</span>
								<Link
									to={item.link}
									className="inline-flex items-center text-copper hover:underline ml-auto font-mono text-xs tracking-wider"
								>
									{item.linkText} <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
								</Link>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

function Correspondence({ publicSocialLinks }) {
	const links = (publicSocialLinks || []).filter((l) => l.url && l.kind !== "email")

	const [form, setForm] = useState({
		name: "",
		email: "",
		topic: "General Inquiry",
		message: "",
		readingRef: "",
	})
	const [status, setStatus] = useState("idle")
	const [feedback, setFeedback] = useState("")

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!form.message.trim()) {
			setFeedback("Please enter a note or message.")
			return
		}
		setStatus("submitting")
		setFeedback("")
		try {
			const finalMessage = form.readingRef.trim()
				? `${form.message}\n\n[Reference/Link]: ${form.readingRef.trim()}`
				: form.message

			await submitContactForm({
				name: form.name.trim() || "Anonymous Reader",
				email: form.email.trim() || "reader@local",
				topic: form.topic,
				message: finalMessage,
			})
			setStatus("success")
			setFeedback("Message sent. Thank you for taking the time to write.")
			setForm({
				name: "",
				email: "",
				topic: "General Inquiry",
				message: "",
				readingRef: "",
			})
		} catch (err) {
			console.error(err)
			setStatus("error")
			setFeedback("Notice: Message could not be sent right now. You can also reach me directly via the contact page.")
		}
	}

	return (
		<section className="shell pt-20 md:pt-32 pb-24 md:pb-36" id="correspondence">
			{/* Divider */}
			<div className="w-full border-t border-line mb-16" />

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-16 items-start">
				{/* Left Editorial Column (Col 1-6) */}
				<div className="lg:col-span-6 space-y-8">
					<div>
						<div className="flex items-center gap-2 font-mono text-xs text-copper uppercase tracking-wider mb-3">
							<span className="w-1.5 h-1.5 bg-copper" />
							<span>Get in Touch</span>
						</div>
						<h2 className="font-display text-h1 text-text leading-[1.05] tracking-tight">
							Questions, corrections, or book recommendations.
						</h2>
					</div>

					<p className="text-lead text-text-2 leading-relaxed max-w-xl font-light">
						I appreciate constructive feedback and book recommendations. If you spot an error in my data, a missing citation, or want to discuss any of the topics here, please write directly.
					</p>

					{/* Note on availability & India location */}
					<div className="p-6 border border-line bg-surface space-y-3.5 max-w-xl">
						<div className="flex items-center justify-between border-b border-line pb-2.5">
							<span className="font-mono text-[11px] text-text-3 uppercase">
								Location
							</span>
							<span className="font-mono text-xs text-text">
								India
							</span>
						</div>
						<div className="flex items-center justify-between border-b border-line pb-2.5">
							<span className="font-mono text-[11px] text-text-3 uppercase">
								Response Time
							</span>
							<span className="font-mono text-xs text-text">
								Within ~24–48 hours
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="font-mono text-[11px] text-text-3 uppercase">
								Notes
							</span>
							<span className="font-mono text-xs text-copper">
								Corrections are welcomed &amp; updated
							</span>
						</div>
					</div>

					{/* Direct Channels */}
					<div className="pt-4 border-t border-line max-w-xl">
						<span className="font-mono text-[11px] text-text-3 uppercase block mb-3">
							Direct Channels
						</span>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
							{links.map((link, idx) => (
								<a
									key={link.id}
									href={link.url}
									target="_blank"
									rel="me noopener noreferrer"
									className="text-text-2 hover:text-copper transition-colors flex items-center gap-1.5"
								>
									<span className="text-text-3">0{idx + 1}.</span>
									<span>{link.label}</span>
									<ArrowUpRight className="h-3 w-3 text-text-3" />
								</a>
							))}
							<Link
								to="/contact"
								className="text-text-2 hover:text-copper transition-colors flex items-center gap-1.5"
							>
								<span className="text-text-3">0{links.length + 1}.</span>
								<span>Full Form</span>
								<ArrowRight className="h-3 w-3 text-text-3" />
							</Link>
						</div>
					</div>
				</div>

				{/* Right Contact Form (Col 7-12) */}
				<div className="lg:col-span-6 border border-line bg-surface p-5 sm:p-10 relative">
					<div className="flex items-center justify-between border-b border-line pb-4 mb-6">
						<div className="flex items-center gap-2">
							<span className="h-2 w-2 rounded-full bg-copper" />
							<span className="font-mono text-xs text-text uppercase tracking-wider font-medium">
								Send a Message
							</span>
						</div>
						<span className="font-mono text-[11px] text-text-3">
							India [UTC +05:30]
						</span>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Topic Selection */}
						<div>
							<label className="font-mono text-[11px] text-text-3 uppercase block mb-2.5">
								Topic of Inquiry
							</label>
							<div className="grid grid-cols-2 gap-2">
								{[
									"General Inquiry",
									"Correction / Citation",
									"Book Recommendation",
									"Project Discussion",
								].map((t) => (
									<button
										key={t}
										type="button"
										onClick={() => setForm({ ...form, topic: t })}
										className={`p-2.5 border text-left font-mono text-xs transition-all duration-200 cursor-pointer ${
											form.topic === t
												? "border-copper bg-copper/10 text-text font-medium"
												: "border-line bg-surface-2 text-text-2 hover:border-line-strong hover:text-text"
										}`}
									>
										{t}
									</button>
								))}
							</div>
						</div>

						{/* Name & Email */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label
									htmlFor="contact-sender-name"
									className="font-mono text-[11px] text-text-3 uppercase block mb-1.5"
								>
									Your Name
								</label>
								<input
									id="contact-sender-name"
									type="text"
									placeholder="e.g. Reader, Colleague, or Anonymous"
									value={form.name}
									onChange={(e) => setForm({ ...form, name: e.target.value })}
									className="w-full bg-surface-2 border border-line px-3.5 py-2.5 text-base sm:text-sm text-text placeholder:text-text-3/60 focus:border-copper focus:outline-none transition-colors"
								/>
							</div>
							<div>
								<label
									htmlFor="contact-sender-email"
									className="font-mono text-[11px] text-text-3 uppercase block mb-1.5"
								>
									Email Address
								</label>
								<input
									id="contact-sender-email"
									type="email"
									placeholder="you@domain.org"
									value={form.email}
									onChange={(e) => setForm({ ...form, email: e.target.value })}
									className="w-full bg-surface-2 border border-line px-3.5 py-2.5 text-base sm:text-sm text-text placeholder:text-text-3/60 focus:border-copper focus:outline-none transition-colors"
								/>
							</div>
						</div>

						{/* Message */}
						<div>
							<label
								htmlFor="contact-message"
								className="font-mono text-[11px] text-text-3 uppercase block mb-1.5"
							>
								Message *
							</label>
							<textarea
								id="contact-message"
								rows={4}
								placeholder="Specify premise, data question, or note under discussion..."
								value={form.message}
								onChange={(e) => setForm({ ...form, message: e.target.value })}
								className="w-full bg-surface-2 border border-line p-3 text-base sm:text-sm text-text placeholder:text-text-3/60 focus:border-copper focus:outline-none transition-colors leading-relaxed"
							/>
						</div>

						{/* Optional Reading Ref */}
						<div>
							<label
								htmlFor="contact-reading-ref"
								className="font-mono text-[11px] text-text-3 uppercase block mb-1.5"
							>
								Recommended Reading or Link (Optional)
							</label>
							<input
								id="contact-reading-ref"
								type="text"
								placeholder="Title, author, or link..."
								value={form.readingRef}
								onChange={(e) => setForm({ ...form, readingRef: e.target.value })}
								className="w-full bg-surface-2 border border-line px-3 py-2 text-sm text-text placeholder:text-text-3/60 focus:border-copper focus:outline-none transition-colors"
							/>
						</div>

						{feedback && (
							<p
								className={`text-xs font-mono ${
									status === "success" ? "text-copper" : "text-limitation"
								}`}
							>
								{feedback}
							</p>
						)}

						<div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
							<button
								type="submit"
								disabled={status === "submitting"}
								className="group inline-flex items-center gap-3 border border-copper bg-copper px-6 py-3 text-xs font-mono uppercase tracking-widest text-canvas font-semibold transition-all duration-300 hover:bg-copper-strong disabled:opacity-50 cursor-pointer"
							>
								{status === "submitting" ? (
									<>
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
										<span>Sending...</span>
									</>
								) : status === "success" ? (
									<>
										<Check className="h-3.5 w-3.5" />
										<span>Message Sent</span>
									</>
								) : (
									<>
										<span>Send Message</span>
										<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
									</>
								)}
							</button>

							<Link
								to="/contact"
								className="text-xs font-mono text-text-3 hover:text-copper transition-colors"
							>
								Full contact page &rarr;
							</Link>
						</div>
					</form>
				</div>
			</div>
		</section>
	)
}

export default function Home() {
	const {
		profile,
		home,
		featuredProjects,
		philosophy,
		publicSocialLinks,
	} = useContent()

	return (
		<>
			<Seo title={ROUTE.title} description={ROUTE.description} path="/" />
			<Hero profile={profile} home={home} />
			<SelectedProjects home={home} featuredProjects={featuredProjects} />
			<ActiveInquiries philosophy={philosophy} />
			<Correspondence publicSocialLinks={publicSocialLinks} />
		</>
	)
}
