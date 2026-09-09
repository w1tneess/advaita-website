import { ArrowUpRight, Camera, Images } from 'lucide-react'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import PageHeader from '@/components/ui/PageHeader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Lightbox from '@/components/ui/Lightbox.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useFilters } from '@/hooks/useFilters.js'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
import { imageReveal, scrollViewport } from '@/lib/animations.js'
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

      <PageHeader
        eyebrow="Photography"
        title="Photography"
        lead={photography.intro || "Photographs, street scenes, and everyday geometry. Documenting light, architectural texture, and moments around me."}
      >
        {/* Category Filters Bar */}
        {dynamicCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-text-3 uppercase text-[10px] tracking-widest mr-2">
              Category:
            </span>
            <button
              type="button"
              onClick={() => setValue('category', [])}
              className={`px-3 py-1.5 border transition-all duration-200 cursor-pointer ${
                activeCategories.length === 0
                  ? "border-copper bg-copper text-canvas font-medium"
                  : "border-line bg-surface/60 text-text-3 hover:border-line-strong hover:text-text"
              }`}
            >
              All Photos ({photos.length})
            </button>
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleValue('category', cat.slug)}
                className={`px-3 py-1.5 border transition-all duration-200 cursor-pointer ${
                  activeCategories.includes(cat.slug)
                    ? "border-copper bg-copper text-canvas font-medium"
                    : "border-line bg-surface/60 text-text-3 hover:border-line-strong hover:text-text"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </PageHeader>

      <section className="shell pb-24 md:pb-32">
        {filtered.length > 0 ? (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 space-y-6">
            {filtered.map((photo, index) => {
              const images = photo.gallery?.length > 0 
                ? photo.gallery 
                : photo.image_url 
                  ? [{ id: photo.id, image_url: photo.image_url, variants: photo.variants || [] }] 
                  : [];
              if (images.length === 0) return null;
              const cover = images[0];
              const frameIndex = String(index + 1).padStart(2, '0');
              
              return (
                <motion.figure
                  key={photo.id}
                  className="relative break-inside-avoid border border-line bg-surface p-3 transition-all duration-300 hover:border-copper/60 group cursor-pointer"
                  variants={imageReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={scrollViewport}
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
                  {/* Darkroom Contact Sheet Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-line font-mono text-[10px] text-text-3">
                    <span className="text-copper">PLATE // {frameIndex}</span>
                    <span className="uppercase tracking-wider">{photo.category || 'ILFORD HP5'}</span>
                  </div>

                  {/* Image Frame with Corner Optical Ticks */}
                  <div className="relative overflow-hidden bg-[#050505]">
                    <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-copper/80 z-20 pointer-events-none" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-copper/80 z-20 pointer-events-none" />
                    <span className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-copper/80 z-20 pointer-events-none" />
                    <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-copper/80 z-20 pointer-events-none" />

                    <img
                      {...getOptimizedImageProps(cover.image_url, cover.variants)}
                      alt={photo.alt_text || photo.title || 'Photograph by Advaita Chandra'}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full object-cover grayscale contrast-[1.05] brightness-[0.98] transition-all duration-700 group-hover:scale-[1.02] group-hover:contrast-[1.1]"
                      style={photo.aspectRatio ? { aspectRatio: photo.aspectRatio } : undefined}
                    />

                    {/* Floating Slide Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-canvas/80 backdrop-blur-sm border border-line px-2 py-0.5 text-[10px] text-text font-mono z-20">
                        <Images className="h-3 w-3 text-copper" />
                        <span>{images.length}</span>
                      </div>
                    )}

                    {/* Expand indicator on hover */}
                    <div className="absolute bottom-2.5 right-2.5 flex h-6 w-6 items-center justify-center bg-canvas/80 backdrop-blur-sm border border-line text-text-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:text-copper z-20">
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                  </div>

                  {photo.caption && (
                    <figcaption className="pt-2.5 mt-1 text-xs text-text-2/90 font-light italic leading-snug">
                      "{photo.caption}"
                    </figcaption>
                  )}
                </motion.figure>
              )
            })}
          </div>
        ) : (
          <div className="border border-line bg-surface/40 p-12 text-center">
            <EmptyState
              icon={Camera}
              title="No photographs yet"
              message="Photographs and visual notes will appear here once added."
            />
          </div>
        )}

        {/* Bottom Colophon Footnote */}
        <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-text-3">
          <span>Visual Notebook</span>
          <span className="text-copper">Location: India</span>
        </div>
      </section>

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
