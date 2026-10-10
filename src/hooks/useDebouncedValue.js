import { useEffect, useState } from 'react'

/**
 * Delays a rapidly-changing value so search filtering does not run on every keystroke.
 * The input itself stays fully controlled and responsive; only the derived filtering waits.
 */
export function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
