import AdminPage from '../../components/admin/AdminPage.jsx'
import CollectionEditor from '../../components/admin/CollectionEditor.jsx'
import Field from '../../components/admin/Field.jsx'
import Callout from '../../components/Callout.jsx'
import { useContent } from '../../lib/content.jsx'
import { SKILL_LEVELS, createSkill, validateSkill } from '../../lib/schema.js'

/**
 * Abilities.
 *
 * Two things are deliberate here. There are only two levels — "learning" and "working
 * knowledge" — because a five-point scale or a percentage bar would be a number nobody
 * measured. And every ability can point at the project that demonstrates it, so a claim on
 * the About page can be checked against something that exists.
 */
export default function SkillsEditor() {
  const { skills, projects } = useContent()

  const groups = [...new Set(skills.map((skill) => skill.group).filter(Boolean))]

  const evidenceOptions = [
    { value: '', label: 'No project demonstrates this yet' },
    ...projects.map((project) => ({ value: project.slug, label: project.title })),
  ]

  const projectTitle = (slug) => projects.find((project) => project.slug === slug)?.title ?? slug

  return (
    <AdminPage
      title="Abilities"
      description="What Advaita can currently do, grouped, with the project that shows it where one exists."
    >
      <Callout variant="limitation" title="Two levels, on purpose">
        “Learning” means exactly that, and is not a claim of competence. “Working knowledge”
        means the ability has been used in at least one real project. There is no third level
        and no percentage, because neither was ever measured — and an unmeasured number on a
        portfolio is just decoration.
      </Callout>

      <CollectionEditor
        className="mt-8"
        path="skills"
        items={skills}
        create={createSkill}
        validate={validateSkill}
        singular="ability"
        addLabel="Add ability"
        labelFor={(item) => item.name}
        emptyMessage="No abilities listed yet. The abilities section of the About page will be empty."
        summary={(item) => (
          <div className="min-w-0">
            <p className="text-xs tracking-wide text-muted uppercase">{item.group}</p>
            <p className="mt-1 font-medium">{item.name}</p>
            <p className="mt-1 text-sm text-muted">
              {SKILL_LEVELS.find((level) => level.value === item.level)?.label ?? item.level}
              {item.evidence ? ` · shown in ${projectTitle(item.evidence)}` : ' · no project yet'}
            </p>
            {item.note && <p className="mt-1.5 text-sm text-muted">{item.note}</p>}
          </div>
        )}
        fields={({ draft, set, errors }) => (
          <>
            <Field
              id="skill-name"
              label="Ability"
              value={draft.name}
              onChange={(value) => set('name', value)}
              error={errors.name}
              required
              limit={80}
            />

            <Field
              id="skill-group"
              label="Group"
              value={draft.group}
              onChange={(value) => set('group', value)}
              error={errors.group}
              required
              hint={
                groups.length > 0
                  ? `The heading this appears under on the About page. Existing groups: ${groups.join(', ')} — type one exactly to add to it, or a new name to start another group.`
                  : 'The heading this ability appears under on the About page.'
              }
            />

            <Field
              id="skill-level"
              label="Level"
              type="select"
              value={draft.level}
              onChange={(value) => set('level', value)}
              options={SKILL_LEVELS.map((level) => ({ value: level.value, label: level.label }))}
              error={errors.level}
              hint={SKILL_LEVELS.find((level) => level.value === draft.level)?.description}
            />

            <Field
              id="skill-evidence"
              label="Demonstrated by"
              type="select"
              value={draft.evidence ?? ''}
              onChange={(value) => set('evidence', value === '' ? null : value)}
              options={evidenceOptions}
              hint="Links the ability to a project on the portfolio page. Leave it unset rather than pointing at something loosely related."
            />

            <Field
              id="skill-note"
              label="Note"
              type="textarea"
              rows={2}
              value={draft.note ?? ''}
              onChange={(value) => set('note', value)}
              error={errors.note}
              limit={200}
              hint="What the ability means in practice, or what it does not yet extend to."
            />
          </>
        )}
      />
    </AdminPage>
  )
}
