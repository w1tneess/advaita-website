import AdminPage from '../../components/admin/AdminPage.jsx'
import CollectionEditor from '../../components/admin/CollectionEditor.jsx'
import Field from '../../components/admin/Field.jsx'
import Callout from '@/components/ui/Callout.jsx'
import { useContent } from '../../lib/content.jsx'
import { createCategory, slugify, validateCategory } from '../../lib/schema.js'

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
  const { projectCategories } = useContent()

  return (
    <AdminPage title="Project Categories" description="Categories used to organize and filter your projects on the website.">
      <Callout variant="limitation" title="Category Web Slugs">
        Changing a category's display name updates it across your site immediately. If you change the URL slug, be sure to check that existing projects using the old slug are updated as well.
      </Callout>

      <section aria-labelledby="project-categories-heading" className="mt-12">
        <h2 id="project-categories-heading" className="text-xl font-semibold tracking-tight">
          Project Categories
        </h2>
        <p className="mt-2 text-sm text-muted">
          Categories assigned to projects appear as filter buttons on the Projects page.
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
              <p className="mt-0.5 font-mono text-xs text-muted">{item.slug}</p>
              {item.description && <p className="mt-1.5 text-sm text-muted">{item.description}</p>}
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
    </AdminPage>
  )
}
