import AdminPage from '../../components/admin/AdminPage.jsx'
import Field from '../../components/admin/Field.jsx'
import Button from '../../components/Button.jsx'
import Callout from '../../components/Callout.jsx'
import { useContent } from '../../lib/content.jsx'
import { useSectionForm } from '../../hooks/useSectionForm.js'
import { validateSettings } from '../../lib/schema.js'

/**
 * Website configuration.
 *
 * Not much here — theme, accent colours, feature toggles, limits and messages. The
 * defaults are set by seed.js; this section is for tweaking the demo behavior only.
 */
export default function SettingsEditor() {
  const { settings } = useContent()

  const { draft, errors, dirty, submit, revert, set, setNested } = useSectionForm(
    'settings',
    settings,
    validateSettings,
  )

  return (
    <AdminPage
      title="Website settings"
      description="Tweaks the demo site. Changes live in this browser and persist to localStorage."
      actions={
        dirty && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted">Unsaved</span>
            <button
              type="button"
              onClick={revert}
              className="text-xs text-danger underline hover:text-danger/80"
            >
              Revert
            </button>
          </div>
        )
      }
    >
      <Callout variant="analysis" title="These settings are front-end only">
        Everything here is a client-side tweak. The real site will be deployed from the
        exported seed document. Save → Export → Commit → Rebuild is the publish path. Nothing
        here writes to a backend or persists beyond this browser.
      </Callout>

      <form onSubmit={submit} noValidate className="mt-8 space-y-8">
        {/* Theme */}
        <section aria-labelledby="settings-theme-heading">
          <h2 id="settings-theme-heading" className="text-xl font-semibold tracking-tight">
            Theme
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            The default theme is "system". Choose "light" or "dark" to override it.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              id="settings-default-theme"
              label="Default theme"
              type="select"
              value={draft.defaultTheme ?? ''}
              onChange={(value) => set("defaultTheme", value)}
              options={[{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
              error={errors.defaultTheme}
              required
            />
          </div>
        </section>

        {/* Accent colours */}
        <section aria-labelledby="settings-accent-heading" className="mt-12">
          <h2 id="settings-accent-heading" className="text-xl font-semibold tracking-tight">
            Accent colours
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            A single accent drives the design system. Provide a hex colour for light and/or dark.
          </p>
          <div className="mt-5 space-y-5">
            <Field
              id="settings-accent-light"
              label="Light theme accent"
              type="text"
              value={draft.accent?.light ?? ''}
              onChange={value => setNested('accent', 'light', value)}
              error={errors['accent.light']}
              placeholder="#0f6b73"
              hint="Hex colour for buttons, links and UI highlights in light mode. Leave blank for default."
              limit={20}
            />
            <Field
              id="settings-accent-dark"
              label="Dark theme accent"
              type="text"
              value={draft.accent?.dark ?? ''}
              onChange={value => setNested('accent', 'dark', value)}
              error={errors['accent.dark']}
              placeholder="#5fbdc9"
              hint="Hex colour for buttons, links and UI highlights in dark mode. Leave blank for default."
              limit={20}
            />
          </div>
        </section>

        {/* Limits */}
        <section aria-labelledby="settings-limits-heading" className="mt-12">
          <h2 id="settings-limits-heading" className="text-xl font-semibold tracking-tight">
            Limits
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Upper bounds for display items, reading time and pagination. These are only for the
            demo admin panel; the deployed site can have different values.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              id="settings-featured-project-limit"
              label="Featured projects on home"
              type="number"
              value={draft.featuredProjectLimit ?? ''}
              onChange={value => set("featuredProjectLimit", value)}
              error={errors.featuredProjectLimit}
              min={1}
              max={50}
              required
              hint="How many featured projects appear on the homepage."
            />
            <Field
              id="settings-latest-posts-limit"
              label="Latest posts on home"
              type="number"
              value={draft.latestPostsLimit ?? ''}
              onChange={value => set("latestPostsLimit", value)}
              error={errors.latestPostsLimit}
              min={1}
              max={50}
              required
              hint="How many recent blog posts appear on the homepage."
            />
            <Field
              id="settings-posts-per-page"
              label="Posts per blog page"
              type="number"
              value={draft.postsPerPage ?? ''}
              onChange={value => set("postsPerPage", value)}
              error={errors.postsPerPage}
              min={1}
              max={50}
              required
              hint="Number of articles shown per page in the blog section."
            />
          </div>
        </section>

        {/* Feature toggles */}
        <section aria-labelledby="settings-toggles-heading" className="mt-12">
          <h2 id="settings-toggles-heading" className="text-xl font-semibold tracking-tight">
            Feature toggles
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Turn individual features on or off in the demo. These don’t affect the deployed
            site unless you also export and commit the settings.
          </p>
          <div className="mt-5 space-y-4">
            <Field
              id="settings-enable-analytics"
              label="Enable analytics"
              type="checkbox"
              value={draft.enableAnalytics ?? false}
              onChange={value => set("enableAnalytics", value)}
              hint="Show analytics snippet. Useful for demos but not for production."
            />
            <Field
              id="settings-enable-comments"
              label="Enable comments"
              type="checkbox"
              value={draft.enableComments ?? false}
              onChange={value => set("enableComments", value)}
              hint="Show comment widget. Not a real backend here — this is demo-only."
            />
          </div>
        </section>

        {/* Messages */}
        <section aria-labelledby="settings-messages-heading" className="mt-12">
          <h2 id="settings-messages-heading" className="text-xl font-semibold tracking-tight">
            Messages
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            User-facing text that changes per deployment or locale. These are only demo values.
          </p>
          <div className="mt-5 space-y-5">
            <Field
              id="settings-blog-empty-state"
              label="Blog empty state"
              type="textarea"
              rows={2}
              value={draft.blogEmptyState ?? ''}
              onChange={value => set("blogEmptyState", value)}
              error={errors.blogEmptyState}
              required
              limit={200}
              hint="Shown on the blog page when there are no articles. The default message is set separately."
            />
            <Field
              id="settings-footer-note"
              label="Footer note"
              type="textarea"
              rows={2}
              value={draft.footerNote ?? ''}
              onChange={value => set("footerNote", value)}
              limit={120}
              hint="Optional line that appears in the footer. Use for credits or legal text."
            />
            <div className="mt-4">
              <p className="text-sm font-medium">Contact strings (placeholders only)</p>
              <p className="mt-1 text-xs text-foreground-muted">These appear in the footer contact section. All are placeholders — no real email or handle.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field
                  id="settings-contact-email"
                  label="Email"
                  value={draft.contact?.email ?? ''}
                  onChange={value => setNested('contact', 'email', value)}
                  placeholder="example@domain.com"
                  hint="Shown as a mailto: link. Not used for real mail."
                />
                <Field
                  id="settings-contact-github"
                  label="GitHub"
                  value={draft.contact?.github ?? ''}
                  onChange={value => setNested('contact', 'github', value)}
                  placeholder="/username"
                  hint="Link to a GitHub profile. No verification."
                />
                <Field
                  id="settings-contact-linkedin"
                  label="LinkedIn"
                  value={draft.contact?.linkedin ?? ''}
                  onChange={value => setNested('contact', 'linkedin', value)}
                  placeholder="/in/username"
                  hint="Link to a LinkedIn profile. No verification."
                />
                <Field
                  id="settings-contact-x"
                  label="X (formerly Twitter)"
                  value={draft.contact?.x ?? ''}
                  onChange={value => setNested('contact', 'x', value)}
                  placeholder="@handle"
                  hint="Link to an X/Twitter profile. No verification."
                />
              </div>
            </div>
          </div>
        </section>

        <div className="sticky bottom-0 mt-8 flex flex-wrap items-center gap-3 border-t border-border bg-base/90 py-4 backdrop-blur-sm">
          <Button type="submit" disabled={!dirty}>Save settings</Button>
          <Button type="button" variant="ghost" onClick={revert} disabled={!dirty}>Discard changes</Button>
        </div>
      </form>
    </AdminPage>
  )
}
