import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Field from '../../components/admin/Field.jsx'
import FormSection from '../../components/admin/forms/FormSection.jsx'
import SaveStatus from '../../components/admin/feedback/SaveStatus.jsx'
import UnsavedChangesDialog from '../../components/admin/feedback/UnsavedChangesDialog.jsx'
import Button from '@/components/ui/Button.jsx'
import Toggle from '../../components/admin/Toggle.jsx'
import { useContent } from '@/lib/content.jsx'
import { createPhotography, hasErrors, validatePhotography } from '@/lib/schema.js'
import { useToast } from '@/lib/toast.jsx'
import { uploadImage } from '@/lib/supabase/api.js'

export default function PhotographyEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { photography, upsertPhotography } = useContent()

  const isNew = id === 'new'
  const existing = (photography.photos || []).find((p) => p.id === id) ?? null

  const [draft, setDraft] = useState(() =>
    isNew ? createPhotography() : existing ? { ...existing } : null,
  )
  const [errors, setErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  if (draft === null) {
    return (
      <AdminPage title="Photo not found" description="There is no photo with that id.">
        <Button to="/admin/photography" variant="secondary">
          Back to gallery
        </Button>
      </AdminPage>
    )
  }

  const set = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  const submit = async (event) => {
    event.preventDefault()

    // If it's new and no file is selected, it's an error
    if (isNew && !file && !draft.image_url) {
      setErrors({ image_url: 'Please select an image to upload.' })
      toast.error('Please select an image.')
      return
    }

    let finalDraft = { ...draft }

    // Upload the file if one was selected
    if (file) {
      setUploading(true)
      try {
        const ext = file.name.split('.').pop()
        const path = `${draft.id}.${ext}`
        const { storagePath, publicUrl } = await uploadImage(file, path)
        finalDraft.image_url = publicUrl
        finalDraft.storage_path = storagePath
      } catch (_err) {
        setUploading(false)
        toast.error('Image upload failed.')
        return
      }
      setUploading(false)
    }

    const found = validatePhotography(finalDraft)
    setErrors(found)

    if (hasErrors(found)) {
      toast.error('Nothing was saved — check the highlighted fields.')
      setSaveStatus('error')
      return
    }

    setSaveStatus('saving')
    setIsSaving(true)
    try {
      const result = await upsertPhotography(finalDraft)
      if (result && result.ok) {
        setSaveStatus('success')
        setHasUnsavedChanges(false)
        toast.success(`“${finalDraft.title}” ${isNew ? 'uploaded' : 'saved'}.`)
        setTimeout(() => navigate('/admin/photography'), 800)
      } else {
        setSaveStatus('error')
      }
    } catch (_e) {
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminPage
      title={isNew ? 'Upload photo' : 'Edit photo'}
      description="Add or edit photos in the gallery."
      actions={
        <Button to="/admin/photography" variant="secondary" size="sm">
          Back
        </Button>
      }
    >
      <UnsavedChangesDialog hasUnsavedChanges={hasUnsavedChanges} />
      <form onSubmit={submit} noValidate>
        <FormSection title="Image" description="Select an image file.">
          <div className="mt-5">
            {draft.image_url ? (
              <div className="mb-4">
                <img
                  src={draft.image_url}
                  alt="Preview"
                  className="h-48 w-48 object-cover rounded-lg border border-line"
                />
              </div>
            ) : null}

            <label className="block text-sm font-medium text-ink">Select Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-raised file:text-ink hover:file:bg-line cursor-pointer"
            />
            {errors.image_url && <p className="mt-1 text-sm text-limitation">{errors.image_url}</p>}
          </div>
        </FormSection>

        <FormSection title="Details" description="Information about the photo." className="mt-6">
          <Field
            className="mt-5"
            id="photo-title"
            label="Title"
            value={draft.title}
            onChange={(value) => set('title', value)}
            error={errors.title}
            required
            limit={140}
          />

          <Field
            className="mt-5"
            id="photo-category"
            label="Category (optional)"
            value={draft.category ?? ''}
            onChange={(value) => set('category', value)}
            error={errors.category}
            hint="Freedom of expression. Type any category, or leave blank."
            limit={60}
          />

          <Field
            className="mt-5"
            id="photo-caption"
            label="Caption"
            type="textarea"
            rows={2}
            value={draft.caption ?? ''}
            onChange={(value) => set('caption', value)}
            error={errors.caption}
            limit={300}
          />

          <Field
            className="mt-5"
            id="photo-alt"
            label="Alt text"
            value={draft.alt_text ?? ''}
            onChange={(value) => set('alt_text', value)}
            error={errors.alt_text}
            required
            hint="Describe the image for screen readers."
          />

          <div className="mt-6 border-t border-line pt-5">
            <Toggle
              id="photo-featured"
              label="Feature on gallery top"
              description="Show this prominently in the gallery."
              checked={Boolean(draft.featured)}
              onChange={(value) => set('featured', value)}
            />
          </div>
        </FormSection>

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/90 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={uploading || isSaving}>
              {uploading ? 'Uploading...' : isNew ? 'Upload photo' : 'Save photo'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/photography')}
              disabled={uploading || isSaving}
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
