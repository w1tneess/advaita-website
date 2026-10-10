import AdminPage from '../../components/admin/AdminPage.jsx'
import CollectionEditor from '../../components/admin/CollectionEditor.jsx'
import Field from '../../components/admin/Field.jsx'
import Callout from '@/components/ui/Callout.jsx'
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
      title="Timeline &amp; Milestones"
      description="Milestones and learning periods displayed on the About page."
    >
      <Callout variant="limitation" title="Privacy Tip">
        Use general period labels such as "2024–2025", "Summer 2025", or "College studies" to keep personal details private while charting your trajectory.
      </Callout>

      <CollectionEditor
        className="mt-8"
        path="timeline"
        items={timeline}
        create={createTimelineItem}
        validate={validateTimelineItem}
        singular="milestone"
        addLabel="Add milestone"
        labelFor={(item) => item.title}
        emptyMessage="No timeline entries yet. The timeline section on the About page will be empty."
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
