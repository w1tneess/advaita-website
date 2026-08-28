import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/lib/theme.jsx'

/** Light/dark toggle. The label describes the action, not the current state. */
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggle } = useTheme()
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button
      type="button"
      onClick={toggle}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
