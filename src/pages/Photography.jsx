import { ArrowUpRight, Camera, Images } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import Container from '@/components/layout/Container.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Lightbox from '@/components/ui/Lightbox.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useFilters } from '@/hooks/useFilters.js'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { pageLoadVariant, staggerContainer, imageReveal, scrollViewport } from '@/lib/animations.js'
import { getOptimizedImageProps } from '@/lib/image.js'

const ROUTE = PUBLIC_ROUTES.find((route) => route.key === 'photography')
const INITIAL_FILTERS = { category: [] }

export default function Photography() {
  const { photography } = useContent()
  const { values, setValue, toggleValue } = useFilters(INITIAL_FILTERS)
  const activeCategories = values.category
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
      activeCategories.length === 0
        ? photos
        : photos.filter((photo) => activeCategories.includes(photo.category?.toLowerCase())),
    [photos, activeCategories],
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
    const idx = flattenedPhotos.findIndex((p) => String(p.postId) === String(post.id))
    setLightboxIndex(idx >= 0 ? idx : null)
  }

  return (
    <>
      <Seo title={ROUTE.title} description={ROUTE.description} path="/photography" />

      <Container>
        <motion.div
          className="py-12 sm:py-16 md:py-20"
          initial="hidden"
          animate="visible"
          variants={pageLoadVariant}
        >
          {/* Page header */}
          <div className="border-b border-line/40 pb-8 sm:pb-10">
            <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-accent uppercase mb-3">
              <span>⟐</span>
              <span>VISUAL NOTES & OBSERVATION</span>
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-ink">
                  Photography
                </h1>
                <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">
                  {photography.intro}
                </p>
                {photography.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted/80">
                    {photography.description}
                  </p>
                )}
              </div>

              {/* Category filters — only shown when multiple categories exist */}
              {dynamicCategories.length > 0 && (
                <div className="sm:self-start sm:pt-1">
                  <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Photo categories">
                    <button
                      type="button"
                      onClick={() => setValue('category', [])}
                      aria-pressed={activeCategories.length === 0}
                      className={`filter-pill ${activeCategories.length === 0 ? 'filter-pill-active' : ''}`}
                    >
                      All ({photos.length})
                    </button>
                    {dynamicCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleValue('category', cat.slug)}
                        aria-pressed={activeCategories.includes(cat.slug)}
                        className={`filter-pill ${activeCategories.includes(cat.slug) ? 'filter-pill-active' : ''}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

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
                    className="relative mb-6 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl border border-line/70 bg-surface shadow-subtle transition-all duration-300 hover:border-ink/30 hover:shadow-card-hover group"
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
                    <div className="relative overflow-hidden">
                      <img
                        {...getOptimizedImageProps(cover.image_url, cover.variants)}
                        alt={photo.alt_text || ''}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        style={photo.aspectRatio ? { aspectRatio: photo.aspectRatio } : undefined}
                      />

                      {/* Floating Category Pill (Top-Left) */}
                      {photo.category && (
                        <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/90 shadow-sm">
                          {photo.category}
                        </div>
                      )}

                      {/* Floating Slide Counter (Top-Right) */}
                      {images.length > 1 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs text-white/90 shadow-sm">
                          <Images className="h-3 w-3" />
                          <span className="font-mono text-[11px] font-medium">{images.length}</span>
                        </div>
                      )}

                      {/* Floating Action Button (Bottom-Right) */}
                      <div className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white/80 shadow-md transition-all duration-200 group-hover:bg-white group-hover:text-black group-hover:scale-105">
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                    </div>

                    {photo.caption && (
                      <figcaption className="px-4 py-3 text-xs sm:text-sm text-muted border-t border-line/40">
                        {photo.caption}
                      </figcaption>
                    )}
                  </motion.figure>
                )})}
            </motion.div>
          ) : (
            <div className="mt-12">
              <EmptyState
                icon={Camera}
                title="No photographs published yet"
                message="Film scans, darkroom prints, and digital studies will appear here once archived."
              />
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
