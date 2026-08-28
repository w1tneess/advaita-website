import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Field from '../../components/admin/Field.jsx'
import Button from '@/components/ui/Button.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import SearchInput from '@/components/features/SearchInput.jsx'
import StatusBadge from '@/components/ui/StatusBadge.jsx'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useDebouncedValue } from '@/hooks/useDebouncedValue.js'
import { useFilters } from '@/hooks/useFilters.js'
import { useContent } from '@/lib/content.jsx'
import { formatDateShort, matchesQuery } from '@/lib/format.js'
import { NOTE_STATUSES, todayIso } from '@/lib/schema.js'
import { useToast } from '@/lib/toast.jsx'

/**
 * Philosophy Notes list.
 */

const INITIAL_FILTERS = { query: '', status: 'all' }
const SEARCH_FIELDS = ['title', 'excerpt', 'slug', 'category']

export default function NotesList() {
  const { notes, upsertNote, removeNote } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()
  const { values, setValue, reset, hasActiveFilters } = useFilters(INITIAL_FILTERS)
  const debouncedQuery = useDebouncedValue(values.query, 200)

  const visible = useMemo(
    () =>
      notes
        .filter((note) => values.status === 'all' || note.status === values.status)
        .filter((note) => matchesQuery(note, debouncedQuery, SEARCH_FIELDS)),
    [notes, values.status, debouncedQuery],
  )

  const toggleStatus = async (note) => {
    const next = note.status === 'published' ? 'draft' : 'published'
    try {
      await upsertNote({
        ...note,
        status: next,
        published_at: note.published_at || todayIso(),
      })
      toast.success(
        next === 'published'
          ? `“${note.title}” is now published.`
          : `“${note.title}” is back to draft and hidden.`,
      )
    } catch (e) {
      // error handled in content provider
    }
  }

  const requestDelete = async (note) => {
    const confirmed = await confirm({
      title: `Delete “${note.title}”?`,
      message: 'This removes the note from Supabase. It cannot be undone.',
      confirmLabel: 'Delete note',
    })
    if (!confirmed) return

    try {
      await removeNote(note.id)
      toast.success('Note deleted.')
    } catch (e) {
      // error handled in content provider
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (note) => (
        <div className="min-w-0">
          <p className="font-medium">{note.title || 'Untitled note'}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-muted">/philosophy/{note.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (note) => (
        <span className="text-muted">{note.category ? note.category : '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (note) => <StatusBadge kind="post" value={note.status} />,
    },
    {
      key: 'date',
      header: 'Date',
      render: (note) => (
        <div className="text-muted">
          <p>{formatDateShort(note.published_at) || '—'}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'sm:w-px sm:whitespace-nowrap',
      render: (note) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" to={`/admin/notes/${note.id}`}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatus(note)}
            aria-pressed={note.status === 'published'}
          >
            {note.status === 'published' ? (
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {note.status === 'published'
                ? `Unpublish ${note.title}`
                : `Publish ${note.title}`}
            </span>
          </Button>
          <Button variant="danger" size="sm" onClick={() => requestDelete(note)}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Delete {note.title}</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminPage
      title="Philosophy Notes"
      description="Notes for the philosophy section. Drafts are stored alongside published notes."
      actions={
        <Button to="/admin/notes/new" size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New note
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <SearchInput
          id="notes-search"
          label="Search notes"
          value={values.query}
          onChange={(value) => setValue('query', value)}
          placeholder="Title, excerpt, slug or category…"
        />
        <Field
          id="notes-status"
          label="Status"
          type="select"
          value={values.status}
          onChange={(value) => setValue('status', value)}
          options={[
            { value: 'all', label: 'All statuses' },
            ...NOTE_STATUSES.map((status) => ({ value: status.value, label: status.label })),
          ]}
        />
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {visible.length} of {notes.length} {notes.length === 1 ? 'note' : 'notes'} shown.
      </p>

      <div className="mt-4">
        <DataTable
          caption="Notes, with their category, status and publication date"
          columns={columns}
          rows={visible}
          empty={
            notes.length === 0 ? (
              <EmptyState
                title="No notes yet"
                message="The public section is empty."
                action={<Button to="/admin/notes/new">Write the first one</Button>}
              />
            ) : (
              <EmptyState
                title="No notes match"
                message="Nothing matches the current search and status filter."
                action={
                  hasActiveFilters ? (
                    <Button variant="secondary" onClick={reset}>
                      Clear filters
                    </Button>
                  ) : null
                }
              />
            )
          }
        />
      </div>

      <ConfirmDialog {...dialogProps} />
    </AdminPage>
  )
}
