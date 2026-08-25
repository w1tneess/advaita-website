import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AdminPage from '../../components/admin/AdminPage.jsx'
import Field, { CheckboxGroup, ListField } from '../../components/admin/Field.jsx'
import { PairList, TextList } from '../../components/admin/RepeatableFields.jsx'
import Toggle from '../../components/admin/Toggle.jsx'
import Button from '../../components/Button.jsx'
import Callout from '../../components/Callout.jsx'
import Card from '../../components/Card.jsx'
import { useContent } from '../../lib/content.jsx'
import {
  PROJECT_STATUSES,
  createProject,
  hasErrors,
  slugify,
  validateProject,
} from '../../lib/schema.js'
import { useToast } from '../../lib/toast.jsx'

/**
 * Create or edit one project.
 *
 * The fields are deliberately ordered so that "what is this" comes before "how was it done"
 * and "what does it not show" comes last but is not optional in practice: the limitations
 * list is the part that keeps a portfolio entry honest, so it is a first-class field rather
 * than a footnote.
 */
export default function ProjectEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { projects, projectCategories, upsertItem } = useContent()

  const isNew = id === 'new'
  const existing = projects.find((project) => project.id === id) ?? null

  const [draft, setDraft] = useState(() => (isNew ? createProject() : existing ? { ...existing } : null))
  const [errors, setErrors] = useState({})
  // Once the slug has been edited by hand, stop deriving it from the title.
  const [slugLocked, setSlugLocked] = useState(!isNew)

  if (draft === null) {
    return (
      <AdminPage
        title="Project not found"
        description="There is no project with that id in the current content document. It may have been deleted, or the demo data may have been reset."
      >
        <Button to="/admin/projects" variant="secondary">
          Back to projects
        </Button>
      </AdminPage>
    )
  }

  const set = (key, value) => setDraft((current) => ({ ...current, [key]: value }))

  const setLink = (key, value) =>
    setDraft((current) => ({
      ...current,
      links: { ...current.links, [key]: value.trim() === '' ? null : value.trim() },
    }))

  const onTitleChange = (value) => {
    setDraft((current) => ({
      ...current,
      title: value,
      slug: slugLocked ? current.slug : slugify(value),
    }))
  }

  const submit = (event) => {
    event.preventDefault()
    const found = validateProject(draft, projects)
    setErrors(found)

    if (hasErrors(found)) {
      toast.error('Nothing was saved — check the highlighted fields.')
      return
    }

    upsertItem('projects', draft)
    toast.success(`“${draft.title}” ${isNew ? 'created' : 'saved'} in this browser.`)
    navigate('/admin/projects')
  }

  const categoryOptions = projectCategories.map((category) => ({
    value: category.slug,
    label: category.name,
  }))

  const statusHint = PROJECT_STATUSES.find((status) => status.value === draft.status)?.description

  return (
    <AdminPage
      title={isNew ? 'New project' : 'Edit project'}
      description={
        isNew
          ? 'Add a project to the portfolio page.'
          : 'Changes take effect on the public pages in this browser as soon as they are saved.'
      }
      actions={
        <Button to="/admin/projects" variant="secondary" size="sm">
          Back to projects
        </Button>
      }
    >
      <form onSubmit={submit} noValidate>
        <Card className="p-6">
          <h2 className="text-base font-semibold">What it is</h2>

          <Field
            className="mt-5"
            id="project-title"
            label="Title"
            value={draft.title}
            onChange={onTitleChange}
            error={errors.title}
            required
            limit={120}
          />

          <Field
            className="mt-5"
            id="project-slug"
            label="Slug"
            value={draft.slug}
            onChange={(value) => {
              setSlugLocked(true)
              set('slug', slugify(value))
            }}
            error={errors.slug}
            required
            hint="Used in the anchor link to this project, e.g. /portfolio#project-your-slug. Lowercase letters, numbers and hyphens."
          />

          <CheckboxGroup
            className="mt-6"
            id="project-categories"
            label="Categories"
            options={categoryOptions}
            values={draft.categories ?? []}
            onChange={(value) => set('categories', value)}
            error={errors.categories}
            required
            hint="These drive the portfolio filters. Pick every one that genuinely applies."
          />

          <Field
            className="mt-6"
            id="project-summary"
            label="Summary"
            type="textarea"
            rows={3}
            value={draft.summary}
            onChange={(value) => set('summary', value)}
            error={errors.summary}
            required
            limit={260}
            hint="One or two sentences. This is what appears on the home page card."
          />

          <Field
            className="mt-5"
            id="project-description"
            label="Description"
            type="textarea"
            rows={7}
            value={draft.description}
            onChange={(value) => set('description', value)}
            error={errors.description}
            required
            hint="The fuller account shown on the portfolio page. Describe what was done, not what it proves."
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="project-date"
              label="Date"
              type="date"
              value={draft.projectDate ?? ''}
              onChange={(value) => set('projectDate', value)}
              error={errors.projectDate}
            />
            <Field
              id="project-cover-image"
              label="Cover image URL"
              type="url"
              value={draft.coverImage ?? ''}
              onChange={(value) => set('coverImage', value)}
              error={errors.coverImage}
              hint="Use an image URL from your deployed public assets."
            />
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Role, tools and status</h2>

          <Field
            className="mt-5"
            id="project-role"
            label="Role"
            value={draft.role}
            onChange={(value) => set('role', value)}
            error={errors.role}
            required
            hint="What was actually done, and by whom. Say “sole researcher” rather than implying a team."
          />

          <ListField
            className="mt-5"
            id="project-tools"
            label="Tools"
            values={draft.tools ?? []}
            onChange={(value) => set('tools', value)}
            placeholder="Python, matplotlib"
          />

          <Field
            className="mt-5"
            id="project-status"
            label="Status"
            type="select"
            value={draft.status}
            onChange={(value) => set('status', value)}
            options={PROJECT_STATUSES.map((status) => ({
              value: status.value,
              label: status.label,
            }))}
            error={errors.status}
            hint={statusHint}
          />

          <Field
            className="mt-5"
            id="project-visibility"
            label="Availability note"
            value={draft.visibility ?? ''}
            onChange={(value) => set('visibility', value)}
            hint="Whether the work can be seen — for example “Personal project, not publicly released”. Leave blank if there is nothing to say."
          />

          <div className="mt-6 space-y-4 border-t border-border pt-5">
            <Toggle
              id="project-published"
              label="Show on the public portfolio"
              description="Turn this off to keep the project in the content document without displaying it."
              checked={draft.published !== false}
              onChange={(value) => set('published', value)}
            />
            <Toggle
              id="project-featured"
              label="Feature on the home page"
              description="Featured projects appear in the selected-work section, up to the limit set in Settings."
              checked={Boolean(draft.featured)}
              onChange={(value) => set('featured', value)}
            />
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Methodology</h2>
          <p className="mt-1.5 text-sm text-foreground-muted">
            The steps actually taken, in order. For a concept-stage design, these are the parts
            of the design rather than work that has been carried out.
          </p>

          <PairList
            id="project-methodology"
            legend="Methodology steps"
            rows={draft.methodology ?? []}
            onChange={(value) => set('methodology', value)}
            rowLabel="Step"
            addLabel="Add step"
          />
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Limitations</h2>

          <Callout variant="limitation" title="This is the field that keeps the entry honest" className="mt-4">
            State what the work does not show: gaps in the data, questions it cannot answer,
            things that are designed but not built. If a project has no working code, say so
            here as well as in the status. Do not record a conclusion, a statistic or a result
            that was not actually produced.
          </Callout>

          <TextList
            id="project-limitations"
            legend="Stated limitations"
            values={draft.limitations ?? []}
            onChange={(value) => set('limitations', value)}
            rowLabel="Limitation"
            rows={3}
            addLabel="Add limitation"
          />
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Links</h2>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Leave a field blank if there is nothing to link. A blank field renders as nothing at
            all — it never renders as a broken or placeholder link.
          </p>

          <div className="mt-5 space-y-5">
            <Field
              id="project-link-repository"
              label="Repository"
              type="url"
              value={draft.links?.repository ?? ''}
              onChange={(value) => setLink('repository', value)}
              error={errors['links.repository']}
              placeholder="https://github.com/your-username/your-repo"
            />
            <Field
              id="project-link-live"
              label="Live version"
              type="url"
              value={draft.links?.live ?? ''}
              onChange={(value) => setLink('live', value)}
              error={errors['links.live']}
              hint="Only fill this in if something is genuinely deployed and reachable."
            />
            <Field
              id="project-link-writeup"
              label="Write-up"
              type="url"
              value={draft.links?.writeup ?? ''}
              onChange={(value) => setLink('writeup', value)}
              error={errors['links.writeup']}
              hint="A public article or document about the project, if one exists."
            />
          </div>
        </Card>

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-border bg-canvas/90 py-4 backdrop-blur-sm">
          <Button type="submit">{isNew ? 'Create project' : 'Save project'}</Button>
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
            Cancel
          </Button>
        </div>
      </form>
    </AdminPage>
  )
}
