import { Copy, Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ReorderList from '../../components/admin/ReorderList.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import StatusBadge, { VisibilityBadge } from '../../components/StatusBadge.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { useContent } from '../../lib/content.jsx'
import { useToast } from '../../lib/toast.jsx'
import { createProject } from '../../lib/schema.js'

/**
 * Project list.
 *
 * A reorderable list rather than a table, because the order here is the order the projects
 * appear in on the public portfolio page — so dragging the order around is the primary
 * action, not a secondary one.
 */
export default function ProjectsList() {
  const { projects, patchItem, removeItem, moveItem, upsertItem, projectCategories } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const categoryName = (slug) =>
    projectCategories.find((category) => category.slug === slug)?.name ?? slug

  const visibleProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesQuery = !normalized || [project.title, project.slug, project.summary, ...(project.tools || [])]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
      const matchesStatus = status === 'all' || (status === 'published' ? project.published !== false : project.published === false)
      return matchesQuery && matchesStatus
    })
  }, [projects, query, status])

  const duplicate = (project) => {
    const { id: _sourceId, ...projectFields } = project
    const baseSlug = `${project.slug}-copy`
    let copySlug = baseSlug
    let suffix = 2
    while (projects.some((item) => item.slug === copySlug)) {
      copySlug = `${baseSlug}-${suffix}`
      suffix += 1
    }
    const copy = createProject({
      ...projectFields,
      title: `${project.title} (copy)`,
      slug: copySlug,
      published: false,
      featured: false,
    })
    upsertItem('projects', copy)
    toast.success('Draft copy created.')
  }

  const moveFiltered = (id, delta) => {
    const currentIndex = visibleProjects.findIndex((project) => project.id === id)
    const targetIndex = currentIndex + delta
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= visibleProjects.length) return

    const fullCurrentIndex = projects.findIndex((project) => project.id === id)
    const fullTargetIndex = projects.findIndex((project) => project.id === visibleProjects[targetIndex].id)
    const steps = fullTargetIndex - fullCurrentIndex
    const direction = steps < 0 ? -1 : 1
    for (let step = 0; step < Math.abs(steps); step += 1) moveItem('projects', id, direction)
  }

  const togglePublished = (project) => {
    const next = project.published === false
    patchItem('projects', project.id, { published: next })
    toast.success(
      next
        ? `“${project.title}” will show on the public portfolio.`
        : `“${project.title}” is now hidden from the public portfolio.`,
    )
  }

  const toggleFeatured = (project) => {
    const next = !project.featured
    patchItem('projects', project.id, { featured: next })
    toast.success(next ? 'Added to the home page selection.' : 'Removed from the home page selection.')
  }

  const requestDelete = async (project) => {
    const confirmed = await confirm({
      title: `Delete “${project.title}”?`,
      message:
        'This removes the project from your local copy of the content, including its methodology and limitations. It cannot be undone from here.',
      confirmLabel: 'Delete project',
    })
    if (!confirmed) return

    removeItem('projects', project.id)
    toast.success('Project deleted.')
  }

  return (
    <AdminPage
      title="Projects"
      description="The work shown on the portfolio page. Order here is the order there."
      actions={
        <Button to="/admin/projects/new" size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New project
        </Button>
      }
    >
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, slug, summary or tools" className="w-full rounded-lg border border-border bg-surface py-2.5 pr-3 pl-9 text-sm focus:border-accent focus:outline-none" />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter project status" className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm">
          <option value="all">All visibility</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <p className="mb-4 text-sm text-foreground-muted" role="status">Showing {visibleProjects.length} of {projects.length} projects</p>
      <ReorderList
        items={visibleProjects}
        labelFor={(project) => project.title || 'Untitled project'}
        onMove={moveFiltered}
        emptyMessage="No projects yet. The portfolio page will show its empty state until one is added."
        renderItem={(project) => (
          <div className="min-w-0">
            <p className="font-medium">{project.title || 'Untitled project'}</p>
            <p className="mt-0.5 truncate font-mono text-xs text-foreground-muted">/{project.slug}</p>

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <StatusBadge kind="project" value={project.status} />
              <VisibilityBadge published={project.published !== false} />
              {project.featured && (
                <Badge tone="accent">
                  <Star className="h-3 w-3 shrink-0" aria-hidden="true" />
                  On home page
                </Badge>
              )}
              {(project.categories ?? []).map((slug) => (
                <Badge key={slug}>{categoryName(slug)}</Badge>
              ))}
            </div>

            {project.summary && (
              <p className="mt-2 text-sm text-foreground-muted">{project.summary}</p>
            )}
          </div>
        )}
        renderActions={(project) => (
          <>
            <Button variant="secondary" size="sm" to={`/admin/projects/${project.id}`}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Edit</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={() => duplicate(project)} title="Duplicate as draft">
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Duplicate {project.title}</span>
            </Button>

            <Button variant="ghost" size="sm" to={`/portfolio#project-${project.slug}`} title="Preview on public site">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Preview {project.title}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePublished(project)}
              aria-pressed={project.published !== false}
            >
              {project.published === false ? (
                <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="sr-only">
                {project.published === false
                  ? `Publish ${project.title}`
                  : `Hide ${project.title}`}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFeatured(project)}
              aria-pressed={Boolean(project.featured)}
            >
              <Star
                className={`h-3.5 w-3.5 ${project.featured ? 'text-accent' : ''}`}
                aria-hidden="true"
              />
              <span className="sr-only">
                {project.featured
                  ? `Remove ${project.title} from the home page`
                  : `Feature ${project.title} on the home page`}
              </span>
            </Button>

            <Button variant="danger" size="sm" onClick={() => requestDelete(project)}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Delete {project.title}</span>
            </Button>
          </>
        )}
      />

      <ConfirmDialog {...dialogProps} />
    </AdminPage>
  )
}
