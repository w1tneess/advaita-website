import { useState, useMemo } from "react"
import PageHeader from "@/components/ui/PageHeader.jsx"
import ProjectCard from "@/components/features/ProjectCard.jsx"
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
				title="Projects &amp; Studies"
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
								className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs transition-all duration-200 cursor-pointer rounded-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
									activeCategory === cat
										? "bg-ink text-canvas font-medium shadow-subtle"
										: "bg-surface border border-line text-muted hover:text-ink hover:border-line-strong"
								}`}
							>
								{cat}
							</button>
						))}
					</div>
				)}
			</PageHeader>

			<section className="shell py-[clamp(1.75rem,4vw,3.25rem)]">
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
