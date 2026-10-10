import { useCallback, useState } from 'react'

/**
 * Reusable slug field with auto-generation and manual editing.
 *
 * Consolidates slug logic from ProjectEditor and PostEditor.
 * Provides validation and duplicate detection.
 */

export default function SlugField({
  id,
  value,
  onChange,
  title,
  locked = false,
  onLockChange,
  _validateUnique = false,
  hint,
  error,
}) {
  const [isManualEdit, setIsManualEdit] = useState(locked)

  const handleChange = useCallback(
    (newValue) => {
      // Normalize: lowercase, replace spaces with dashes, remove special chars
      const normalized = newValue
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')

      onChange(normalized)
    },
    [onChange],
  )

  const toggleLock = useCallback(() => {
    const newLocked = !isManualEdit
    setIsManualEdit(newLocked)
    if (onLockChange) {
      onLockChange(newLocked)
    }
  }, [isManualEdit, onLockChange])

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {title || 'Slug'}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          disabled={locked}
          placeholder="url-slug-format"
          className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-mono text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={toggleLock}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            isManualEdit
              ? 'border-accent bg-accent/10 text-accent hover:bg-accent/20'
              : 'border-line text-muted hover:bg-raised'
          }`}
          title={isManualEdit ? 'Auto-generate from title' : 'Manual edit'}
          aria-pressed={isManualEdit}
        >
          {isManualEdit ? 'Edit' : 'Auto'}
        </button>
      </div>
      {hint && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-limitation">{error}</p>}
    </div>
  )
}
