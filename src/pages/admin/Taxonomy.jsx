import AdminPage from '../../components/admin/AdminPage.jsx'
import CollectionEditor from '../../components/admin/CollectionEditor.jsx'
import Field from '../../components/admin/Field.jsx'
import Callout from '../../components/Callout.jsx'
import { useContent } from '../../lib/content.jsx'
import {
  createCategory,
  createTag,
  slugify,
  validateCategory,
  validateTag,
} from '../../lib/schema.js'

/**
 * Categories and tags.
 *
 * Articles and projects reference these by slug, not by id. That keeps the JSON readable,
 * but it means renaming a slug does not follow the reference — hence the warning below,
 * which is a real consequence rather than boilerplate caution.
 */

function slugFields({ draft, set, errors }) {
  return (
    <>
      <Field
        id="taxonomy-name"
        label="Name"
        value={draft.name}
        onChange={(value) => {
          set('name', value)
          // Derive the slug only while it is still empty, so an existing slug is never
          // silently rewritten out from under the content that references it.
          if (!draft.slug) set('slug', slugify(value))
        }}
        error={errors.name}
        required
      />
      <Field
        id="taxonomy-slug"
        label="Slug"
        value={draft.slug}
        onChange={(value) => set('slug', slugify(value))}
        error={errors.slug}
        required
        hint="Lowercase letters, numbers and hyphens. This is the value stored on each article or project."
      />
    </>
  )
}

export default function Taxonomy() {
  const { blogCategories, projectCategories, tags } = useContent()

  return (
    <AdminPage
      title="Categories & tags"
      description="The vocabularies used by the blog filters and the portfolio filters."
    >
      <Callout variant="limitation" title="Renaming a slug does not update what points at it">
        Articles store their category slug and projects store their category slugs. If you
        change a slug here, anything that referenced the old value stops matching and will
        drop out of that filter. Change the display name freely; change a slug only if you are
        willing to update the articles or projects that use it.
      </Callout>

      <section aria-labelledby="blog-categories-heading" className="mt-10">
        <h2 id="blog-categories-heading" className="text-xl font-semibold tracking-tight">
          Article categories
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Every article has exactly one. These become the category filters on the blog page.
        </p>

        <CollectionEditor
          className="mt-6"
          path="categories.blog"
          items={blogCategories}
          create={createCategory}
          validate={validateCategory}
          singular="category"
          addLabel="Add article category"
          labelFor={(item) => item.name}
          emptyMessage="No article categories yet. Articles cannot be filed without one."
          summary={(item) => (
            <div className="min-w-0">
              <p className="font-medium">{item.name}</p>
              <p className="mt-0.5 font-mono text-xs text-foreground-muted">{item.slug}</p>
              {item.description && <p className="mt-1.5 text-sm text-foreground-muted">{item.description}</p>}
            </div>
          )}
          fields={({ draft, set, errors }) => (
            <>
              {slugFields({ draft, set, errors })}
              <Field
                id="taxonomy-description"
                label="Description"
                type="textarea"
                rows={2}
                value={draft.description ?? ''}
                onChange={(value) => set('description', value)}
                error={errors.description}
                limit={200}
                hint="Explains what belongs in the category. Shown on the blog page."
              />
            </>
          )}
        />
      </section>

      <section aria-labelledby="project-categories-heading" className="mt-12">
        <h2 id="project-categories-heading" className="text-xl font-semibold tracking-tight">
          Project categories
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">
          A project can have several. These become the filters on the portfolio page.
        </p>

        <CollectionEditor
          className="mt-6"
          path="categories.project"
          items={projectCategories}
          create={createCategory}
          validate={validateCategory}
          singular="category"
          addLabel="Add project category"
          labelFor={(item) => item.name}
          emptyMessage="No project categories yet. The portfolio filter bar will only offer “All”."
          summary={(item) => (
            <div className="min-w-0">
              <p className="font-medium">{item.name}</p>
              <p className="mt-0.5 font-mono text-xs text-foreground-muted">{item.slug}</p>
              {item.description && <p className="mt-1.5 text-sm text-foreground-muted">{item.description}</p>}
            </div>
          )}
          fields={({ draft, set, errors }) => (
            <>
              {slugFields({ draft, set, errors })}
              <Field
                id="taxonomy-description"
                label="Description"
                type="textarea"
                rows={2}
                value={draft.description ?? ''}
                onChange={(value) => set('description', value)}
                error={errors.description}
                limit={200}
              />
            </>
          )}
        />
      </section>

      <section aria-labelledby="tags-heading" className="mt-12">
        <h2 id="tags-heading" className="text-xl font-semibold tracking-tight">
          Tags
        </h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Cross-cutting labels for articles. A tag only appears on the public blog once a
          published article uses it, so an unused tag is invisible rather than misleading.
        </p>

        <CollectionEditor
          className="mt-6"
          path="tags"
          items={tags}
          create={createTag}
          validate={validateTag}
          singular="tag"
          addLabel="Add tag"
          labelFor={(item) => item.name}
          emptyMessage="No tags yet."
          summary={(item) => (
            <div className="min-w-0">
              <p className="font-medium">{item.name}</p>
              <p className="mt-0.5 font-mono text-xs text-foreground-muted">{item.slug}</p>
            </div>
          )}
          fields={({ draft, set, errors }) => slugFields({ draft, set, errors })}
        />
      </section>
    </AdminPage>
  )
}
