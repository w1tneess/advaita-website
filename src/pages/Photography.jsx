import { Camera } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import Container from '@/components/layout/Container.jsx'
import Lightbox from '@/components/ui/Lightbox.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { pageLoadVariant, staggerContainer, imageReveal, scrollViewport } from '@/lib/animations.js'
import { getOptimizedImageProps } from '@/lib/image.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'photography')

export default function Photography() {
  const { photography } = useContent()
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const photos = photography.photos || []

  const dynamicCategories = useMemo(() => {
    const slugs = new Set()
    const result = []

    photos.forEach((photo) => {
      if (photo.category) {
        const slug = photo.category.toLowerCase()
        if (!slugs.has(slug)) {
          slugs.add(slug)
          result.push({
            id: `dynamic-${slug}`,
            slug: photo.category,
            name: photo.category,
          })
        }
      }
    })
    return result
  }, [photos])

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? photos
        : photos.filter((photo) => photo.category === activeCategory),
    [photos, activeCategory],
  )

  const openLightbox = (photo) => {
    const idx = filtered.findIndex((p) => p.id === photo.id)
    setLightboxIndex(idx >= 0 ? idx : null)
  }

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/photography" />

      <Container>
        <motion.div
          className="py-12 sm:py-16 md:py-32"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          {/* Page header */}
          <header className="max-w-2xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Photography
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">{photography.intro}</p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
              {photography.description}
            </p>
          </header>

          {/* Category filters */}
          <nav aria-label="Photo categories" className="mt-10">
            <ul className="flex flex-wrap gap-2">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activeCategory === 'all'
                      ? 'bg-accent text-on-accent shadow-subtle'
                      : 'border border-line bg-surface text-muted hover:text-ink hover:border-accent/30'
                  }`}
                >
                  All
                </button>
              </li>
              {dynamicCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      activeCategory === cat.slug
                        ? 'bg-accent text-on-accent shadow-subtle'
                        : 'border border-line bg-surface text-muted hover:text-ink hover:border-accent/30'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Gallery or empty state */}
          {filtered.length > 0 ? (
            <motion.div
              className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={scrollViewport}
            >
              {filtered.map((photo) => (
                <motion.figure
                  key={photo.id}
                  className="mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl border border-line bg-surface shadow-subtle transition-shadow hover:shadow-raised"
                  variants={imageReveal}
                  onClick={() => openLightbox(photo)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openLightbox(photo)
                    }
                  }}
                  aria-label={`View ${photo.alt_text || photo.title || 'photo'} in full size`}
                >
                  <img
                    {...getOptimizedImageProps(photo.image_url)}
                    alt={photo.alt_text || ''}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    style={photo.aspectRatio ? { aspectRatio: photo.aspectRatio } : undefined}
                  />
                  {photo.caption && (
                    <figcaption className="px-4 py-3 text-sm text-muted">
                      {photo.caption}
                    </figcaption>
                  )}
                </motion.figure>
              ))}
            </motion.div>
          ) : (
            <div className="mt-10 rounded-xl border border-dashed border-line bg-raised/50 px-6 py-16 text-center">
              <Camera className="mx-auto h-10 w-10 text-muted/40" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-muted">No photographs yet.</p>
              <p className="mt-2 max-w-md mx-auto text-xs text-muted">
                This gallery is where photographs will appear. The architecture is ready — images
                just haven't been added yet.
              </p>
            </div>
          )}
        </motion.div>
      </Container>

      {/* Lightbox overlay */}
      <Lightbox
        photos={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </>
  )
}
