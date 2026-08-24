import AdminPage from '../../components/admin/AdminPage.jsx'
import CollectionEditor from '../../components/admin/CollectionEditor.jsx'
import Field, { ListField } from '../../components/admin/Field.jsx'
import { PairList } from '../../components/admin/RepeatableFields.jsx'
import Button from '../../components/Button.jsx'
import Callout from '../../components/Callout.jsx'
import Card from '../../components/Card.jsx'
import Icon, { ICON_NAMES } from '../../components/Icon.jsx'
import { useSectionForm } from '../../hooks/useSectionForm.js'
import { useContent } from '../../lib/content.jsx'
import { createInterest, validateInterest, validateProfile } from '../../lib/schema.js'

/**
 * Profile and research interests.
 *
 * Interests live here rather than on a page of their own because they are read as part of
 * "who this person is" — the home page and the about page render them straight after the
 * bio, and editing them in the same place as the bio is how they stay consistent.
 */
export default function ProfileEditor() {
  const { profile, interests } = useContent()
  const { draft, set, errors, dirty, submit, revert } = useSectionForm(
    'profile',
    profile,
    validateProfile,
  )

  const iconOptions = ICON_NAMES.map((name) => ({ value: name, label: name }))

  return (
    <AdminPage
      title="Profile & interests"
      description="The identity used across the site: name, tagline, biography, approach, and the research interests shown on the home and about pages."
    >
      <Callout variant="limitation" title="Keep private details out of these fields">
        This is a public website. Do not enter a date of birth, an age, a school or
        institution name, an exact address, a district or town, a phone number, exam results
        or anything else you would not put on a public page. The location field is meant to
        stay at state level.
      </Callout>

      <form onSubmit={submit} noValidate className="mt-8">
        <Card className="p-6">
          <h2 className="text-base font-semibold">Identity</h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="profile-name"
              label="Display name"
              value={draft.name}
              onChange={(value) => set('name', value)}
              error={errors.name}
              required
              limit={80}
              hint="Shown in the header, page titles and footer."
            />
            <Field
              id="profile-short-name"
              label="Short name"
              value={draft.shortName}
              onChange={(value) => set('shortName', value)}
              error={errors.shortName}
              required
              limit={40}
              hint="Used in running prose, e.g. “I'm Advaita”."
            />
          </div>

          <Field
            className="mt-5"
            id="profile-tagline"
            label="Tagline"
            value={draft.tagline}
            onChange={(value) => set('tagline', value)}
            error={errors.tagline}
            required
            limit={120}
          />

          <Field
            className="mt-5"
            id="profile-location"
            label="Location"
            value={draft.location}
            onChange={(value) => set('location', value)}
            error={errors.location}
            required
            limit={60}
            hint="State and country only. Do not narrow this to a city, district or neighbourhood."
          />

          <ListField
            className="mt-5"
            id="profile-roles"
            label="Roles"
            values={draft.roles ?? []}
            onChange={(value) => set('roles', value)}
            hint="Separate with commas. Describe what is actually being done — avoid “expert”, “specialist” or any title that has not been earned."
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              id="profile-photo"
              label="Profile photo URL"
              type="url"
              value={draft.photo ?? ''}
              onChange={(value) => set('photo', value.trim() === '' ? null : value)}
              hint="Leave blank to show initials instead. A photograph is optional and is a privacy decision, not a design one."
            />
            <Field
              id="profile-photo-alt"
              label="Photo alt text"
              value={draft.photoAlt ?? ''}
              onChange={(value) => set('photoAlt', value)}
              hint="Describe the image for anyone who cannot see it."
            />
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Biography and framing</h2>

          <Field
            className="mt-5"
            id="profile-bio"
            label="Short biography"
            type="textarea"
            rows={5}
            value={draft.bio}
            onChange={(value) => set('bio', value)}
            error={errors.bio}
            required
            hint="Appears at the top of the about page."
          />

          <Field
            className="mt-5"
            id="profile-learning-direction"
            label="Current learning direction"
            type="textarea"
            rows={4}
            value={draft.learningDirection ?? ''}
            onChange={(value) => set('learningDirection', value)}
            hint="What is being worked on now. Present tense, and specific enough to be checkable."
          />

          <Field
            className="mt-5"
            id="profile-epistemic-note"
            label="Note on labelled claims"
            type="textarea"
            rows={3}
            value={draft.epistemicNote ?? ''}
            onChange={(value) => set('epistemicNote', value)}
            hint="Explains the sourced fact / analysis / opinion / limitation labels to a first-time reader."
          />
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Approach</h2>
          <p className="mt-1.5 text-sm text-muted">
            The numbered method shown on the about page. The site ships with four steps.
          </p>

          <PairList
            id="profile-approach"
            legend="Approach steps"
            hint="Each step gets a short title and an explanation of what it means in practice."
            rows={draft.approach ?? []}
            onChange={(value) => set('approach', value)}
            rowLabel="Step"
            minRows={1}
            addLabel="Add step"
          />
        </Card>

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-line bg-canvas/90 py-4 backdrop-blur-sm">
          <Button type="submit" disabled={!dirty}>
            Save profile
          </Button>
          <Button type="button" variant="ghost" onClick={revert} disabled={!dirty}>
            Discard changes
          </Button>
          <p className="text-xs text-muted" aria-live="polite">
            {dirty ? 'Unsaved changes.' : 'No unsaved changes.'}
          </p>
        </div>
      </form>

      <section aria-labelledby="interests-heading" className="mt-12">
        <h2 id="interests-heading" className="text-xl font-semibold tracking-tight">
          Research interests
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Long-running interests, not areas of expertise. The one-line note under each is
          what stops the list reading as a claim of competence — keep it honest about how far
          the interest has actually gone.
        </p>

        <CollectionEditor
          className="mt-6"
          path="interests"
          items={interests}
          create={createInterest}
          validate={validateInterest}
          singular="interest"
          labelFor={(item) => item.name}
          emptyMessage="No interests yet. The home page and about page sections will be empty until one is added."
          summary={(item) => (
            <div className="flex items-start gap-3">
              <Icon name={item.icon} className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                {item.note && <p className="mt-0.5 text-sm text-muted">{item.note}</p>}
              </div>
            </div>
          )}
          fields={({ draft: item, set: setItem, errors: itemErrors }) => (
            <>
              <Field
                id="interest-name"
                label="Name"
                value={item.name}
                onChange={(value) => setItem('name', value)}
                error={itemErrors.name}
                required
                limit={60}
              />
              <Field
                id="interest-icon"
                label="Icon"
                type="select"
                value={item.icon}
                onChange={(value) => setItem('icon', value)}
                options={iconOptions}
                hint="Icons come from a fixed list. To add one, register it in src/components/Icon.jsx."
              />
              <Field
                id="interest-note"
                label="Note"
                type="textarea"
                rows={3}
                value={item.note}
                onChange={(value) => setItem('note', value)}
                error={itemErrors.note}
                limit={220}
                hint="One sentence on what the interest actually consists of."
              />
            </>
          )}
        />
      </section>
    </AdminPage>
  )
}
