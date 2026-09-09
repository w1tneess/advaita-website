import { useState, useMemo } from "react"
import PageHeader from "@/components/ui/PageHeader.jsx"
import ProjectCard from "@/components/features/ProjectCard.jsx"
import Reveal from "@/components/ui/Reveal.jsx"
import { useContent } from "@/lib/content.jsx"
import Seo from "@/components/meta/Seo.jsx"
import { PUBLIC_ROUTES } from "@/config/nav.js"

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'projects')

export default function Projects() {
	const { publicProjects } = useContent()
	const [activeCategory, setActiveCategory] = useState("All")

	// Extract unique categories
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
				title="Projects &amp; Studies"
				lead="Data projects, tools, and research notes. Each project explains the question behind it, the sources used, and what I learned."
			>
				{/* Filter Tabs */}
				{categories.length > 2 && (
					<div className="flex flex-wrap items-center gap-2 font-mono text-xs">
						<span className="text-text-3 uppercase text-[10px] tracking-widest mr-2">
							Filter by category:
						</span>
						{categories.map((cat) => (
							<button
								key={cat}
								type="button"
								onClick={() => setActiveCategory(cat)}
								className={`px-3 py-1.5 border transition-all duration-200 cursor-pointer ${
									activeCategory === cat
										? "border-copper bg-copper text-canvas font-medium"
										: "border-line bg-surface/60 text-text-3 hover:border-line-strong hover:text-text"
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				)}
			</PageHeader>

			<section className="shell pb-24 md:pb-32">
				{filteredProjects.length === 0 ? (
					<div className="border border-line bg-surface/40 p-12 text-center font-mono text-sm text-text-3">
						No projects found in this category.
					</div>
				) : (
					<div className="grid gap-6 sm:grid-cols-2">
						{filteredProjects.map((project, index) => (
							<Reveal key={project.id} delay={index * 0.04}>
								<ProjectCard project={project} index={index} />
							</Reveal>
						))}
					</div>
				)}

				{/* Colophon Note */}
				<div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-text-3">
					<span>Open code &amp; data sources</span>
					<span className="text-copper">Location: India</span>
				</div>
			</section>
		</>
	)
}
