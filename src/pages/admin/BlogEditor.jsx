import { useSaveShortcut } from '../../hooks/useSaveShortcut.js'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Field from '../../components/admin/Field.jsx'
import FormSection from '../../components/admin/forms/FormSection.jsx'
import SlugField from '../../components/admin/forms/SlugField.jsx'
import StatusSelector from '../../components/admin/forms/StatusSelector.jsx'
import SaveStatus from '../../components/admin/feedback/SaveStatus.jsx'
import UnsavedChangesDialog from '../../components/admin/feedback/UnsavedChangesDialog.jsx'
import Button from '@/components/ui/Button.jsx'
import { useContent } from '@/lib/content.jsx'
import { createBlogPost, hasErrors, slugify, todayIso, validateBlogPost } from '@/lib/schema.js'
import { useToast } from '@/lib/toast.jsx'

export default function BlogEditor() {
  
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { blog, upsertItem } = useContent()

  const isNew = id === 'new'
  const existing = blog.find((p) => p.id === id) ?? null

  const [draft, setDraft] = useState(() =>
    isNew ? createBlogPost() : existing ? { ...existing } : null,
  )
  const [errors, setErrors] = useState({})
  const [slugLocked, setSlugLocked] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const set = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  const onTitleChange = (value) => {
    setDraft((current) => ({
      ...current,
      title: value,
      slug: slugLocked ? current.slug : slugify(value),
    }))
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  const submit = async (event) => {
    if (event && event.preventDefault) event.preventDefault()
    if (!draft) return
    const found = validateBlogPost(draft, blog)
    setErrors(found)

    if (hasErrors(found)) {
      toast.error('Nothing was saved — check the highlighted fields.')
      setSaveStatus('error')
      return
    }

    setSaveStatus('saving')
    setIsSaving(true)
    try {
      const result = await upsertItem('blog', draft)
      if (result.ok) {
        setSaveStatus('success')
        setHasUnsavedChanges(false)
        toast.success(`“${draft.title}” ${isNew ? 'created' : 'saved'}.`)
        setTimeout(() => navigate('/admin/blog'), 800)
      } else {
        setSaveStatus('error')
        // toast is already handled by commit, but we keep the UI state accurate
      }
    } catch (_e) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  useSaveShortcut(submit)

  if (draft === null) {
    return (
      <AdminPage
        title="Post not found"
        description="There is no post with that id in the database."
      >
        <Button to="/admin/blog" variant="secondary">
          Back to writing
        </Button>
      </AdminPage>
    )
  }



  return (
    <AdminPage
      title={isNew ? 'New blog post' : 'Edit blog post'}
      description={
        isNew
          ? 'Write a post for the blog section. It stays a draft until you publish it.'
          : 'Changes take effect immediately upon saving.'
      }
      actions={
        <Button to="/admin/blog" variant="secondary" size="sm">
          Back to writing
        </Button>
      }
    >
      <UnsavedChangesDialog hasUnsavedChanges={hasUnsavedChanges} />
      <form onSubmit={submit} noValidate>
        <FormSection title="Post details" description="Basic information about the post.">
          <Field
            className="mt-5"
            id="post-title"
            label="Title"
            value={draft.title}
            onChange={onTitleChange}
            error={errors.title}
            required
            limit={120}
          />

          <div className="mt-5">
            <SlugField
              id="post-slug"
              title="URL Slug"
              value={draft.slug}
              onChange={(value) => set('slug', value)}
              locked={slugLocked}
              onLockChange={setSlugLocked}
              error={errors.slug}
              hint={`The post's URL will be /blog/${draft.slug || 'your-slug'}.`}
            />
          </div>

          <Field
            className="mt-5"
            id="post-category"
            label="Category"
            value={draft.category}
            onChange={(value) => set('category', value)}
            error={errors.category}
            required
            placeholder="e.g. Technology, Thoughts, Notes"
          />

          <Field
            className="mt-6"
            id="post-excerpt"
            label="Excerpt"
            type="textarea"
            rows={3}
            value={draft.excerpt ?? ''}
            onChange={(value) => set('excerpt', value)}
            error={errors.excerpt}
            limit={300}
            hint="Shown on the blog list and used as the page's meta description."
            required
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="post-published-at"
              label="Publication date"
              type="date"
              value={draft.published_at}
              onChange={(value) => set('published_at', value)}
              error={errors.published_at}
            />
          </div>

          <div className="mt-5 border-t border-line pt-5">
            <StatusSelector
              type="post"
              status={draft.status}
              setStatus={(value) =>
                setDraft((current) => ({
                  ...current,
                  status: value,
                  published_at:
                    value === 'published' && !current.published_at
                      ? todayIso()
                      : current.published_at,
                }))
              }
            />
          </div>
        </FormSection>

        <FormSection
          title="Content (Markdown)"
          description="The full article content."
          className="mt-6"
        >
          <div className="mt-6">
            <Field
              id="post-content"
              label="Markdown Content"
              type="textarea"
              rows={20}
              value={draft.content ?? ''}
              onChange={(value) => set('content', value)}
              error={errors.content}
              required
            />
          </div>
        </FormSection>

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/90 py-4 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSaving}>
              {isNew ? 'Create post' : 'Save post'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/blog')}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
          <SaveStatus status={saveStatus} />
        </div>
      </form>
    </AdminPage>
  )
}
