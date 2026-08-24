import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from 'lucide-react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import ReorderList from '../../components/admin/ReorderList.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import StatusBadge, { VisibilityBadge } from '../../components/StatusBadge.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { useContent } from '../../lib/content.jsx'
import { useToast } from '../../lib/toast.jsx'

/**
 * Project list.
 *
 * A reorderable list rather than a table, because the order here is the order the projects
 * appear in on the public portfolio page — so dragging the order around is the primary
 * action, not a secondary one.
 */
export default function ProjectsList() {
  const { projects, patchItem, removeItem, moveItem, projectCategories } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()

  const categoryName = (slug) =>
    projectCategories.find((category) => category.slug === slug)?.name ?? slug

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
      <ReorderList
        items={projects}
        labelFor={(project) => project.title || 'Untitled project'}
        onMove={(id, delta) => moveItem('projects', id, delta)}
        emptyMessage="No projects yet. The portfolio page will show its empty state until one is added."
        renderItem={(project) => (
          <div className="min-w-0">
            <p className="font-medium">{project.title || 'Untitled project'}</p>
            <p className="mt-0.5 truncate font-mono text-xs text-muted">/{project.slug}</p>

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
              <p className="mt-2 text-sm text-muted">{project.summary}</p>
            )}
          </div>
        )}
        renderActions={(project) => (
          <>
            <Button variant="secondary" size="sm" to={`/admin/projects/${project.id}`}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Edit</span>
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
