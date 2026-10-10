import { useState, useMemo } from "react"
import { Link } from "react-router"
import PageHeader from "@/components/ui/PageHeader.jsx"
import ProjectCard from "@/components/features/ProjectCard"
import { useContent } from "@/lib/content.jsx"
import Seo from "@/components/meta/Seo.jsx"
import { PUBLIC_ROUTES } from "@/config/nav.js"

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'projects')

export default function Projects() {
	const { publicProjects } = useContent()
	const [activeCategory, setActiveCategory] = useState("All")

	const categories = useMemo(() => {
		const cats = new Set()
		publicProjects?.forEach((p) => {
			if (p.categories) {
				p.categories.forEach((c) => cats.add(c))
			} else if (p.status) {
				cats.add(p.status)
			}
		})
		return ["All", ...Array.from(cats)]
	}, [publicProjects])

	const filteredProjects = useMemo(() => {
		if (activeCategory === "All") return publicProjects || []
		return (publicProjects || []).filter((p) =>
			p.categories?.includes(activeCategory) || p.status === activeCategory
		)
	}, [publicProjects, activeCategory])

	return (
		<>
			<Seo title={ROUTE.title} description={ROUTE.description} path="/projects" />

			<PageHeader
				eyebrow="Projects"
				title="Projects & Studies"
				lead="Data projects, tools, and research notes. Each project explains the question behind it, the sources used, and what I learned."
			>
				{categories.length > 2 && (
					<div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 sm:mt-6 font-utility">
						<span className="text-muted mr-1 sm:mr-2 text-xs">
							Filter:
						</span>
						{categories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveCategory(cat)}
								className={`px-4 py-2 min-h-[36px] text-xs transition-all duration-150 ease-[var(--ease-out-quart)] cursor-pointer rounded-full active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas ${
									activeCategory === cat
										? "bg-ink text-canvas font-medium shadow-subtle"
										: "bg-surface border border-line/60 text-muted hover:text-ink hover:border-line-strong hover:bg-surface/80"
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				)}
			</PageHeader>

			<section className="shell py-[var(--spacing-fluid-section)] pb-24">
				{/* Interactive Algorithmic Computing Showcase Banner */}
				<div className="mb-12 p-6 sm:p-8 rounded-2xl border border-line/60 bg-surface/30 hover:bg-surface/60 hover:-translate-y-1 hover:border-line-strong hover:shadow-subtle active:scale-[0.98] transition-all duration-250 ease-[var(--ease-out-quart)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 backdrop-blur-md group">
					<div>
						<div className="flex items-center gap-2 font-mono text-[11px] text-muted uppercase tracking-wider mb-2">
							<span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse" />
							<span>Creative Computing // Procedural Sandbox</span>
						</div>
						<h3 className="font-sans text-base sm:text-lg font-medium text-ink group-hover:text-muted transition-colors duration-150 ease-[var(--ease-out-quart)]">
							Algorithmic Art &amp; Vector Flow Fields
						</h3>
						<p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed max-w-xl">
							Interactive GPU-accelerated mathematical vector simulations, chaotic orbital attractors, and seeded generative geometry.
						</p>
					</div>
					<Link
						to="/art"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-accent text-canvas font-mono text-xs uppercase tracking-wider font-semibold hover:bg-white/20 hover:text-ink active:scale-[0.97] active:opacity-80 transition-all duration-250 ease-[var(--ease-out-quart)] shadow-subtle shrink-0"
					>
						<span>Launch Canvas &rarr;</span>
					</Link>
				</div>

				{filteredProjects.length === 0 ? (
					<div className="bg-surface p-[clamp(1.5rem,3vw,2.5rem)] text-center text-sm font-utility text-muted border border-line">
						No projects found in this category.
					</div>
				) : (
					<div className="grid gap-[clamp(1rem,2.5vw,2rem)] sm:grid-cols-2">
						{filteredProjects.map((project, idx) => (
							<ProjectCard key={project.id} project={project} index={idx} />
						))}
					</div>
				)}
			</section>
		</>
	)
}
