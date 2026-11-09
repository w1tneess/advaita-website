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
      <Seo title={ROUTE.title} description={ROUTE.description} path="/photography" noindex={photos.length === 0} />

      <PageHeader
        eyebrow="Photography"
        title="What caught my eye"
        lead={photography.intro || "Photographs, street scenes, and everyday geometry. Documenting light, architectural texture, and moments around me."}
      >
        {dynamicCategories.length > 0 && (
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-x-5 gap-y-2">
            <button
              type="button"
              aria-pressed={activeCategories.length === 0}
              onClick={() => setValue('category', [])}
              className={`pen-link min-w-6 py-1 text-[15px] ${activeCategories.length === 0 ? 'text-ink [background-size:100%_1px]' : 'text-muted hover:text-ink'}`}
            >
              All <span className="tabular-nums text-text-3">{photos.length}</span>
            </button>
            {dynamicCategories.map((cat) => {
              const on = activeCategories.includes(cat.slug)
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleValue('category', cat.slug)}
                  className={`pen-link min-w-6 py-1 text-[15px] ${on ? 'text-ink [background-size:100%_1px]' : 'text-muted hover:text-ink'}`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        )}
      </PageHeader>

      <section className="shell pb-28 pt-4">
        {filtered.length > 0 ? (
          <div className="columns-1 gap-[clamp(16px,2.2vw,32px)] sm:columns-2 lg:columns-3 [&>*]:mb-[clamp(24px,3vw,48px)]">
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
                  className="relative break-inside-avoid group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
                  <div className="relative overflow-hidden bg-surface">
                    <img
                      {...getOptimizedImageProps(cover.image_url, cover.variants)}
                      alt={photo.alt_text || photo.title || 'Photograph by Advaita Chandra'}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full object-cover transition-[opacity,filter] duration-500 ease-[var(--ease-soft)] group-hover:opacity-90"
                      style={photo.aspectRatio ? { aspectRatio: photo.aspectRatio } : undefined}
                    />

                    {/* Floating Slide Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-[6px] bg-canvas/85 px-2 py-1 text-[13px] text-ink z-20 tabular-nums">
                        <Images className="h-3.5 w-3.5 text-muted" />
                        <span>{images.length}</span>
                      </div>
                    )}
                  </div>

                  {photo.caption && (
                    <figcaption className="mt-3 text-[14px] leading-relaxed text-muted">
                      <span className="pen-link">{photo.caption}</span>
                    </figcaption>
                  )}
                </figure>
              )
            })}
          </div>
        ) : (
          <div className="folio"><div className="folio-body">
            <EmptyState
            icon={Camera}
            title="No photographs yet"
            message="Photographs and visual notes will appear here once added."
          />
          </div></div>
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
