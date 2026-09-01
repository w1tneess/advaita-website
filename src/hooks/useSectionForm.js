import { useCallback, useMemo, useState } from 'react'

import { useContent } from '../lib/content.jsx'
import { hasErrors } from '../lib/schema.js'
import { useToast } from '../lib/toast.jsx'

/**
 * Draft state for one object section of the content document (profile, home, settings).
 *
 * These sections are edited as a whole form rather than field-by-field, so the draft is
 * held locally and only committed on submit. That is what makes "Discard changes"
 * meaningful and stops a half-typed value from reaching the public pages mid-keystroke.
 *
 * @param {string} sectionKey  top-level document key: 'profile' | 'home' | 'settings'
 * @param {object} section     the current committed value
 * @param {Function} validate  (draft) => errors object
 */
export function useSectionForm(sectionKey, section, validate) {
  const { setSection } = useContent()
  const toast = useToast()

  const [draft, setDraft] = useState(section)
  const [errors, setErrors] = useState({})

  const set = useCallback((key, value) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }, [])

  /** Set a value one level down, e.g. setNested('accent', 'light', '#0f6b73'). */
  const setNested = useCallback((key, childKey, value) => {
    setDraft((current) => ({
      ...current,
      [key]: { ...current[key], [childKey]: value },
    }))
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cheap deep comparison. These sections are small, plain-JSON objects.
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(section), [draft, section])

  const submit = useCallback(
    async (event) => {
      event?.preventDefault?.()
      const found = validate(draft)
      setErrors(found)

      if (hasErrors(found)) {
        toast.error('Nothing was saved — check the highlighted fields.')
        return false
      }

      setIsSubmitting(true)
      try {
        const result = await setSection(sectionKey, draft)
        if (result && result.ok) {
          toast.success('Saved to database.')
          return true
        } else {
          return false
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [draft, sectionKey, setSection, toast, validate],
  )

  const revert = useCallback(() => {
    setDraft(section)
    setErrors({})
  }, [section])

  return { draft, set, setNested, setDraft, errors, dirty, submit, revert, isSubmitting }
}
