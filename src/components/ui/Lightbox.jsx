import { useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Info, ZoomIn, ZoomOut, Aperture, Camera, Compass } from 'lucide-react'
import { lightboxOverlay } from '@/lib/animations'
import { getOptimizedImageProps } from '@/lib/image.js'

// Swipe confidence threshold
const swipeConfidenceThreshold = 10000
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity
}

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.96,
  }),
}

const controlsVariants = {
  visible: { opacity: 1, pointerEvents: 'auto', transition: { duration: 0.25 } },
  hidden: { opacity: 0, pointerEvents: 'none', transition: { duration: 0.4 } },
}

export default function Lightbox({ photos = [], index, onClose, onChange }) {
  const isOpen = index !== null && index !== undefined
  const photo = isOpen ? photos[index] : null

  const [[page, direction], setPage] = useState([index || 0, 0])
  const [showControls, setShowControls] = useState(true)
  const [showExif, setShowExif] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [hasImageError, setHasImageError] = useState(false)
  const idleTimer = useRef(null)

  // Sync internal page with external index changes
  useEffect(() => {
    if (isOpen && index !== page) {
      setPage([index, index > page ? 1 : -1])
      setHasImageError(false)
      setIsZoomed(false)
    }
  }, [index, isOpen, page])

  const paginate = useCallback(
    (newDirection) => {
      if (!isOpen) return
      const nextIndex = index + newDirection
      if (nextIndex >= 0 && nextIndex < photos.length) {
        setPage([nextIndex, newDirection])
        setIsZoomed(false)
        onChange(nextIndex)
      }
    },
    [index, isOpen, onChange, photos.length],
  )

  const hasPrev = isOpen && index > 0
  const hasNext = isOpen && index < photos.length - 1

  const goPrev = useCallback(() => paginate(-1), [paginate])
  const goNext = useCallback(() => paginate(1), [paginate])

  // Idle timer logic
  useEffect(() => {
    if (!isOpen) return

    const resetTimer = () => {
      setShowControls(true)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setShowControls(false), 3800)
    }

    resetTimer()

    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('touchstart', resetTimer)
    window.addEventListener('keydown', resetTimer)

    return () => {
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('touchstart', resetTimer)
      window.removeEventListener('keydown', resetTimer)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [isOpen])

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
        case 'i':
        case 'I':
          setShowExif((v) => !v)
          break
        case 'z':
        case 'Z':
          setIsZoomed((v) => !v)
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

  const hasExif = Boolean(
    photo?.camera ||
      photo?.lens ||
      photo?.aperture ||
      photo?.shutter_speed ||
      photo?.iso ||
      photo?.focal_length ||
      photo?.location,
  )

  return (
    <AnimatePresence>
      {isOpen && photo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
          variants={lightboxOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop with darkroom diffusion */}
          <motion.div
            className="absolute inset-0 bg-[#070707]/96 backdrop-blur-2xl"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Top Apple Action Bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 sm:p-6"
            variants={controlsVariants}
            animate={showControls ? 'visible' : 'hidden'}
          >
            {/* Film Frame Counter Capsule */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl font-mono text-[11px] text-white/80 shadow-raised">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="font-semibold text-accent">FRAME {String(index + 1).padStart(2, '0')}</span>
              <span className="text-white/20">/</span>
              <span className="text-white/60">{String(photos.length).padStart(2, '0')}</span>
            </div>

            {/* Controls Cluster */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed((z) => !z)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur-xl transition-all hover:bg-white/15 hover:text-white active:scale-95 cursor-pointer"
                aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
                title="Toggle Zoom (Z)"
              >
                {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => setShowExif((s) => !s)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95 cursor-pointer backdrop-blur-xl ${
                  showExif
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white'
                }`}
                aria-label="Toggle EXIF Metadata"
                title="EXIF Exposure Data (I)"
              >
                <Info className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 backdrop-blur-xl transition-all hover:bg-white/15 hover:text-white active:scale-95 cursor-pointer ml-1"
                aria-label="Close lightbox (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* EXIF Inspector Drawer (Liquid Glass Apple card) */}
          <AnimatePresence>
            {showExif && (
              <motion.aside
                initial={{ opacity: 0, y: -16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-20 right-4 sm:right-6 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-white/15 bg-black/80 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl text-left"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Aperture className="h-4 w-4 text-accent" />
                    <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                      Exposure & Optics
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/40 uppercase">EXIF</span>
                </div>

                {hasExif ? (
                  <div className="space-y-3 font-mono text-xs">
                    {photo.camera && (
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-white/40 flex items-center gap-1.5">
                          <Camera className="h-3.5 w-3.5" />
                          Camera
                        </span>
                        <span className="text-white text-right font-medium">{photo.camera}</span>
                      </div>
                    )}

                    {photo.lens && (
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-white/40">Lens</span>
                        <span className="text-white/90 text-right">{photo.lens}</span>
                      </div>
                    )}

                    {(photo.aperture || photo.shutter_speed || photo.iso) && (
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-white/40">Exposure</span>
                        <span className="text-accent font-medium tracking-wider">
                          {[photo.aperture, photo.shutter_speed, photo.iso].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    )}

                    {photo.focal_length && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/40">Focal Length</span>
                        <span className="text-white">{photo.focal_length}</span>
                      </div>
                    )}

                    {photo.location && (
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-white/40 flex items-center gap-1">
                          <Compass className="h-3.5 w-3.5" />
                          Location
                        </span>
                        <span className="text-white/90">{photo.location}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs text-white/50 font-mono">
                    <p>No detailed EXIF record logged for this capture.</p>
                    {photo.category && (
                      <p className="mt-2 text-accent font-medium">Category: {photo.category}</p>
                    )}
                  </div>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Slider Viewport */}
          <div className="relative flex h-full w-full items-center justify-center p-4 md:p-12">
            <AnimatePresence initial={false} custom={direction}>
              {hasImageError ? (
                <div
                  key={`err-${page}`}
                  className="flex flex-col items-center justify-center p-8 text-center text-white/60 font-mono text-xs"
                >
                  <p>Image temporarily unavailable</p>
                </div>
              ) : (
                <motion.div
                  key={page}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 320, damping: 32 },
                    opacity: { duration: 0.2 },
                  }}
                  className="relative flex items-center justify-center max-h-full max-w-full"
                >
                  <motion.img
                    {...getOptimizedImageProps(photo.image_url, photo.variants)}
                    alt={photo.alt_text || photo.title || 'Photograph by Advaita Chandra'}
                    onError={() => setHasImageError(true)}
                    animate={{
                      scale: isZoomed ? 1.6 : 1,
                      cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setIsZoomed((z) => !z)}
                    drag={!isZoomed ? 'x' : true}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.6}
                    onDragEnd={(e, { offset, velocity }) => {
                      if (isZoomed) return
                      const swipe = swipePower(offset.x, velocity.x)
                      if (swipe < -swipeConfidenceThreshold) {
                        goNext()
                      } else if (swipe > swipeConfidenceThreshold) {
                        goPrev()
                      }
                    }}
                    className="max-h-[82vh] max-w-[90vw] object-contain rounded-md shadow-2xl transition-all"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Caption Dock */}
          <motion.div
            className="pointer-events-none absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-24 pb-7 text-center"
            variants={controlsVariants}
            animate={showControls ? 'visible' : 'hidden'}
          >
            <div className="pointer-events-auto mx-auto flex max-w-xl flex-col items-center px-4">
              {photo.title && (
                <h3 className="font-serif text-base sm:text-lg text-white font-normal drop-shadow-md mb-1">
                  {photo.title}
                </h3>
              )}
              {photo.caption && (
                <p className="font-sans text-xs sm:text-sm leading-relaxed text-white/80 drop-shadow-md">
                  {photo.caption}
                </p>
              )}
              {/* Micro exposure caption summary */}
              {(photo.camera || photo.aperture) && (
                <div className="mt-2.5 flex items-center gap-2 font-mono text-[10px] text-accent/90">
                  {photo.camera && <span>{photo.camera}</span>}
                  {photo.camera && photo.aperture && <span>•</span>}
                  {photo.aperture && <span>{photo.aperture}</span>}
                  {photo.shutter_speed && <span>{photo.shutter_speed}</span>}
                  {photo.iso && <span>{photo.iso}</span>}
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation arrows with Apple frosted glass capsules */}
          {hasPrev && (
            <motion.button
              type="button"
              onClick={goPrev}
              variants={controlsVariants}
              animate={showControls ? 'visible' : 'hidden'}
              className="absolute left-3 sm:left-6 md:left-8 top-1/2 z-40 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/20 active:scale-95 cursor-pointer shadow-raised"
              aria-label="Previous photo (←)"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          )}

          {hasNext && (
            <motion.button
              type="button"
              onClick={goNext}
              variants={controlsVariants}
              animate={showControls ? 'visible' : 'hidden'}
              className="absolute right-3 sm:right-6 md:right-8 top-1/2 z-40 flex h-11 w-11 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/20 active:scale-95 cursor-pointer shadow-raised"
              aria-label="Next photo (→)"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
