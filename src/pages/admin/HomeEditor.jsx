import AdminPage from '../../components/admin/AdminPage.jsx'
import Field from '../../components/admin/Field.jsx'
import { TextList } from '../../components/admin/RepeatableFields.jsx'
import Button from '../../components/Button.jsx'
import Callout from '../../components/Callout.jsx'
import Card from '../../components/Card.jsx'
import { useSectionForm } from '../../hooks/useSectionForm.js'
import { useContent } from '../../lib/content.jsx'
import { NAV_ITEMS } from '../../lib/routes.js'
import { validateHome } from '../../lib/schema.js'

/**
 * Home page copy.
 *
 * Every string the home page renders comes from here, including the credibility statement —
 * which is the one field on this site most likely to drift into overclaiming, so it is
 * edited beside a reminder of what it may and may not say.
 */

const DESTINATIONS = NAV_ITEMS.map((item) => ({ value: item.path, label: `${item.label} (${item.path})` }))

function CtaFields({ id, legend, cta, onChange, hint }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium">{legend}</legend>
      {hint && <p className="mt-1 text-xs text-foreground-muted">{hint}</p>}
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Field
          id={`${id}-label`}
          label="Button label"
          value={cta?.label ?? ''}
          onChange={(value) => onChange({ ...cta, label: value })}
          limit={40}
        />
        <Field
          id={`${id}-to`}
          label="Goes to"
          type="select"
          value={cta?.to ?? '/'}
          onChange={(value) => onChange({ ...cta, to: value })}
          options={DESTINATIONS}
        />
      </div>
    </fieldset>
  )
}

export default function HomeEditor() {
  const { home } = useContent()
  const { draft, set, errors, dirty, submit, revert } = useSectionForm('home', home, validateHome)

  return (
    <AdminPage
      title="Home page"
      description="The hero, the section headings and the credibility statement on the front page."
    >
      <form onSubmit={submit} noValidate>
        <Card className="p-6">
          <h2 className="text-base font-semibold">Hero</h2>

          <Field
            className="mt-5"
            id="home-hero-kicker"
            label="Kicker"
            value={draft.heroKicker ?? ''}
            onChange={(value) => set('heroKicker', value)}
            hint="The small line above the heading. Roles, separated by middots."
          />

          <Field
            className="mt-5"
            id="home-hero-heading"
            label="Heading"
            value={draft.heroHeading}
            onChange={(value) => set('heroHeading', value)}
            error={errors.heroHeading}
            required
            limit={120}
            hint="This is the page's only h1."
          />

          <Field
            className="mt-5"
            id="home-hero-intro"
            label="Introduction"
            type="textarea"
            rows={5}
            value={draft.heroIntro}
            onChange={(value) => set('heroIntro', value)}
            error={errors.heroIntro}
            required
            limit={700}
          />

          <div className="mt-6 space-y-6">
            <CtaFields
              id="home-primary-cta"
              legend="Primary button"
              cta={draft.primaryCta}
              onChange={(value) => set('primaryCta', value)}
            />
            <CtaFields
              id="home-secondary-cta"
              legend="Secondary button"
              cta={draft.secondaryCta}
              onChange={(value) => set('secondaryCta', value)}
              hint="Destinations are limited to the site's own pages, so a button can never point at a route that does not exist."
            />
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Section headings</h2>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Each block on the home page has a heading and a short introduction.
          </p>

          <div className="mt-5 space-y-6">
            {[
              { key: 'featured', label: 'Selected work' },
              { key: 'posts', label: 'Latest writing' },
              { key: 'interests', label: 'Research interests' },
            ].map((section) => (
              <div key={section.key} className="grid gap-4 sm:grid-cols-2">
                <Field
                  id={`home-${section.key}-heading`}
                  label={`${section.label} — heading`}
                  value={draft[`${section.key}Heading`] ?? ''}
                  onChange={(value) => set(`${section.key}Heading`, value)}
                />
                <Field
                  id={`home-${section.key}-intro`}
                  label={`${section.label} — introduction`}
                  type="textarea"
                  rows={2}
                  value={draft[`${section.key}Intro`] ?? ''}
                  onChange={(value) => set(`${section.key}Intro`, value)}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h2 className="text-base font-semibold">Credibility statement</h2>

          <Callout variant="limitation" title="What this field may contain" className="mt-4">
            Describe the work that exists and the method used on it. It must not claim an
            award, a publication, a qualification, a client, a number of readers, a statistic
            or a result that has not actually been produced. If a project is only a design,
            the statement has to say so.
          </Callout>

          <Field
            className="mt-5"
            id="home-credibility-heading"
            label="Heading"
            value={draft.credibilityHeading ?? ''}
            onChange={(value) => set('credibilityHeading', value)}
          />

          <Field
            className="mt-5"
            id="home-credibility-statement"
            label="Statement"
            type="textarea"
            rows={6}
            value={draft.credibilityStatement}
            onChange={(value) => set('credibilityStatement', value)}
            error={errors.credibilityStatement}
            required
            limit={900}
          />

          <TextList
            id="home-credibility-points"
            legend="Supporting points"
            hint="Short, checkable statements about how the work is done. One sentence each."
            values={draft.credibilityPoints ?? []}
            onChange={(value) => set('credibilityPoints', value)}
            rowLabel="Point"
            addLabel="Add point"
          />
        </Card>

        <div className="sticky bottom-0 mt-6 flex flex-wrap items-center gap-3 border-t border-border bg-canvas/90 py-4 backdrop-blur-sm">
          <Button type="submit" disabled={!dirty}>
            Save home page
          </Button>
          <Button type="button" variant="ghost" onClick={revert} disabled={!dirty}>
            Discard changes
          </Button>
          <p className="text-xs text-foreground-muted" aria-live="polite">
            {dirty ? 'Unsaved changes.' : 'No unsaved changes.'}
          </p>
        </div>
      </form>
    </AdminPage>
  )
}
