import { Camera, Images } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import Container from '@/components/layout/Container.jsx'
import Lightbox from '@/components/ui/Lightbox.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { pageLoadVariant, staggerContainer, imageReveal, scrollViewport, EASE_OUT_EXPO } from '@/lib/animations.js'
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

  const flattenedPhotos = useMemo(() => {
    return filtered.flatMap((post) => {
      const gallery = post.gallery?.length > 0 
        ? post.gallery 
        : post.image_url 
          ? [{ id: post.id + '-cover', image_url: post.image_url, variants: post.variants || [] }] 
          : [];
      
      return gallery.map((img) => ({
        ...img,
        postId: post.id,
        alt_text: post.alt_text,
        caption: post.caption,
        aspectRatio: post.aspectRatio
      }))
    })
  }, [filtered])

  const openLightbox = (post) => {
    const idx = flattenedPhotos.findIndex((p) => p.postId === post.id)
    setLightboxIndex(idx >= 0 ? idx : null)
  }

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/photography" />

      <Container>
        <motion.div
          className="py-16 sm:py-20 md:py-36"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          {/* Page header */}
          <header className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
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
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeCategory === 'all'
                      ? 'text-on-accent'
                      : 'border border-line bg-surface text-muted hover:text-ink hover:border-accent/40'
                  }`}
                >
                  {activeCategory === 'all' && (
                    <motion.span
                      layoutId="photoFilterActive"
                      className="absolute inset-0 rounded-lg bg-accent shadow-subtle"
                      transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                    />
                  )}
                  <span className="relative z-10">All</span>
                </button>
              </li>
              {dynamicCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      activeCategory === cat.slug
                        ? 'text-on-accent'
                        : 'border border-line bg-surface text-muted hover:text-ink hover:border-accent/40'
                    }`}
                  >
                    {activeCategory === cat.slug && (
                      <motion.span
                        layoutId="photoFilterActive"
                        className="absolute inset-0 rounded-lg bg-accent shadow-subtle"
                        transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                      />
                    )}
                    <span className="relative z-10">{cat.name}</span>
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
              {filtered.map((photo) => {
                const images = photo.gallery?.length > 0 
                  ? photo.gallery 
                  : photo.image_url 
                    ? [{ id: photo.id, image_url: photo.image_url, variants: photo.variants || [] }] 
                    : [];
                if (images.length === 0) return null;
                const cover = images[0];
                
                return (
                <motion.figure
                  key={photo.id}
                  className="relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-xl border border-line bg-surface shadow-subtle transition-all duration-300 hover:shadow-card-hover hover:border-accent/40 group"
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
                    {...getOptimizedImageProps(cover.image_url, cover.variants)}
                    alt={photo.alt_text || ''}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={photo.aspectRatio ? { aspectRatio: photo.aspectRatio } : undefined}
                  />
                  {images.length > 1 && (
                    <div className="absolute top-3 right-3 rounded-md bg-black/50 p-1.5 text-white backdrop-blur-md shadow-sm transition-opacity group-hover:bg-black/70">
                      <Images className="h-4 w-4" />
                    </div>
                  )}
                  {photo.caption && (
                    <figcaption className="px-4 py-3 text-sm text-muted">
                      {photo.caption}
                    </figcaption>
                  )}
                </motion.figure>
              )})}
            </motion.div>
          ) : (
            <div className="mt-10 rounded-xl border border-dashed border-line bg-raised/50 px-6 py-16 text-center">
              <Camera className="mx-auto h-10 w-10 text-muted/40" aria-hidden="true" />
              <p className="mt-4 text-sm font-medium text-muted">No photographs published yet.</p>
            </div>
          )}
        </motion.div>
      </Container>

      {/* Lightbox overlay */}
      <Lightbox
        photos={flattenedPhotos}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />
    </>
  )
}
