import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

/**
 * Toast notifications.
 *
 * Rendered by <ToastViewport>, which lives in App.jsx so that messages are visible
 * on the public site too (a blocked-localStorage warning has to surface somewhere).
 */

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (message, options = {}) => {
      const { variant = 'info', duration = 5000 } = options
      toastId += 1
      const id = `toast-${toastId}`

      setToasts((current) => [...current, { id, message, variant }])

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration)
        timers.current.set(id, timer)
      }

      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      toasts,
      push,
      dismiss,
      success: (message, options) => push(message, { ...options, variant: 'success' }),
      // Errors stay until dismissed — they usually require the reader to do something.
      error: (message, options) => push(message, { duration: 0, ...options, variant: 'error' }),
      info: (message, options) => push(message, { ...options, variant: 'info' }),
    }),
    [toasts, push, dismiss],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.')
  return context
}
