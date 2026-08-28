import { AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button.jsx'
import { useConfirm } from '@/hooks/useConfirm.jsx'

/**
 * Dialog warning user about unsaved changes on navigation.
 *
 * Prevents accidental data loss when leaving a page with edits.
 * Offers options to save, discard, or cancel.
 */

export default function UnsavedChangesDialog({
  isDirty,
  onSave,
  onDiscard,
  itemName = 'changes',
}) {
  const { confirm, dialogProps } = useConfirm()

  const handleNavigation = async () => {
    const confirmed = await confirm({
      title: 'Unsaved changes',
      message: `You have unsaved ${itemName}. Do you want to save them before leaving?`,
      confirmLabel: 'Save',
      cancelLabel: 'Discard',
      dangerous: true,
    })

    if (confirmed) {
      await onSave?.()
    } else {
      onDiscard?.()
    }
  }

  if (!isDirty) {
    return null
  }

  return (
    <div className="space-y-3 rounded-lg border border-limitation/30 bg-limitation/10 p-4">
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-limitation" aria-hidden="true" />
        <div>
          <p className="font-medium text-ink">You have unsaved changes</p>
          <p className="mt-1 text-sm text-muted">
            These changes will be lost if you leave without saving.
          </p>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button size="sm" onClick={onSave}>
          Save changes
        </Button>
        <Button size="sm" variant="secondary" onClick={onDiscard}>
          Discard
        </Button>
      </div>
    </div>
  )
}
