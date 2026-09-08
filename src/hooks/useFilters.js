import { useCallback, useMemo, useState } from 'react'

/**
 * Search / filter / sort state for a list view.
 *
 * Shared by the public Portfolio and Blog pages and by the admin list pages so that
 * "clear filters" and the active-filter count behave identically everywhere.
 *
 * @param {Record<string, unknown>} initial the default value of every filter
 */
export function useFilters(initial = {}) {
  const [values, setValues] = useState(initial)

  const setValue = useCallback((key, value) => {
    setValues((current) => ({ ...current, [key]: value }))
  }, [])

  /** Set a value, or clear it back to the default if it is already selected. Supports arrays for multi-select. */
  const toggleValue = useCallback(
    (key, value) => {
      setValues((current) => {
        const currentVal = current[key]
        if (Array.isArray(currentVal)) {
          return {
            ...current,
            [key]: currentVal.includes(value)
              ? currentVal.filter((v) => v !== value)
              : [...currentVal, value],
          }
        }
        return {
          ...current,
          [key]: currentVal === value ? initial[key] : value,
        }
      })
    },
    [initial],
  )

  const reset = useCallback(() => setValues(initial), [initial])

  const activeCount = useMemo(
    () =>
      Object.entries(values).filter(([key, value]) => {
        const base = initial[key]
        if (Array.isArray(value)) {
          if (!Array.isArray(base)) return value.length > 0
          if (value.length !== base.length) return true
          return value.some((v) => !base.includes(v))
        }
        if (typeof value === 'string') return value.trim() !== String(base ?? '').trim()
        return value !== base
      }).length,
    [values, initial],
  )

  return { values, setValue, toggleValue, reset, activeCount, hasActiveFilters: activeCount > 0 }
}
