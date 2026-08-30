import { buildMeta } from '@/lib/seo.js'

/**
 * Per-page document metadata.
 *
 * React 19 hoists <title>, <meta> and <link> to <head> from anywhere in the tree, so
 * this needs no helmet dependency.
 *
 * These tags are what a browser and a JavaScript-executing crawler see. Crawlers that
 * do not run JavaScript read the pre-rendered tags that scripts/prerender.js bakes into
 * each route's index.html — both come from buildMeta(), so they agree.
 */
export default function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  publishedAt,
  updatedAt,
}) {
  const meta = buildMeta(
    { title, description, path, image, type, noindex },
    import.meta.env.BASE_URL,
  )

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />

      <meta property="og:type" content={meta.type} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={meta.image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {updatedAt && <meta property="article:modified_time" content={updatedAt} />}

      {meta.noindex && <meta name="robots" content="noindex, nofollow" />}
    </>
  )
}
