import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

import AdminPage from '../../components/admin/AdminPage.jsx'
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx'
import DataTable from '../../components/admin/DataTable.jsx'
import Field from '../../components/admin/Field.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import SearchInput from '../../components/SearchInput.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { useConfirm } from '../../hooks/useConfirm.jsx'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { useFilters } from '../../hooks/useFilters.js'
import { useContent } from '../../lib/content.jsx'
import { formatDateShort, matchesQuery, readingMinutes } from '../../lib/format.js'
import { POST_STATUSES, todayIso } from '../../lib/schema.js'
import { useToast } from '../../lib/toast.jsx'

/**
 * Article list.
 *
 * A table rather than a reorderable list: articles are ordered by publication date on the
 * public site, so a manual order here would be a control that does nothing.
 */

// Module scope so useFilters keeps a stable reference to it across renders.
const INITIAL_FILTERS = { query: '', status: 'all' }
const SEARCH_FIELDS = ['title', 'excerpt', 'slug', 'tags']

export default function PostsList() {
  const { posts, blogCategories, patchItem, removeItem } = useContent()
  const toast = useToast()
  const { confirm, dialogProps } = useConfirm()
  const { values, setValue, reset, hasActiveFilters } = useFilters(INITIAL_FILTERS)
  const debouncedQuery = useDebouncedValue(values.query, 200)

  const categoryName = (slug) =>
    blogCategories.find((category) => category.slug === slug)?.name ?? slug

  const visible = useMemo(
    () =>
      posts
        .filter((post) => values.status === 'all' || post.status === values.status)
        .filter((post) => matchesQuery(post, debouncedQuery, SEARCH_FIELDS)),
    [posts, values.status, debouncedQuery],
  )

  const toggleStatus = (post) => {
    const next = post.status === 'published' ? 'draft' : 'published'
    patchItem('posts', post.id, {
      status: next,
      // Publishing something that was never dated would leave the article header blank.
      publishedAt: post.publishedAt || todayIso(),
    })
    toast.success(
      next === 'published'
        ? `“${post.title}” is now published.`
        : `“${post.title}” is back to draft and hidden from the public blog.`,
    )
  }

  const requestDelete = async (post) => {
    const confirmed = await confirm({
      title: `Delete “${post.title}”?`,
      message:
        'This removes the article and its body blocks and sources from your local copy of the content. It cannot be undone from here.',
      confirmLabel: 'Delete article',
    })
    if (!confirmed) return

    removeItem('posts', post.id)
    toast.success('Article deleted.')
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (post) => (
        <div className="min-w-0">
          <p className="font-medium">{post.title || 'Untitled article'}</p>
          <p className="mt-0.5 truncate font-mono text-xs text-muted">/blog/{post.slug}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (post) => (
        <span className="text-muted">{post.category ? categoryName(post.category) : '—'}</span>
      ),
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
          <p>{formatDateShort(post.publishedAt) || '—'}</p>
          <p className="text-xs">
            {post.body?.length ? `~${readingMinutes(post)} min read` : 'No body yet'}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'sm:w-px sm:whitespace-nowrap',
      render: (post) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" to={`/admin/posts/${post.id}`}>
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
              {post.status === 'published'
                ? `Unpublish ${post.title}`
                : `Publish ${post.title}`}
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
      title="Writing"
      description="Articles for the blog. Drafts are stored alongside published articles and are hidden from the public pages."
      actions={
        <Button to="/admin/posts/new" size="sm">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New article
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <SearchInput
          id="posts-search"
          label="Search articles"
          value={values.query}
          onChange={(value) => setValue('query', value)}
          placeholder="Title, excerpt, slug or tag…"
        />
        <Field
          id="posts-status"
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
        {visible.length} of {posts.length} {posts.length === 1 ? 'article' : 'articles'} shown.
      </p>

      <div className="mt-4">
        <DataTable
          caption="Articles, with their category, status and publication date"
          columns={columns}
          rows={visible}
          empty={
            posts.length === 0 ? (
              <EmptyState
                title="No articles yet"
                message="The public blog is showing its empty-state message. Add a real article when there is one to publish — placeholder posts are worse than an empty section."
                action={<Button to="/admin/posts/new">Write the first one</Button>}
              />
            ) : (
              <EmptyState
                title="No articles match"
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
