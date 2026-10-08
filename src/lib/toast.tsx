import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type ToastVariant = 'info' | 'success' | 'error'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

export interface ToastOptions {
  variant?: ToastVariant
  duration?: number
}

export interface ToastContextValue {
  toasts: ToastItem[]
  push: (message: string, options?: ToastOptions) => string
  dismiss: (id: string) => void
  success: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  error: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
  info: (message: string, options?: Omit<ToastOptions, 'variant'>) => string
}

const ToastContext = createContext<ToastContextValue | null>(null)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (message: string, options: ToastOptions = {}) => {
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
      success: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
        push(message, { ...options, variant: 'success' }),
      // Errors stay until dismissed — they usually require the reader to do something.
      error: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
        push(message, { duration: 0, ...options, variant: 'error' }),
      info: (message: string, options?: Omit<ToastOptions, 'variant'>) =>
        push(message, { ...options, variant: 'info' }),
    }),
    [toasts, push, dismiss],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used inside <ToastProvider>.')
  return context
}
