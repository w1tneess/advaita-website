import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { useCallback, useState } from 'react'

import Button from '../Button.jsx'
import Card from '../Card.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import ReorderList from './ReorderList.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { useContent } from '../../lib/content.jsx'
import { hasErrors } from '../../lib/schema.js'
import { useToast } from '../../lib/toast.jsx'

/**
 * Add / edit / reorder / delete for one collection in the content document.
 *
 * Interests, skills, timeline entries, social links, categories and tags all need exactly
 * this: an ordered list, an inline form, a validated save, and a confirmed delete. The
 * only thing that differs between them is which fields the form shows — so that is the
 * one thing callers supply.
 *
 * @param {string} path            document path, e.g. 'skills' or 'categories.blog'
 * @param {Array}  items           the collection, already in display order
 * @param {Function} create        () => a new blank item
 * @param {Function} validate      (draft, siblings) => errors object
 * @param {Function} labelFor      (item) => short name, used in buttons and announcements
 * @param {Function} summary       (item) => JSX for the list row
 * @param {Function} fields        ({draft, set, errors}) => the form fields
 */
export default function CollectionEditor({
  path,
  items,
  create,
  validate,
  labelFor,
  summary,
  fields,
  singular = 'item',
  addLabel,
  emptyMessage,
  className = '',
}) {
  const { upsertItem, removeItem, moveItem } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()

  // null = closed. Otherwise the draft being edited; `isNew` decides the toast wording.
  const [draft, setDraft] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [errors, setErrors] = useState({})

  const set = useCallback((key, value) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }, [])

  const openNew = () => {
    setDraft(create())
    setIsNew(true)
    setErrors({})
  }

  const openEdit = (item) => {
    setDraft({ ...item })
    setIsNew(false)
    setErrors({})
  }

  const close = () => {
    setDraft(null)
    setErrors({})
  }

  const save = (event) => {
    event.preventDefault()
    const found = validate(draft, items)
    setErrors(found)

    if (hasErrors(found)) {
      toast.error('That could not be saved yet — check the highlighted fields.')
      return
    }

    upsertItem(path, draft)
    toast.success(`${labelFor(draft) || singular} ${isNew ? 'added' : 'saved'}.`)
    close()
  }

  const requestDelete = async (item) => {
    const label = labelFor(item) || `this ${singular}`
    const confirmed = await confirm({
      title: `Delete ${label}?`,
      message: `This removes the ${singular} from your local copy of the content. It cannot be undone from here — a fresh copy would need to come from an export or from resetting the demo data.`,
      confirmLabel: 'Delete',
    })
    if (!confirmed) return

    removeItem(path, item.id)
    if (draft?.id === item.id) close()
    toast.success(`${label} deleted.`)
  }

  return (
    <div className={className}>
      {draft === null ? (
        <Button onClick={openNew} size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          {addLabel ?? `Add ${singular}`}
        </Button>
      ) : (
        <Card className="p-5">
          <form onSubmit={save} noValidate>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold">
                {isNew ? `New ${singular}` : `Editing: ${labelFor(draft) || singular}`}
              </h3>
              <button
                type="button"
                onClick={close}
                className="rounded-md p-1 text-muted transition-colors hover:text-ink"
                aria-label="Cancel editing"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-5">{fields({ draft, set, errors })}</div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
              <Button type="submit" size="sm">
                {isNew ? `Add ${singular}` : 'Save changes'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={close}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <ReorderList
        className="mt-6"
        items={items}
        labelFor={labelFor}
        onMove={(id, delta) => moveItem(path, id, delta)}
        emptyMessage={emptyMessage ?? `No ${singular}s yet.`}
        renderItem={summary}
        renderActions={(item) => (
          <>
            <Button variant="secondary" size="sm" onClick={() => openEdit(item)}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Edit</span>
            </Button>
            <Button variant="danger" size="sm" onClick={() => requestDelete(item)}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Delete {labelFor(item)}</span>
            </Button>
          </>
        )}
      />

      <ConfirmDialog {...dialogProps} />
    </div>
  )
}
