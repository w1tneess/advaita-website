import { useCallback, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { lightboxOverlay } from '@/lib/animations.js'
import { getOptimizedImageProps } from '@/lib/image.js'

// Swipe confidence threshold
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

const controlsVariants = {
  visible: { opacity: 1, transition: { duration: 0.3 } },
  hidden: { opacity: 0, transition: { duration: 0.5 } }
};

export default function Lightbox({ photos, index, onClose, onChange }) {
  const isOpen = index !== null && index !== undefined
  const photo = isOpen ? photos[index] : null
  
  // Track direction for slide animations
  const [[page, direction], setPage] = useState([index || 0, 0])
  
  // Controls auto-hide state
  const [showControls, setShowControls] = useState(true)
  const idleTimer = useRef(null)

  // Sync internal page with external index changes
  useEffect(() => {
    if (isOpen && index !== page) {
      setPage([index, index > page ? 1 : -1])
    }
  }, [index, isOpen, page])

  const paginate = useCallback((newDirection) => {
    if (!isOpen) return
    const nextIndex = index + newDirection
    if (nextIndex >= 0 && nextIndex < photos.length) {
      setPage([nextIndex, newDirection])
      onChange(nextIndex)
    }
  }, [index, isOpen, onChange, photos.length])

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
      idleTimer.current = setTimeout(() => setShowControls(false), 3000)
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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          variants={lightboxOverlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Close button */}
          <motion.button
            type="button"
            onClick={onClose}
            variants={controlsVariants}
            animate={showControls ? 'visible' : 'hidden'}
            className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 md:right-8 md:top-8"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </motion.button>

          {/* Slider Container */}
          <div className="relative flex h-full w-full items-center justify-center p-4 md:p-12">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={page}
                {...getOptimizedImageProps(photo.image_url, photo.variants)}
                alt={photo.alt_text || ''}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    goNext();
                  } else if (swipe > swipeConfidenceThreshold) {
                    goPrev();
                  }
                }}
                className="absolute max-h-full max-w-full cursor-grab object-contain active:cursor-grabbing"
              />
            </AnimatePresence>
          </div>

          {/* Bottom Gradient overlay for captions */}
          <motion.div 
            className="pointer-events-none absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-32 pb-8 text-center"
            variants={controlsVariants}
            animate={showControls ? 'visible' : 'hidden'}
          >
            <div className="pointer-events-auto flex flex-col items-center px-4">
              {photo.caption && (
                <p className="max-w-2xl text-sm leading-relaxed text-white/90 drop-shadow-md">
                  {photo.caption}
                </p>
              )}
              <p className="mt-3 text-xs tracking-wider text-white/50">
                {index + 1} / {photos.length}
              </p>
            </div>
          </motion.div>

          {/* Navigation arrows */}
          {hasPrev && (
            <motion.button
              type="button"
              onClick={goPrev}
              variants={controlsVariants}
              animate={showControls ? 'visible' : 'hidden'}
              className="absolute left-4 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 md:left-8"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </motion.button>
          )}
          
          {hasNext && (
            <motion.button
              type="button"
              onClick={goNext}
              variants={controlsVariants}
              animate={showControls ? 'visible' : 'hidden'}
              className="absolute right-4 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 md:right-8"
              aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
