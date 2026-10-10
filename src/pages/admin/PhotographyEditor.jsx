import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ChevronLeft, ChevronRight, X as XIcon, UploadCloud, Sparkles } from 'lucide-react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Field from '../../components/admin/Field.jsx'
import FormSection from '../../components/admin/forms/FormSection.jsx'
import SaveStatus from '../../components/admin/feedback/SaveStatus.jsx'
import UnsavedChangesDialog from '../../components/admin/feedback/UnsavedChangesDialog.jsx'
import Button from '@/components/ui/Button'
import Toggle from '../../components/admin/Toggle.jsx'
import { useContent } from '@/lib/content.jsx'
import { createPhotography, hasErrors, validatePhotography, uid } from '@/lib/schema.js'
import { useToast } from '@/lib/toast'
import { uploadImage } from '@/lib/supabase/api.js'
import { generateImageVariants, IMAGE_VARIANTS } from '@/lib/imageProcessor'
import { extractExifFromFile } from '@/lib/exif.js'
import { isSafeImageUrl, sanitizeImageUrl } from '@/lib/url.ts'

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
  const [items, setItems] = useState(() => {
    if (!existing) return []
    const initialGallery = existing.gallery?.length > 0 
      ? existing.gallery 
      : existing.image_url 
        ? [{ id: uid('img'), image_url: existing.image_url, storage_path: existing.storage_path, variants: existing.variants || [] }]
        : []
    return initialGallery.map(img => ({ type: 'existing', ...img }))
  })
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleAddUrl = (e) => {
    if (e && e.preventDefault) e.preventDefault()
    const trimmed = urlInput.trim()
    if (!trimmed) return
    if (!isSafeImageUrl(trimmed)) {
      toast.error('Please enter a valid HTTP(S) image URL or relative path.')
      return
    }
    const safeUrl = sanitizeImageUrl(trimmed)
    if (!safeUrl) {
      toast.error('Please enter a valid HTTP(S) image URL or relative path.')
      return
    }
    setItems((prev) => [
      ...prev,
      {
        type: 'existing',
        id: uid('img'),
        image_url: safeUrl,
        storage_path: '',
        variants: [],
        aspectRatio: null,
      },
    ])
    setUrlInput('')
    setHasUnsavedChanges(true)
    setSaveStatus('idle')
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      })
    }
  }, [items])

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

  const processFiles = async (fileList) => {
    const rawFiles = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!rawFiles.length) return

    let detectedExif = null
    const newFiles = []

    for (const f of rawFiles) {
      const url = URL.createObjectURL(f)
      let aspectRatio = null

      try {
        const img = new Image()
        img.src = url
        await img.decode()
        aspectRatio = `${img.width}/${img.height}`
      } catch (_err) {
        console.warn('Could not extract dimensions for', f.name)
      }

      // Client-side auto-EXIF extraction
      try {
        const exifData = await extractExifFromFile(f)
        if (exifData && !detectedExif) {
          detectedExif = exifData
        }
      } catch (err) {
        console.debug('EXIF extraction skipped:', err)
      }

      newFiles.push({
        type: 'file',
        id: uid('file'),
        file: f,
        previewUrl: url,
        aspectRatio,
      })
    }

    setItems((prev) => [...prev, ...newFiles])
    setHasUnsavedChanges(true)
    setSaveStatus('idle')

    // Auto-populate EXIF metadata if found and not yet filled
    if (detectedExif) {
      setDraft((curr) => ({
        ...curr,
        camera: curr.camera || detectedExif.camera || '',
        lens: curr.lens || detectedExif.lens || '',
        aperture: curr.aperture || detectedExif.aperture || '',
        shutter_speed: curr.shutter_speed || detectedExif.shutter_speed || '',
        focal_length: curr.focal_length || detectedExif.focal_length || '',
        iso: curr.iso || detectedExif.iso || '',
      }))

      const tags = [detectedExif.camera, detectedExif.aperture, detectedExif.shutter_speed, detectedExif.iso]
        .filter(Boolean)
        .join(', ')
      if (tags) {
        toast.info(`Auto-detected EXIF: ${tags}`)
      }
    }
  }

  const handleFileChange = (e) => {
    processFiles(e.target.files)
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
    setItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
    setHasUnsavedChanges(true)
  }

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
            uploadedVariants.sort((a, b) => a - b)
            
              return {
              id: item.id,
              image_url: publicUrl,
              storage_path: storagePath,
              variants: uploadedVariants,
              aspectRatio: item.aspectRatio
            }
          }
        }))
        
        finalDraft.gallery = processedItems;
        // Optionally keep first image as cover in legacy fields
        if (processedItems.length > 0) {
          finalDraft.image_url = processedItems[0].image_url;
          finalDraft.storage_path = processedItems[0].storage_path;
          finalDraft.variants = processedItems[0].variants;
          finalDraft.aspectRatio = processedItems[0].aspectRatio;
        }
      } catch (err) {
        setUploading(false)
        console.error('Image upload failed:', err)
        toast.error(`Upload error: ${err.message || 'Check Supabase bucket permissions'}. You can also use the direct URL field above.`)
        return
      }
      setUploading(false)
    } else {
      // Just save the reordered existing items
      finalDraft.gallery = items.map(item => ({
        id: item.id,
        image_url: item.image_url,
        storage_path: item.storage_path,
        variants: item.variants || [],
        aspectRatio: item.aspectRatio
      }))
      if (finalDraft.gallery.length > 0) {
        finalDraft.image_url = finalDraft.gallery[0].image_url;
        finalDraft.storage_path = finalDraft.gallery[0].storage_path;
        finalDraft.variants = finalDraft.gallery[0].variants;
        finalDraft.aspectRatio = finalDraft.gallery[0].aspectRatio;
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
                      src={
                        item.type === 'existing'
                          ? sanitizeImageUrl(item.image_url)
                          : sanitizeImageUrl(item.previewUrl)
                      }
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="p-1 text-white bg-black/40 rounded hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] disabled:active:scale-100"
                          aria-label="Move left"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, 1)}
                          disabled={index === items.length - 1}
                          className="p-1 text-white bg-black/40 rounded hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] disabled:active:scale-100"
                          aria-label="Move right"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="self-end">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-white bg-red-500/80 rounded hover:bg-red-500 transition-all duration-150 ease-[var(--ease-out-quart)] active:scale-[0.97] shadow-sm"
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

            {/* Apple Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDragging(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                if (e.dataTransfer.files?.length) {
                  processFiles(e.dataTransfer.files)
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-250 ease-[var(--ease-out-quart)] active:scale-[0.99] ${
                isDragging
                  ? 'border-accent bg-accent/10 scale-[1.01]'
                  : 'border-line hover:border-accent/40 bg-surface/40 hover:bg-surface/70'
              }`}
            >
              <div className="h-12 w-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3 shadow-subtle">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-ink">
                Click to browse or drag & drop photographs here
              </p>
              <p className="text-xs text-muted mt-1.5 flex items-center gap-1.5 font-mono">
                <Sparkles className="h-3 w-3 text-accent" />
                Auto-extracts camera, lens, aperture, shutter & ISO from EXIF
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="url"
                placeholder="Or paste direct image URL (https://... or /pfp.png)..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddUrl()
                  }
                }}
                className="flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:-translate-y-0.5 focus:shadow-subtle transition-all duration-250 ease-[var(--ease-out-quart)]"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddUrl}>
                Add URL
              </Button>
            </div>
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

        <FormSection
          title="Optics & Exposure"
          description="Camera hardware, lens, and exposure settings extracted automatically from EXIF or adjusted manually."
          className="mt-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <Field
              id="photo-camera"
              label="Camera Model"
              value={draft.camera ?? ''}
              onChange={(value) => set('camera', value)}
              placeholder="e.g. Fujifilm X-T4 or Leica M6"
            />
            <Field
              id="photo-lens"
              label="Lens"
              value={draft.lens ?? ''}
              onChange={(value) => set('lens', value)}
              placeholder="e.g. XF 35mm f/1.4 R"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <Field
              id="photo-aperture"
              label="Aperture"
              value={draft.aperture ?? ''}
              onChange={(value) => set('aperture', value)}
              placeholder="e.g. f/2.8"
            />
            <Field
              id="photo-shutter"
              label="Shutter Speed"
              value={draft.shutter_speed ?? ''}
              onChange={(value) => set('shutter_speed', value)}
              placeholder="e.g. 1/250s"
            />
            <Field
              id="photo-iso"
              label="ISO"
              value={draft.iso ?? ''}
              onChange={(value) => set('iso', value)}
              placeholder="e.g. ISO 400"
            />
            <Field
              id="photo-focal-length"
              label="Focal Length"
              value={draft.focal_length ?? ''}
              onChange={(value) => set('focal_length', value)}
              placeholder="e.g. 50mm"
            />
          </div>

          <Field
            className="mt-4"
            id="photo-location"
            label="Location / Region (optional)"
            value={draft.location ?? ''}
            onChange={(value) => set('location', value)}
            placeholder="e.g. Kolkata, West Bengal"
          />
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
