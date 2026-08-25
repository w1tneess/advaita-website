import AdminPage from '../../components/admin/AdminPage.jsx'
import CollectionEditor from '../../components/admin/CollectionEditor.jsx'
import Field from '../../components/admin/Field.jsx'
import Callout from '../../components/Callout.jsx'
import { useContent } from '../../lib/content.jsx'
import { createTimelineItem, validateTimelineItem } from '../../lib/schema.js'

/**
 * Learning & career journey.
 *
 * Timeline entries show the direction Advaita is moving through learning and practice.
 * They are deliberately limited to three fields — period, title and detail — so that the
 * focus stays on what matters to a reader rather than turning every entry into a mini-form.
 */
export default function TimelineEditor() {
  const { timeline } = useContent()

  return (
    <AdminPage
      title="Learning direction"
      description="Milestones in Advita's ongoing learning and practice. No dates that reveal age or school — only period labels, titles and details."
    >
      <Callout variant="limitation" title="No age- or school-leak">
        Use period labels that don't reveal exact age: phrases like "2024–2025", "Q3 2025",
        "Summer 2025", "During masters study" or "First year of studies". Do not include
        exact months, days, or school names. The privacy note on the Profile page explains
        why this matters.
      </Callout>

      <CollectionEditor
        className="mt-8"
        path="timeline"
        items={timeline}
        create={createTimelineItem}
        validate={validateTimelineItem}
        singular="milestone"
        addLabel="Add learning milestone"
        labelFor={(item) => item.title}
        emptyMessage="No timeline entries yet. The learning direction section will be empty."
        summary={(item) => (
          <div className="min-w-0">
            <p className="text-xs tracking-wide text-muted uppercase">{item.period}</p>
            <p className="mt-1 font-medium">{item.title}</p>
            {item.detail && <p className="mt-1.5 text-sm text-muted">{item.detail}</p>}
          </div>
        )}
        fields={({ draft, set, errors }) => (
          <>
            <Field
              id="timeline-period"
              label="Period"
              value={draft.period}
              onChange={(value) => set('period', value)}
              error={errors.period}
              required
              limit={40}
              hint='E.g. "2024–2025", "Q3 2025", "Summer 2025", "During masters study".'
            />
            <Field
              id="timeline-title"
              label="Title"
              value={draft.title}
              onChange={(value) => set('title', value)}
              error={errors.title}
              required
              limit={120}
            />
            <Field
              id="timeline-detail"
              label="Detail"
              type="textarea"
              rows={3}
              value={draft.detail}
              onChange={(value) => set('detail', value)}
              error={errors.detail}
              limit={400}
              hint="Context, what was learned or practiced, why it mattered."
            />
          </>
        )}
      />
    </AdminPage>
  )
}
