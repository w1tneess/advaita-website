import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useContent } from './content.jsx'
import { THEME_STORAGE_KEY } from './store.js'

/**
 * Dark mode and accent colour.
 *
 * The `.dark` class is applied to <html> before first paint by the inline script in
 * index.html, so there is no flash. This provider takes over from there and keeps the
 * two in sync — the storage key and the light/dark/system semantics must match that
 * script exactly.
 */

const ThemeContext = createContext(null)

const VALID_PREFERENCES = ['light', 'dark', 'system']

function readStoredPreference() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return VALID_PREFERENCES.includes(stored) ? stored : null
  } catch {
    return null
  }
}

function systemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }) {
  const { settings } = useContent()

  // An explicit stored choice wins; otherwise fall back to the site's configured default.
  const [preference, setPreference] = useState(
    () => readStoredPreference() ?? settings.defaultTheme ?? 'system',
  )
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark)

  const isDark = preference === 'dark' || (preference === 'system' && prefersDark)

  // Track the OS setting so 'system' stays live rather than sampled once.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event) => setPrefersDark(event.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  // Apply the theme to the document and remember the choice.
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    root.style.colorScheme = isDark ? 'dark' : 'light'

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    } catch {
      // Private browsing: the theme still applies, it just will not be remembered.
    }
  }, [isDark, preference])

  // Apply the accent override from settings, if one is configured.
  useEffect(() => {
    const root = document.documentElement
    const override = isDark ? settings.accent?.dark : settings.accent?.light

    if (override) {
      root.style.setProperty('--color-accent', override)
      // Derive the hover shade so it stays in the same hue family as the override.
      root.style.setProperty(
        '--color-accent-strong',
        `color-mix(in srgb, ${override} 82%, ${isDark ? 'white' : 'black'})`,
      )
    } else {
      root.style.removeProperty('--color-accent')
      root.style.removeProperty('--color-accent-strong')
    }
  }, [isDark, settings.accent?.dark, settings.accent?.light])

  const toggle = useCallback(() => {
    setPreference(isDark ? 'light' : 'dark')
  }, [isDark])

  const value = useMemo(
    () => ({ preference, setPreference, isDark, toggle }),
    [preference, isDark, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.')
  return context
}
