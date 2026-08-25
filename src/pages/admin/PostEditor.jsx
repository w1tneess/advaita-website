import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AdminPage from '../../components/admin/AdminPage.jsx'
import BlockEditor from '../../components/admin/BlockEditor.jsx'
import Field, { CheckboxGroup } from '../../components/admin/Field.jsx'
import Button from '../../components/Button.jsx'
import Callout from '../../components/Callout.jsx'
import Card from '../../components/Card.jsx'
import { useContent } from '../../lib/content.jsx'
import { readingMinutes } from '../../lib/format.js'
import {
  POST_STATUSES,
  createPost,
  createSource,
  hasErrors,
  slugify,
  todayIso,
  validatePost,
} from '../../lib/schema.js'
import { useToast } from '../../lib/toast.jsx'

/**
 * Create or edit one article.
 *
 * Publishing is gated by validatePost: an article marked published must have at least one
 * block with content, and any image in it must have alt text. That is enforced here rather
 * than trusted to the author, because a blank published article and an undescribed image
 * are both failures a reader experiences and the author never sees.
 */
export default function PostEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { posts, blogCategories, tags, upsertItem } = useContent()

  const isNew = id === 'new'
  const existing = posts.find((post) => post.id === id) ?? null

  const [draft, setDraft] = useState(() => (isNew ? createPost() : existing ? { ...existing } : null))
  const [errors, setErrors] = useState({})
  const [slugLocked, setSlugLocked] = useState(!isNew)

  if (draft === null) {
    return (
      <AdminPage
        title="Article not found"
        description="There is no article with that id in the current content document. It may have been deleted, or the demo data may have been reset."
      >
        <Button to="/admin/posts" variant="secondary">
          Back to writing
        </Button>
      </AdminPage>
    )
  }

  const set = (key, value) => setDraft((current) => ({ ...current, [key]: value }))

  const onTitleChange = (value) => {
    setDraft((current) => ({
      ...current,
      title: value,
      slug: slugLocked ? current.slug : slugify(value),
    }))
  }

  const setSource = (index, key, value) =>
    setDraft((current) => ({
      ...current,
      sources: current.sources.map((source, i) =>
        i === index ? { ...source, [key]: value } : source,
      ),
    }))

  const submit = (event) => {
    event.preventDefault()
    const found = validatePost(draft, posts)
    setErrors(found)

    if (hasErrors(found)) {
      toast.error('Nothing was saved — check the highlighted fields.')
      return
    }

    upsertItem('posts', draft)
    toast.success(`“${draft.title}” ${isNew ? 'created' : 'saved'} in this browser.`)
    navigate('/admin/posts')
  }

  const tagOptions = tags.map((tag) => ({ value: tag.slug, label: tag.name }))

  return (
    <AdminPage
      title={isNew ? 'New article' : 'Edit article'}
      description={
        isNew
          ? 'Write an article for the blog. It stays a draft until you set its status to published.'
          : 'Changes take effect on the public pages in this browser as soon as they are saved.'
      }
      actions={
        <Button to="/admin/posts" variant="secondary" size="sm">
          Back to writing
        </Button>
      }
    >
      <form onSubmit={submit} noValidate>
        <Card className="p-6">
          <h2 className="text-base font-semibold">Article details</h2>

          <Field
            className="mt-5"
            id="post-title"
            label="Title"
            value={draft.title}
            onChange={onTitleChange}
            error={errors.title}
            required
            limit={140}
          />

          <Field
            className="mt-5"
            id="post-slug"
            label="Slug"
            value={draft.slug}
            onChange={(value) => {
              setSlugLocked(true)
              set('slug', slugify(value))
            }}
            error={errors.slug}
            required
            hint={`The article's URL will be /blog/${draft.slug || 'your-slug'}. Changing it after publication breaks any existing link.`}
          />

          <Field
            className="mt-5"
            id="post-category"
            label="Category"
            type="select"
            value={draft.category}
            onChange={(value) => set('category', value)}
            options={[
              { value: '', label: 'Choose a category…' },
              ...blogCategories.map((category) => ({
                value: category.slug,
                label: category.name,
              })),
            ]}
            error={errors.category}
            required
          />

          {tagOptions.length > 0 ? (
            <CheckboxGroup
              className="mt-6"
              id="post-tags"
              label="Tags"
              options={tagOptions}
              values={draft.tags ?? []}
              onChange={(value) => set('tags', value)}
              hint="Tags only appear as filters on the blog page once at least one published article uses them."
            />
          ) : (
            <p className="mt-6 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-foreground-muted">
              No tags exist yet. Add some under Categories &amp; tags, then come back to apply them.
            </p>
          )}

          <Field
            className="mt-6"
            id="post-excerpt"
            label="Excerpt"
            type="textarea"
            rows={3}
            value={draft.excerpt}
            onChange={(value) => set('excerpt', value)}
            error={errors.excerpt}
            required
            limit={300}
            hint="Shown on the article card and used as the page's meta description."
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="post-published-at"
              label="Publication date"
              type="date"
              value={draft.publishedAt}
              onChange={(value) => set('publishedAt', value)}
              error={errors.publishedAt}
              required
            />
            <Field
              id="post-updated-at"
              label="Last updated"
              type="date"
              value={draft.updatedAt ?? ''}
              onChange={(value) => set('updatedAt', value)}
              error={errors.updatedAt}
              hint="Fill this in when you revise a published article. Leave blank otherwise."
            />
          </div>

          <Field
            className="mt-5"
            id="post-status"
            label="Status"
            type="select"
            value={draft.status}
            onChange={(value) =>
              setDraft((current) => ({
                ...current,
                status: value,
                publishedAt:
                  value === 'published' && !current.publishedAt ? todayIso() : current.publishedAt,
              }))
            }
            options={POST_STATUSES.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            error={errors.status}
            hint={POST_STATUSES.find((status) => status.value === draft.status)?.description}
          />
        </Card>

        <Card className="mt-6 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-base font-semibold">Body</h2>
            <p className="text-xs text-foreground-muted">
              Estimated reading time: ~{readingMinutes(draft)} min
            </p>
          </div>

          <Callout variant="analysis" title="Label the kind of claim you are making" className="mt-4">
            Use a labelled callout block whenever a passage stops being a report of a source
            and becomes your own inference, your own opinion, or an admission that something is
            unknown. The four labels are what let a reader tell those apart.
          </Callout>

          <div className="mt-6">
            <BlockEditor
              blocks={draft.body ?? []}
              onChange={(value) => set('body', value)}
              error={errors.body}
            />
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Sources</h2>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Listed as references at the end of the article. A sourced-fact callout without a
            matching entry here is not actually sourced.
          </p>

          {(draft.sources ?? []).length === 0 ? (
            <p className="mt-5 rounded-lg border border-dashed border-border px-4 py-3 text-sm text-foreground-muted">
              No sources yet.
            </p>
          ) : (
            <ol className="mt-5 space-y-4">
              {draft.sources.map((source, index) => (
                <li key={source.id} className="rounded-lg border border-border bg-surface-elevated/40 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold tracking-wide text-foreground-muted uppercase">
                      Source {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          'sources',
                          draft.sources.filter((_, i) => i !== index),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground-muted transition-colors hover:text-danger"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Field
                      id={`source-${source.id}-title`}
                      label="Title"
                      value={source.title}
                      onChange={(value) => setSource(index, 'title', value)}
                      error={errors[`sources.${index}.title`]}
                      required
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        id={`source-${source.id}-publisher`}
                        label="Publisher"
                        value={source.publisher ?? ''}
                        onChange={(value) => setSource(index, 'publisher', value)}
                      />
                      <Field
                        id={`source-${source.id}-accessed`}
                        label="Accessed on"
                        type="date"
                        value={source.accessedAt ?? ''}
                        onChange={(value) => setSource(index, 'accessedAt', value)}
                      />
                    </div>
                    <Field
                      id={`source-${source.id}-url`}
                      label="URL"
                      type="url"
                      value={source.url ?? ''}
                      onChange={(value) => setSource(index, 'url', value)}
                      error={errors[`sources.${index}.url`]}
                      hint="Leave blank for an offline source such as a printed book."
                    />
                    <Field
                      id={`source-${source.id}-note`}
                      label="Note"
                      value={source.note ?? ''}
                      onChange={(value) => setSource(index, 'note', value)}
                      hint="Optional — what this source was used for, or how reliable you judge it to be."
                    />
                  </div>
                </li>
              ))}
            </ol>
          )}

          <button
            type="button"
            onClick={() => set('sources', [...(draft.sources ?? []), createSource()])}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-foreground-muted transition-colors hover:border-accent hover:text-accent"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add source
          </button>
        </Card>

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-border bg-canvas/90 py-4 backdrop-blur-sm">
          <Button type="submit">{isNew ? 'Create article' : 'Save article'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/posts')}>
            Cancel
          </Button>
        </div>
      </form>
    </AdminPage>
  )
}
