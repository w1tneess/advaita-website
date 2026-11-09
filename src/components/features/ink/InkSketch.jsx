import { useEffect, useRef } from 'react'

const HEX = { fact: '#7DB4FF', analysis: '#F2D45C', opinion: '#FF7A5C', limitation: '#B9BCC2' }
const DRY_MS = 4200 // how long a mark stays before it has fully faded

/**
 * The last page of the notebook, open for the visitor to write on.
 * Moving the pointer leaves a thin pen line in the chosen ink; holding the button down
 * lays a highlighter swipe. Ink dries and fades after a few seconds, so the page clears itself.
 * Listens on `targetRef` (the footer) so links above the canvas keep working.
 * Pointer only (no touch drawing, so scrolling on phones is untouched); off under reduced motion.
 */
export default function InkSketch({ targetRef, ink = 'opinion', clearSignal = 0, className = '' }) {
  const canvasRef = useRef(null)
  const inkRef = useRef(ink)
  const marksRef = useRef([])

  useEffect(() => { inkRef.current = ink }, [ink])
  useEffect(() => { marksRef.current = [] }, [clearSignal])

  useEffect(() => {
    const canvas = canvasRef.current
    const target = targetRef?.current
    if (!canvas || !target) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const ctx = canvas.getContext('2d')
    let w = 0
    let h = 0
    let raf = 0
    let visible = false
    let down = false
    let current = null

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const point = (e) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }
    }

    const start = (heavy, e) => {
      current = { ink: inkRef.current, heavy, pts: [point(e)] }
      marksRef.current.push(current)
      if (marksRef.current.length > 60) marksRef.current.shift()
    }

    const onMove = (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      if (!current || current.heavy !== down) start(down, e)
      const p = point(e)
      const last = current.pts[current.pts.length - 1]
      if (Math.hypot(p.x - last.x, p.y - last.y) > 2) current.pts.push(p)
    }
    const onDown = (e) => {
      if (e.button !== 0 || e.target.closest('a, button, input, textarea, select')) return
      down = true
      start(true, e)
    }
    const onUp = () => { down = false; current = null }
    const onLeave = () => { current = null }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      const now = performance.now()
      ctx.clearRect(0, 0, w, h)
      marksRef.current = marksRef.current.filter((m) => now - m.pts[m.pts.length - 1].t < DRY_MS)
      for (const m of marksRef.current) {
        const pts = m.pts
        if (pts.length < 2) continue
        ctx.lineCap = m.heavy ? 'butt' : 'round'
        ctx.lineJoin = 'round'
        ctx.strokeStyle = HEX[m.ink]
        ctx.lineWidth = m.heavy ? 18 : 1.8
        ctx.setLineDash(m.ink === 'limitation' ? (m.heavy ? [16, 10] : [6, 5]) : [])
        // Each segment dries on its own clock, so a long line fades from its tail.
        for (let i = 1; i < pts.length; i++) {
          const age = (now - pts[i].t) / DRY_MS
          ctx.globalAlpha = Math.max(0, (m.heavy ? 0.3 : 0.85) * (1 - age))
          ctx.beginPath()
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
          ctx.lineTo(pts[i].x, pts[i].y)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)
    target.addEventListener('pointermove', onMove, { passive: true })
    target.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    target.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      target.removeEventListener('pointerleave', onLeave)
    }
  }, [targetRef])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
