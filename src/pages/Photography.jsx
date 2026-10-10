import { Camera, Images } from 'lucide-react'
import { useMemo, useState } from 'react'

import PageHeader from '@/components/ui/PageHeader.jsx'
import EmptyState from '@/components/ui/EmptyState.jsx'
import Lightbox from '@/components/ui/Lightbox.jsx'
import Seo from '@/components/meta/Seo.jsx'
import { useFilters } from '@/hooks/useFilters.js'
import { useContent } from '@/lib/content.jsx'
import { PUBLIC_ROUTES } from '@/config/nav.js'
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
        title: post.title,
        alt_text: post.alt_text,
        caption: post.caption,
        aspectRatio: post.aspectRatio,
        camera: post.camera,
        lens: post.lens,
        focal_length: post.focal_length,
        aperture: post.aperture,
        shutter_speed: post.shutter_speed,
        iso: post.iso,
        location: post.location,
        category: post.category,
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
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 font-utility">
            <span className="text-muted mr-1 sm:mr-2 text-xs">
              Category:
            </span>
            <button
              type="button"
              onClick={() => setValue('category', [])}
              className={`px-4 py-2 min-h-[36px] text-xs transition-all duration-150 ease-[var(--ease-out-quart)] cursor-pointer rounded-full active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas ${
                activeCategories.length === 0
                  ? "bg-ink text-canvas font-medium shadow-subtle"
                  : "bg-surface border border-line/60 text-muted hover:text-ink hover:border-line-strong hover:bg-surface/80"
              }`}
            >
              All Photos ({photos.length})
            </button>
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleValue('category', cat.slug)}
                className={`px-4 py-2 min-h-[36px] text-xs transition-all duration-150 ease-[var(--ease-out-quart)] cursor-pointer rounded-full active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas ${
                  activeCategories.includes(cat.slug)
                    ? "bg-ink text-canvas font-medium shadow-subtle"
                    : "bg-surface border border-line/60 text-muted hover:text-ink hover:border-line-strong hover:bg-surface/80"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </PageHeader>

      <section className="shell pb-24 pt-8">
        {filtered.length > 0 ? (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 space-y-4">
            {filtered.map((photo) => {
              const images = photo.gallery?.length > 0 
                ? photo.gallery 
                : photo.image_url 
                  ? [{ id: photo.id, image_url: photo.image_url, variants: photo.variants || [] }] 
                  : [];
              if (images.length === 0) return null;
              const cover = images[0];
              
              return (
                <figure
                  key={photo.id}
                  className="relative break-inside-avoid border border-line/60 bg-surface/30 p-2 sm:p-3 rounded-xl transition-all duration-250 ease-[var(--ease-out-quart)] hover:bg-surface/60 hover:border-line-strong hover:-translate-y-0.5 hover:shadow-subtle active:scale-[0.98] group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
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
                  <div className="relative overflow-hidden bg-surface rounded-lg">
                    <img
                      {...getOptimizedImageProps(cover.image_url, cover.variants)}
                      alt={photo.alt_text || photo.title || 'Photograph by Advaita Chandra'}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                      style={photo.aspectRatio ? { aspectRatio: photo.aspectRatio } : undefined}
                    />

                    {/* Floating Slide Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-surface/80 backdrop-blur-md border border-line/50 rounded-full px-2.5 py-1 font-mono text-xs text-ink z-20 shadow-subtle">
                        <Images className="h-3.5 w-3.5 text-muted" />
                        <span>{images.length}</span>
                      </div>
                    )}
                  </div>

                  {photo.caption && (
                    <figcaption className="pt-2 mt-1 text-xs sm:text-sm font-display text-muted italic leading-relaxed">
                      "{photo.caption}"
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        ) : (
          <div className="bg-surface p-12 text-center font-utility text-muted">
            <EmptyState
              icon={Camera}
              title="No photographs yet"
              message="Photographs and visual notes will appear here once added."
            />
          </div>
        )}
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
