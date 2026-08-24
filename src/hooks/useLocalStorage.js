import { useCallback, useEffect, useState } from 'react'

/**
 * A piece of UI state persisted to localStorage.
 *
 * For small, non-sensitive preferences only — sidebar collapsed state and similar.
 * Site content goes through src/lib/store.js instead.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Unavailable in some private-browsing modes; the value still works in memory.
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset]
}
