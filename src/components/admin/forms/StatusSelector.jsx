import { Eye, EyeOff } from 'lucide-react'
import Field from '@/components/admin/Field.jsx'

/**
 * Status and visibility selector for content.
 *
 * Consolidates publish/draft/visibility logic from ProjectEditor and PostEditor.
 * Provides consistent status management across content types.
 */

export default function StatusSelector({
  type = 'project', // 'project' | 'post'
  status,
  setStatus,
  published,
  setPublished,
  featured,
  setFeatured,
}) {
  const isProject = type === 'project'

  return (
    <div className="space-y-4">
      <Field
        id="status"
        label={isProject ? 'Project Status' : 'Post Status'}
        hint={isProject ? 'Visible to public or draft' : 'Published or draft'}
      >
        <select
          id="status"
          value={status || 'draft'}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="draft">Draft</option>
          {isProject && <option value="in-progress">In progress</option>}
          <option value="published">Published</option>
        </select>
      </Field>

      {isProject && (
        <>
          <div className="rounded-lg border border-line bg-raised p-3">
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className="flex w-full items-center justify-between text-sm"
            >
              <span className="font-medium text-ink">
                {published !== false ? 'Published' : 'Hidden'}
              </span>
              {published !== false ? (
                <Eye className="h-4 w-4 text-accent" aria-hidden="true" />
              ) : (
                <EyeOff className="h-4 w-4 text-muted" aria-hidden="true" />
              )}
            </button>
            <p className="mt-1 text-xs text-muted">
              {published !== false ? 'Visible on portfolio page' : 'Hidden from public site'}
            </p>
          </div>

          <div className="rounded-lg border border-line bg-raised p-3">
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className="flex w-full items-center justify-between text-sm"
            >
              <span className="font-medium text-ink">{featured ? 'Featured' : 'Not featured'}</span>
              <span className={featured ? 'text-accent' : 'text-muted'}>★</span>
            </button>
            <p className="mt-1 text-xs text-muted">
              {featured ? 'Shown on homepage' : 'Not shown on homepage'}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
