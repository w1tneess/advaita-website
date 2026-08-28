import Field from '../Field.jsx'

/**
 * Consolidated SEO metadata fields for content editors.
 *
 * Reusable across projects, posts, and other content types.
 * Includes title, description, and optional keywords.
 */

export default function SEOFields({
  seoTitle,
  setSeoTitle,
  seoDescription,
  setSeoDescription,
  keywords,
  setKeywords,
  showKeywords = false,
}) {
  const titleLength = seoTitle?.length || 0
  const descriptionLength = seoDescription?.length || 0

  return (
    <div className="space-y-4">
      <Field
        id="seoTitle"
        label="SEO Title"
        hint={`${titleLength}/60 characters (${titleLength > 60 ? 'too long' : 'good'})`}
        error={titleLength > 60 ? 'Title should be under 60 characters' : ''}
      >
        <input
          id="seoTitle"
          type="text"
          value={seoTitle || ''}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder="Page title for search results"
          maxLength={120}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </Field>

      <Field
        id="seoDescription"
        label="SEO Description"
        hint={`${descriptionLength}/160 characters (${descriptionLength > 160 ? 'too long' : 'good'})`}
        error={descriptionLength > 160 ? 'Description should be under 160 characters' : ''}
      >
        <textarea
          id="seoDescription"
          value={seoDescription || ''}
          onChange={(e) => setSeoDescription(e.target.value)}
          placeholder="Page description for search results"
          rows={2}
          maxLength={320}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </Field>

      {showKeywords && (
        <Field
          id="keywords"
          label="Keywords"
          hint="Comma-separated keywords (optional)"
        >
          <input
            id="keywords"
            type="text"
            value={keywords || ''}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g., react, portfolio, design"
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </Field>
      )}
    </div>
  )
}
