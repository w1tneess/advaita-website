import { useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { lightboxOverlay, lightboxContent } from '@/lib/animations.js'

/**
 * Full-screen image lightbox with keyboard navigation.
 *
 * Props:
 *   photos    – array of photo objects (image_url, alt_text, caption)
 *   index     – currently selected index, or null when closed
 *   onClose   – callback to close
 *   onChange   – callback with new index
 */
export default function Lightbox({ photos, index, onClose, onChange }) {
  const isOpen = index !== null && index !== undefined
  const photo = isOpen ? photos[index] : null
  const hasPrev = isOpen && index > 0
  const hasNext = isOpen && index < photos.length - 1

  const goPrev = useCallback(() => {
    if (hasPrev) onChange(index - 1)
  }, [hasPrev, index, onChange])

  const goNext = useCallback(() => {
    if (hasNext) onChange(index + 1)
  }, [hasNext, index, onChange])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goPrev()
          break
        case 'ArrowRight':
          goNext()
          break
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose, goPrev, goNext])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={lightboxOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/90 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Content */}
          <motion.div
            className="relative z-10 flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            variants={lightboxContent}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-surface/20 text-canvas backdrop-blur-sm transition-colors hover:bg-surface/40"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Image */}
            <img
              src={photo.image_url}
              alt={photo.alt_text || ''}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />

            {/* Caption */}
            {photo.caption && (
              <p className="mt-4 max-w-lg text-center text-sm text-canvas/80">{photo.caption}</p>
            )}

            {/* Counter */}
            <p className="mt-2 text-xs text-canvas/50">
              {index + 1} / {photos.length}
            </p>
          </motion.div>

          {/* Navigation arrows */}
          {hasPrev && (
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-surface/20 text-canvas backdrop-blur-sm transition-colors hover:bg-surface/40"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-surface/20 text-canvas backdrop-blur-sm transition-colors hover:bg-surface/40"
              aria-label="Next photo"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
