import { useState } from 'react'
import { Eye, EyeOff, Lock, AlertCircle } from 'lucide-react'

/**
 * Reusable Password Input component with show/hide visibility toggle and Caps Lock indicator.
 */
export default function PasswordInput({
  id = 'password',
  name = 'password',
  value = '',
  onChange,
  placeholder = '••••••••',
  required = false,
  disabled = false,
  label = 'Password',
  className = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)

  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'))
    }
  }

  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState('CapsLock'))
    }
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="block text-sm font-medium text-ink">
            {label}
          </label>
          {capsLockOn && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-opinion">
              <AlertCircle className="h-3 w-3" aria-hidden="true" />
              Caps Lock is ON
            </span>
          )}
        </div>
      )}

      <div className="relative group">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted group-focus-within:text-accent transition-colors">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="block w-full rounded-xl border border-line bg-canvas/50 py-3.5 pl-12 pr-12 text-sm text-ink placeholder:text-muted/40 transition-all hover:border-line/80 focus:border-accent focus:bg-canvas focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 shadow-inner"
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted transition-colors hover:text-ink focus:outline-none disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-accent" aria-hidden="true" />
          ) : (
            <Eye className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}
