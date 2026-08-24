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

  /** Set a value, or clear it back to the default if it is already selected. */
  const toggleValue = useCallback(
    (key, value) => {
      setValues((current) => ({
        ...current,
        [key]: current[key] === value ? initial[key] : value,
      }))
    },
    [initial],
  )

  const reset = useCallback(() => setValues(initial), [initial])

  const activeCount = useMemo(
    () =>
      Object.entries(values).filter(([key, value]) => {
        const base = initial[key]
        if (typeof value === 'string') return value.trim() !== String(base ?? '').trim()
        return value !== base
      }).length,
    [values, initial],
  )

  return { values, setValue, toggleValue, reset, activeCount, hasActiveFilters: activeCount > 0 }
}
