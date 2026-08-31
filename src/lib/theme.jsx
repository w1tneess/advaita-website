import { createContext, useContext, useLayoutEffect, useMemo } from 'react'

import { useContent } from './content.jsx'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { settings } = useContent()

  // Apply the accent override from settings, if one is configured.
  useLayoutEffect(() => {
    const root = document.documentElement
    const override = settings.accent

    if (override) {
      root.style.setProperty('--color-accent', override)
      // Derive the hover shade so it stays in the same hue family as the override.
      root.style.setProperty('--color-accent-strong', `color-mix(in srgb, ${override} 82%, white)`)
    } else {
      root.style.removeProperty('--color-accent')
      root.style.removeProperty('--color-accent-strong')
    }
  }, [settings.accent])

  // Mock toggle and isDark to maintain compatibility with existing usages (though toggle is removed)
  const value = useMemo(() => ({ isDark: true, toggle: () => {} }), [])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.')
  return context
}
