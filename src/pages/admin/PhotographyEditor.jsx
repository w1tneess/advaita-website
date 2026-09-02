import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Field from '../../components/admin/Field.jsx'
import FormSection from '../../components/admin/forms/FormSection.jsx'
import SaveStatus from '../../components/admin/feedback/SaveStatus.jsx'
import UnsavedChangesDialog from '../../components/admin/feedback/UnsavedChangesDialog.jsx'
import Button from '@/components/ui/Button.jsx'
import Toggle from '../../components/admin/Toggle.jsx'
import { useContent } from '@/lib/content.jsx'
import { createPhotography, hasErrors, validatePhotography, uid } from '@/lib/schema.js'
import { useToast } from '@/lib/toast.jsx'
import { uploadImage } from '@/lib/supabase/api.js'
import { generateImageVariants, IMAGE_VARIANTS } from '@/lib/imageProcessor.js'

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

  // multi-image support
  const [items, setItems] = useState([])
  const [uploading, setUploading] = useState(false)

  // Initialize items from draft
  useEffect(() => {
    if (draft) {
      const initialGallery = draft.gallery?.length > 0 
        ? draft.gallery 
        : draft.image_url 
          ? [{ id: uid('img'), image_url: draft.image_url, storage_path: draft.storage_path, variants: draft.variants || [] }]
          : [];
          
      setItems(initialGallery.map(img => ({ type: 'existing', ...img })))
    }
  }, [draft])

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
    const newFiles = Array.from(e.target.files).map(f => ({
      type: 'file',
      id: uid('file'),
      file: f,
      previewUrl: URL.createObjectURL(f)
    }));
    setItems(prev => [...prev, ...newFiles]);
    setHasUnsavedChanges(true);
    setSaveStatus('idle');
  }

  const moveItem = (index, direction) => {
    setItems(prev => {
      const next = [...prev];
      if (index + direction < 0 || index + direction >= next.length) return next;
      const temp = next[index];
      next[index] = next[index + direction];
      next[index + direction] = temp;
      return next;
    });
    setHasUnsavedChanges(true);
  };
  
  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setHasUnsavedChanges(true);
  };

  const submit = async (event) => {
    event.preventDefault()

    if (items.length === 0) {
      setErrors({ gallery: 'Please select at least one image.' })
      toast.error('Please select at least one image.')
      return
    }

    let finalDraft = { ...draft }

    // Upload new files
    const hasFiles = items.some(item => item.type === 'file')
    if (hasFiles) {
      setUploading(true)
      toast.success('Compressing and uploading images...')
      
      try {
        const processedItems = await Promise.all(items.map(async (item) => {
          if (item.type === 'existing') {
            return {
              id: item.id,
              image_url: item.image_url,
              storage_path: item.storage_path,
              variants: item.variants || []
            }
          } else {
            const file = item.file
            const ext = file.name.split('.').pop()
            const { original, variants } = await generateImageVariants(file)
            
            // Upload original
            const path = `${draft.id}-${item.id}.${ext}`
            const { storagePath, publicUrl } = await uploadImage(original, path)
            
            // Upload variants
            const uploadedVariants = []
            await Promise.all(IMAGE_VARIANTS.map(async (width) => {
              if (variants[width]) {
                const variantPath = `${draft.id}-${item.id}-${width}w.${ext}`
                await uploadImage(variants[width], variantPath)
                uploadedVariants.push(width)
              }
            }))
            
            return {
              id: item.id,
              image_url: publicUrl,
              storage_path: storagePath,
              variants: uploadedVariants
            }
          }
        }))
        
        finalDraft.gallery = processedItems;
        // Optionally keep first image as cover in legacy fields
        if (processedItems.length > 0) {
          finalDraft.image_url = processedItems[0].image_url;
          finalDraft.storage_path = processedItems[0].storage_path;
          finalDraft.variants = processedItems[0].variants;
        }
      } catch (_err) {
        setUploading(false)
        toast.error('Image upload failed.')
        return
      }
      setUploading(false)
    } else {
      // Just save the reordered existing items
      finalDraft.gallery = items.map(item => ({
        id: item.id,
        image_url: item.image_url,
        storage_path: item.storage_path,
        variants: item.variants || []
      }))
      if (finalDraft.gallery.length > 0) {
        finalDraft.image_url = finalDraft.gallery[0].image_url;
        finalDraft.storage_path = finalDraft.gallery[0].storage_path;
        finalDraft.variants = finalDraft.gallery[0].variants;
      }
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
        <FormSection title="Images" description="Select one or more image files. Drag or use arrows to reorder.">
          <div className="mt-5">
            {items.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {items.map((item, index) => (
                  <div key={item.id} className="group relative overflow-hidden rounded-lg border border-line aspect-square bg-raised">
                    <img
                      src={item.type === 'existing' ? item.image_url : item.previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-white bg-black/40 rounded hover:bg-black/80 disabled:opacity-30 transition-colors"
                          aria-label="Move left"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, 1)}
                          disabled={index === items.length - 1}
                          className="p-1 text-white bg-black/40 rounded hover:bg-black/80 disabled:opacity-30 transition-colors"
                          aria-label="Move right"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="self-end">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-white bg-red-500/80 rounded hover:bg-red-500 transition-colors shadow-sm"
                          aria-label="Remove image"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <label className="block text-sm font-medium text-ink">Add Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-raised file:text-ink hover:file:bg-line cursor-pointer"
            />
            {errors.gallery && <p className="mt-1 text-sm text-limitation">{errors.gallery}</p>}
          </div>
        </FormSection>

        <FormSection title="Details" description="Information about the post." className="mt-6">
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
            hint="Describe the primary image for screen readers."
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
              {uploading ? 'Uploading...' : isNew ? 'Create post' : 'Save changes'}
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
