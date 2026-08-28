import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'


import AdminPage from '../../components/admin/AdminPage.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Button from '@/components/ui/Button.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { useContent } from '@/lib/content.jsx'
import { useToast } from '@/lib/toast.jsx'
import { formatDateShort } from '@/lib/format.js'

export default function PhotographyList() {
  const { photography, upsertPhotography, removePhotography } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()

  const photos = photography.photos || []

  const toggleFeatured = async (photo) => {
    const next = !photo.featured
    try {
      await upsertPhotography({ ...photo, featured: next })
      toast.success(next ? 'Added to featured photos.' : 'Removed from featured.')
    } catch (e) { console.error(e) }
  }

  const requestDelete = async (photo) => {
    const confirmed = await confirm({
      title: `Delete “${photo.title}”?`,
      message: 'This removes the photo from Supabase Storage and the database. It cannot be undone.',
      confirmLabel: 'Delete photo',
    })
    if (!confirmed) return

    try {
      await removePhotography(photo.id, photo.storage_path)
      toast.success('Photo deleted.')
    } catch (e) { console.error(e) }
  }

  const columns = [
    {
      key: 'image',
      header: 'Photo',
      render: (photo) => (
        <img 
          src={photo.image_url} 
          alt={photo.title} 
          className="h-16 w-16 object-cover rounded" 
        />
      ),
    },
    {
      key: 'title',
      header: 'Details',
      render: (photo) => (
        <div className="min-w-0">
          <p className="font-medium">{photo.title || 'Untitled photo'}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {photo.category} • {photo.caption || 'No caption'}
          </p>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Uploaded',
      render: (photo) => (
        <div className="text-muted">
          <p>{formatDateShort(photo.created_at) || '—'}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'sm:w-px sm:whitespace-nowrap',
      render: (photo) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" to={`/admin/photography/${photo.id}`}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFeatured(photo)}
            aria-pressed={Boolean(photo.featured)}
          >
            {photo.featured ? (
              <Eye className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {photo.featured ? `Unfeature ${photo.title}` : `Feature ${photo.title}`}
            </span>
          </Button>
          <Button variant="danger" size="sm" onClick={() => requestDelete(photo)}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Delete {photo.title}</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminPage
      title="Photography"
      description="Manage the photos displayed on the Photography page."
      actions={
        <Button to="/admin/photography/new" size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Upload photo
        </Button>
      }
    >
      <div className="mt-4">
        <DataTable
          caption="Photography, with their category and uploaded date"
          columns={columns}
          rows={photos}
          empty={
            photos.length === 0 ? (
              <EmptyState
                title="No photos yet"
                message="The public gallery is empty."
                action={<Button to="/admin/photography/new">Upload the first one</Button>}
              />
            ) : (
              <EmptyState
                title="No photos match"
                message="Nothing matches the current filters."
              />
            )
          }
        />
      </div>

      <ConfirmDialog {...dialogProps} />
    </AdminPage>
  )
}
