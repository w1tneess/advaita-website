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
import {
  createNote,
  hasErrors,
  slugify,
  todayIso,
  validateNote,
} from '@/lib/schema.js'
import { useToast } from '@/lib/toast.jsx'

export default function NoteEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { notes, upsertNote } = useContent()

  const isNew = id === 'new'
  const existing = notes.find((n) => n.id === id) ?? null

  const [draft, setDraft] = useState(() => (isNew ? createNote() : existing ? { ...existing } : null))
  const [errors, setErrors] = useState({})
  const [slugLocked, setSlugLocked] = useState(!isNew)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle') // idle, saving, success, error
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  if (draft === null) {
    return (
      <AdminPage
        title="Note not found"
        description="There is no note with that id in the database."
      >
        <Button to="/admin/notes" variant="secondary">
          Back to notes
        </Button>
      </AdminPage>
    )
  }

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
    event.preventDefault()
    const found = validateNote(draft, notes)
    setErrors(found)

    if (hasErrors(found)) {
      toast.error('Nothing was saved — check the highlighted fields.')
      setSaveStatus('error')
      return
    }

    setSaveStatus('saving')
    setIsSaving(true)
    try {
      await upsertNote(draft)
      setSaveStatus('success')
      setHasUnsavedChanges(false)
      toast.success(`“${draft.title}” ${isNew ? 'created' : 'saved'}.`)
      setTimeout(() => navigate('/admin/notes'), 800)
    } catch (e) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPage
      title={isNew ? 'New note' : 'Edit note'}
      description={
        isNew
          ? 'Write a note for the philosophy section. It stays a draft until you publish it.'
          : 'Changes take effect immediately upon saving.'
      }
      actions={
        <Button to="/admin/notes" variant="secondary" size="sm">
          Back to notes
        </Button>
      }
    >
      <UnsavedChangesDialog hasUnsavedChanges={hasUnsavedChanges} />
      <form onSubmit={submit} noValidate>
        <FormSection title="Note details" description="Basic information about the note.">
          <Field
            className="mt-5"
            id="note-title"
            label="Title"
            value={draft.title}
            onChange={onTitleChange}
            error={errors.title}
            required
            limit={140}
          />

          <div className="mt-5">
            <SlugField
              id="note-slug"
              title="URL Slug"
              value={draft.slug}
              onChange={(value) => set('slug', value)}
              locked={slugLocked}
              onLockChange={setSlugLocked}
              error={errors.slug}
              hint={`The note's URL will be /philosophy/${draft.slug || 'your-slug'}.`}
            />
          </div>

          <Field
            className="mt-5"
            id="note-category"
            label="Category"
            value={draft.category}
            onChange={(value) => set('category', value)}
            error={errors.category}
            required
            placeholder="e.g. Design, Thoughts, Reflections"
          />

          <Field
            className="mt-6"
            id="note-excerpt"
            label="Excerpt"
            type="textarea"
            rows={3}
            value={draft.excerpt ?? ''}
            onChange={(value) => set('excerpt', value)}
            error={errors.excerpt}
            limit={300}
            hint="Shown on the philosophy card and used as the page's meta description."
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="note-published-at"
              label="Publication date"
              type="date"
              value={draft.published_at}
              onChange={(value) => set('published_at', value)}
              error={errors.published_at}
              required
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
                    value === 'published' && !current.published_at ? todayIso() : current.published_at,
                }))
              }
            />
          </div>
        </FormSection>

        <FormSection title="Content (Markdown)" description="The full note content." className="mt-6">
          
          <div className="mt-6">
            <Field
              id="note-content"
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

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/90 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSaving}>
              {isNew ? 'Create note' : 'Save note'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/admin/notes')} disabled={isSaving}>
              Cancel
            </Button>
          </div>
          <SaveStatus status={saveStatus} />
        </div>
      </form>
    </AdminPage>
  )
}
