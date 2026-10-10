import { useCallback, useRef, useState } from 'react'

/**
 * Promise-based confirmation.
 *
 * Every destructive action in the admin panel routes through this, so nothing is
 * deleted on a single click.
 *
 * Usage:
 *   const { confirm, dialogProps } = useConfirm()
 *   ...
 *   if (await confirm({ title: 'Delete this project?', tone: 'danger' })) remove(id)
 *   ...
 *   <ConfirmDialog {...dialogProps} />
 */
export function useConfirm() {
  const [request, setRequest] = useState(null)
  const resolver = useRef(null)

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      resolver.current = resolve
      setRequest({
        title: options.title ?? 'Are you sure?',
        message: options.message ?? '',
        confirmLabel: options.confirmLabel ?? 'Confirm',
        cancelLabel: options.cancelLabel ?? 'Cancel',
        tone: options.tone ?? 'danger',
      })
    })
  }, [])

  const resolveWith = useCallback((result) => {
    setRequest(null)
    const resolve = resolver.current
    resolver.current = null
    resolve?.(result)
  }, [])

  return {
    confirm,
    dialogProps: {
      open: request !== null,
      title: request?.title ?? '',
      message: request?.message ?? '',
      confirmLabel: request?.confirmLabel ?? 'Confirm',
      cancelLabel: request?.cancelLabel ?? 'Cancel',
      tone: request?.tone ?? 'danger',
      onConfirm: () => resolveWith(true),
      onCancel: () => resolveWith(false),
    },
  }
}
