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
import { POST_STATUSES, todayIso } from '@/lib/schema.js'
import { useToast } from '@/lib/toast.jsx'

const INITIAL_FILTERS = { query: '', status: 'all' }
const SEARCH_FIELDS = ['title', 'excerpt', 'slug', 'category']

export default function BlogList() {
  const { blog, upsertItem, removeItem } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()
  const { values, setValue, reset, hasActiveFilters } = useFilters(INITIAL_FILTERS)
  const debouncedQuery = useDebouncedValue(values.query, 200)

  const visible = useMemo(
    () =>
      blog
        .filter((post) => values.status === 'all' || post.status === values.status)
        .filter((post) => matchesQuery(post, debouncedQuery, SEARCH_FIELDS)),
    [blog, values.status, debouncedQuery],
  )

  const toggleStatus = async (post) => {
    const next = post.status === 'published' ? 'draft' : 'published'
    try {
      const result = await upsertItem('blog', {
        ...post,
        status: next,
        published_at: post.published_at || todayIso(),
      })
      if (result && result.ok) {
        toast.success(
          next === 'published'
            ? `“${post.title}” is now published.`
            : `“${post.title}” is back to draft and hidden.`,
        )
      }
    } catch (_e) {
      // error handled in content provider
    }
  }

  const requestDelete = async (post) => {
    const confirmed = await confirm({
      title: `Delete “${post.title}”?`,
      message: 'This removes the post. It cannot be undone.',
      confirmLabel: 'Delete post',
    })
    if (!confirmed) return

    try {
      const result = await removeItem('blog', post.id)
      if (result && result.ok) {
        toast.success('Post deleted.')
      }
    } catch (_e) {
      // error handled in content provider
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (post) => (
        <div className="min-w-0">
          <p className="font-medium">{post.title || 'Untitled post'}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-muted">/blog/{post.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (post) => <span className="text-muted">{post.category ? post.category : '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (post) => <StatusBadge kind="post" value={post.status} />,
    },
    {
      key: 'date',
      header: 'Date',
      render: (post) => (
        <div className="text-muted">
          <p>{formatDateShort(post.published_at) || '—'}</p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'sm:w-px sm:whitespace-nowrap',
      render: (post) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" to={`/admin/blog/${post.id}`}>
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatus(post)}
            aria-pressed={post.status === 'published'}
          >
            {post.status === 'published' ? (
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span className="sr-only">
              {post.status === 'published' ? `Unpublish ${post.title}` : `Publish ${post.title}`}
            </span>
          </Button>
          <Button variant="danger" size="sm" onClick={() => requestDelete(post)}>
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Delete {post.title}</span>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AdminPage
      title="Writing / Blog"
      description="Manage your blog posts and articles."
      actions={
        <Button to="/admin/blog/new" size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New post
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <SearchInput
          id="blog-search"
          label="Search posts"
          value={values.query}
          onChange={(value) => setValue('query', value)}
          placeholder="Title, excerpt, slug or category…"
        />
        <Field
          id="blog-status"
          label="Status"
          type="select"
          value={values.status}
          onChange={(value) => setValue('status', value)}
          options={[
            { value: 'all', label: 'All statuses' },
            ...POST_STATUSES.map((status) => ({ value: status.value, label: status.label })),
          ]}
        />
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {visible.length} of {blog.length} {blog.length === 1 ? 'post' : 'posts'} shown.
      </p>

      <div className="mt-4">
        <DataTable
          caption="Blog posts, with their category, status and publication date"
          columns={columns}
          rows={visible}
          empty={
            blog.length === 0 ? (
              <EmptyState
                title="No posts yet"
                message="The blog is empty."
                action={<Button to="/admin/blog/new">Write the first one</Button>}
              />
            ) : (
              <EmptyState
                title="No posts match"
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
