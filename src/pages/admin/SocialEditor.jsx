import AdminPage from '../../components/admin/AdminPage.jsx'
import CollectionEditor from '../../components/admin/CollectionEditor.jsx'
import Field from '../../components/admin/Field.jsx'
import Callout from '../../components/Callout.jsx'
import { useContent } from '../../lib/content.jsx'
import { createSocialLink, validateSocialLink, SOCIAL_KINDS } from '../../lib/schema.js'

/**
 * Links: email, GitHub, LinkedIn, etc.
 *
 * These are placeholders — no real handles or URLs. The social-icons asset contains
 * shapes for common platforms but is never filled with real credentials.
 */
export default function SocialEditor() {
  const { socialLinks } = useContent()

  return (
    <AdminPage
      title="Social links"
      description="Placeholder URLs and handles — the privacy rules apply. No real credentials here."
    >
      <Callout variant="limitation" title="No real handles">
        These are demonstration links only. Do not enter real email addresses, GitHub tokens, or any
        private information. All social fields are placeholders meant to show the pattern, not to be
        used for actual outreach or identification. The privacy rules on the Profile page apply here
        as well.
      </Callout>

      <CollectionEditor
        className="mt-8"
        path="social"
        items={socialLinks}
        create={createSocialLink}
        validate={validateSocialLink}
        singular="social link"
        addLabel="Add social link"
        labelFor={(item) => item.label}
        emptyMessage="No social links yet. The footer will show an empty section."
        summary={(item) => (
          <div className="min-w-0">
            <p className="font-medium">{item.label}</p>
            <p className="mt-1 text-xs text-muted">{item.platform}</p>
            <p className="mt-1 text-sm text-muted">
              {item.kind === 'email' ? 'Email link' : 'Link'} — {item.url ? item.url : '(no URL)'}
              {item.handle ? ` @${item.handle}` : ''}
            </p>
            {item.placeholder && <p className="mt-1.5 text-sm text-muted">{item.placeholder}</p>}
          </div>
        )}
        fields={({ draft, set, errors }) => (
          <>
            <Field
              id="social-label"
              label="Label"
              value={draft.label}
              onChange={(value) => set('label', value)}
              error={errors.label}
              required
              limit={40}
            />
            <Field
              id="social-platform"
              label="Platform"
              value={draft.platform}
              onChange={(value) => set('platform', value)}
              error={errors.platform}
              required
              limit={40}
              hint='E.g. "GitHub", "LinkedIn", "X", "email"'
            />
            <Field
              id="social-kind"
              label="Type"
              type="select"
              value={draft.kind}
              onChange={(value) => set('kind', value)}
              options={SOCIAL_KINDS.map((kind) => ({ value: kind.value, label: kind.label }))}
              hint={SOCIAL_KINDS.find((kind) => kind.value === draft.kind)?.description}
            />
            <Field
              id="social-url"
              label="URL"
              type="url"
              value={draft.url ?? ''}
              onChange={(value) => set('url', value)}
              error={errors.url}
              hint="Leave blank for email (the href becomes mailto:)"
            />
            <Field
              id="social-handle"
              label="Handle"
              value={draft.handle ?? ''}
              onChange={(value) => set('handle', value)}
              limit={30}
              hint='E.g. "@username" for X or "/username" for GitHub'
            />
            <Field
              id="social-placeholder"
              label="Placeholder text"
              type="textarea"
              rows={2}
              value={draft.placeholder ?? ''}
              onChange={(value) => set('placeholder', value)}
              limit={80}
              hint="Shown on hover. Helps users understand what this link represents."
            />
            <div className="flex items-center gap-3 mt-4">
              <Field
                id="social-visible"
                label="Show in footer"
                type="checkbox"
                value={draft.visible !== false}
                onChange={(value) => set('visible', value ? true : false)}
                hint="Toggle to hide this link from the public footer."
              />
            </div>
          </>
        )}
      />
    </AdminPage>
  )
}
