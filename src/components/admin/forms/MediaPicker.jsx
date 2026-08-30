import { Upload, X } from 'lucide-react'
import { useRef } from 'react'
import Button from '@/components/ui/Button.jsx'

/**
 * Media picker component for image uploads.
 *
 * Handles file validation, preview, and upload integration.
 * Used across ProjectEditor, PostEditor, and ProfileEditor.
 */

export default function MediaPicker({
  id,
  label,
  value,
  onChange,
  hint,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
}) {
  const inputRef = useRef(null)

  const handleFileSelect = (file) => {
    if (!file) return

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate size
    if (file.size > maxSize) {
      alert(`File size must be under ${maxSize / 1024 / 1024}MB`)
      return
    }

    // Convert to data URL for preview (in production, upload to Supabase Storage)
    const reader = new FileReader()
    reader.onload = (e) => {
      onChange({
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result, // Base64 for preview
      })
    }
    reader.readAsDataURL(file)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleClear = () => {
    onChange(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink">{label}</label>

      <input
        ref={inputRef}
        type="file"
        id={id}
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files?.[0])}
        className="hidden"
      />

      {value ? (
        <div className="space-y-2">
          <div className="relative inline-block">
            <img
              src={value.data || value}
              alt="Preview"
              className="h-32 w-32 rounded-lg border border-line object-cover"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-1 right-1 rounded-full bg-ink/80 p-1 text-surface hover:bg-ink"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {value.name && <p className="text-xs text-muted">{value.name}</p>}
          <Button type="button" variant="secondary" size="sm" onClick={handleClick}>
            Change image
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full rounded-lg border-2 border-dashed border-line bg-raised/50 px-6 py-8 text-center transition-colors hover:border-accent hover:bg-raised"
        >
          <Upload className="mx-auto h-6 w-6 text-muted" aria-hidden="true" />
          <p className="mt-2 text-sm font-medium text-ink">Upload image</p>
          <p className="text-xs text-muted">PNG, JPG, or WebP</p>
        </button>
      )}

      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
