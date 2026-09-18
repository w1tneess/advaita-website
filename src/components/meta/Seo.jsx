import { buildMeta, generateJsonLd, TWITTER_HANDLE } from '@/lib/seo.js'
import { SITE_NAME } from '@/config/site.js'

/**
 * Per-page document metadata.
 *
 * React 19 hoists <title>, <meta> and <link> to <head> from anywhere in the tree, so
 * this needs no helmet dependency.
 *
 * These tags are what a browser and a JavaScript-executing crawler see. Crawlers that
 * do not run JavaScript read the pre-rendered tags that scripts/prerender.js bakes into
 * each route's index.html — both use buildMeta() and generateJsonLd(), so they agree.
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
    { title, description, path, image, type, noindex, publishedAt, updatedAt },
    import.meta.env.BASE_URL,
  )
  const jsonLd = generateJsonLd(meta)

  return (
    <>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.canonical} />

      {meta.noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta
            name="robots"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
          <meta
            name="googlebot"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
          <meta
            name="bingbot"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />
        </>
      )}

      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.canonical} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:alt" content={meta.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {meta.publishedAt && <meta property="article:published_time" content={meta.publishedAt} />}
      {meta.publishedAt && <meta property="article:author" content="https://advaitachandra.in/#person" />}
      {meta.updatedAt && <meta property="article:modified_time" content={meta.updatedAt} />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
