import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useContent } from './content.jsx'

export interface ThemeContextValue {
  theme: 'dark'
  isDark: boolean
  setTheme: (theme: string) => void
  toggleTheme: () => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useContent()
  const theme = 'dark' as const // Force dark theme

  const setTheme = useCallback(() => {}, [])
  const toggleTheme = useCallback(() => {}, [])

  // Sync theme classes and attributes on root element
  useIsomorphicLayoutEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    root.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    const override = (settings as Record<string, unknown> | undefined)?.accent
    if (override && typeof override === 'string' && override.trim().length > 0) {
      root.style.setProperty('--color-accent', override)
      root.style.setProperty('--color-accent-strong', `color-mix(in oklch, ${override} 85%, white)`)
    } else {
      root.style.removeProperty('--color-accent')
      root.style.removeProperty('--color-accent-strong')
    }
  }, [theme, (settings as Record<string, unknown> | undefined)?.accent])

  const isDark = theme === 'dark'

  const value = useMemo(
    () => ({
      theme,
      isDark,
      setTheme,
      toggleTheme,
      toggle: toggleTheme, // Backward compatibility alias
    }),
    [theme, isDark, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.')
  return context
}
