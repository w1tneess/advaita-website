import { useSaveShortcut } from '../../hooks/useSaveShortcut.js'
import AdminPage from '../../components/admin/AdminPage.jsx'
import Field from '../../components/admin/Field.jsx'
import Button from '@/components/ui/Button.jsx'
import Card from '@/components/ui/Card.jsx'
import { useSectionForm } from '../../hooks/useSectionForm.js'
import { useContent } from '../../lib/content.jsx'
import { validatePhilosophy } from '../../lib/schema.js'

export default function PhilosophyEditor() {
  const { philosophy } = useContent()
  const { draft, set, errors, dirty, submit, revert, isSubmitting } = useSectionForm(
    'philosophy',
    philosophy,
    validatePhilosophy
  )

  useSaveShortcut(submit)

  return (
    <AdminPage
      title="Philosophy page"
      description="The introductory text and configuration for the philosophy section."
    >
      <form onSubmit={submit} noValidate>
        <Card className="p-6">
          <h2 className="text-base font-semibold">Page Intro</h2>
          <p className="mt-1.5 text-sm text-muted">
            The main header text introducing the philosophy section.
          </p>

          <Field
            className="mt-5"
            id="philosophy-intro"
            label="Intro text"
            type="textarea"
            rows={3}
            value={draft.intro ?? ''}
            onChange={(value) => set('intro', value)}
            error={errors.intro}
            required
            limit={300}
            hint="The large pull quote style text at the top of the page."
          />

          <Field
            className="mt-5"
            id="philosophy-description"
            label="Description"
            type="textarea"
            rows={3}
            value={draft.description ?? ''}
            onChange={(value) => set('description', value)}
            error={errors.description}
            required
            limit={500}
            hint="Explanatory note under the main intro."
          />
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Notes Section</h2>
          <p className="mt-1.5 text-sm text-muted">
            The text introducing the reading notes at the bottom of the page.
          </p>

          <Field
            className="mt-5"
            id="philosophy-notes-intro"
            label="Notes intro"
            type="textarea"
            rows={2}
            value={draft.notesIntro ?? ''}
            onChange={(value) => set('notesIntro', value)}
            error={errors.notesIntro}
            limit={300}
          />

          <Field
            className="mt-5"
            id="philosophy-notes-description"
            label="Notes description"
            type="textarea"
            rows={3}
            value={draft.notesDescription ?? ''}
            onChange={(value) => set('notesDescription', value)}
            error={errors.notesDescription}
            limit={500}
          />
        </Card>

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-line bg-canvas/90 py-4 backdrop-blur-sm">
          <Button type="submit" disabled={!dirty || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save philosophy config'}
          </Button>
          <Button type="button" variant="ghost" onClick={revert} disabled={!dirty || isSubmitting}>
            Discard changes
          </Button>
          <p className="text-xs text-muted" aria-live="polite">
            {dirty ? 'Unsaved changes.' : 'No unsaved changes.'}
          </p>
        </div>
      </form>
    </AdminPage>
  )
}
