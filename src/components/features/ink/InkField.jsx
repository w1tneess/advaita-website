import { useEffect, useRef } from 'react'
import { useLens } from './InkLens.jsx'

/**
 * The hero's living page: four pens keep marking a notebook in the background.
 * Highlighter swipes and pen underlines draw themselves, hold, and fade, the way a
 * reader marks a page. The pointer leaves a short pen trace. Choosing an ink in the
 * lens brings that ink forward and quiets the others.
 *
 * This is the site's single animation clock: it also re-marks one phrase of the
 * headline at a time (`remarkSelector`), so the background and the text agree.
 * Paused off screen, when the tab is hidden, or by the visitor; static under reduced motion.
 */
const INKS = ['fact', 'analysis', 'opinion', 'limitation']
const HEX = { fact: '#7DB4FF', analysis: '#F2D45C', opinion: '#FF7A5C', limitation: '#B9BCC2' }
const MAX_MARKS = 10

const rand = (a, b) => a + Math.random() * (b - a)

// A reader's marks: highlighter swipes, pen underlines, margin brackets, ticks and loops.
const KINDS = ['swipe', 'swipe', 'underline', 'underline', 'bracket', 'tick', 'loop']

function path(kind, x, y, size) {
  const pts = []
  const jitter = () => rand(-0.7, 0.7)
  if (kind === 'swipe' || kind === 'underline') {
    const len = kind === 'swipe' ? size * rand(1.4, 3.2) : size * rand(1, 2.6)
    const angle = rand(-0.18, 0.08)
    const bow = rand(-14, 14)
    for (let i = 0; i <= 28; i++) {
      const t = i / 28
      pts.push([x + Math.cos(angle) * len * t, y + Math.sin(angle) * len * t + Math.sin(t * Math.PI) * bow + jitter()])
    }
  } else if (kind === 'bracket') {
    const hgt = size * rand(0.9, 1.8)
    const hook = rand(10, 16)
    pts.push([x + hook, y])
    for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push([x + Math.sin(t * Math.PI) * -3 + jitter(), y + hgt * t]) }
    pts.push([x + hook, y + hgt])
  } else if (kind === 'tick') {
    const s2 = rand(14, 22)
    pts.push([x, y], [x + s2 * 0.35, y + s2 * 0.45], [x + s2, y - s2 * 0.55])
  } else {
    const rx = size * rand(0.35, 0.6)
    const ry = rx * rand(0.28, 0.42)
    const a0 = rand(0, Math.PI * 2)
    for (let i = 0; i <= 40; i++) { const a = a0 + (i / 40) * Math.PI * 2.15; pts.push([x + Math.cos(a) * rx + jitter(), y + Math.sin(a) * ry + jitter()]) }
  }
  return pts
}

function makeMark(w, h, ink) {
  const kind = KINDS[Math.floor(Math.random() * KINDS.length)]
  // Marks live where a reader writes and nothing is printed: the top of the left margin and
  // the space below the text on the right. Each zone caps how long a stroke may run.
  let x
  let y
  let room
  if (kind === 'bracket') {
    x = rand(w * 0.975, w * 0.985); y = rand(h * 0.14, h * 0.4); room = w
  } else if (Math.random() < 0.5) {
    // beside the Sanskrit note, right of "Chandra"
    x = rand(w * 0.52, w * 0.74); y = rand(h * 0.44, h * 0.54); room = w * 0.78 - x
  } else {
    // the band below the signature
    x = rand(w * 0.55, w * 0.85); y = rand(h * 0.9, h * 0.96); room = w * 0.95 - x
  }
  const size = Math.max(40, Math.min(Math.min(w, h) * 0.12, room / 3))
  const highlighter = kind === 'swipe'
  return {
    ink,
    pts: path(kind, x, y, size),
    width: highlighter ? rand(14, 24) : rand(1.4, 2.2),
    alpha: highlighter ? rand(0.13, 0.2) : rand(0.4, 0.6),
    cap: highlighter ? 'butt' : 'round',
    draw: 0,
    speed: highlighter ? rand(0.7, 1.1) : kind === 'tick' ? 2.6 : rand(0.9, 1.6),
    hold: rand(3, 6),
    fade: 1,
  }
}

function drawMark(ctx, m, lens) {
  const n = Math.max(2, Math.ceil(m.pts.length * m.draw))
  const dim = lens && lens !== m.ink ? 0.22 : lens === m.ink ? 1.9 : 1
  ctx.globalAlpha = Math.min(0.85, m.alpha * m.fade * dim)
  ctx.strokeStyle = HEX[m.ink]
  ctx.lineWidth = m.width
  ctx.lineCap = m.cap
  ctx.lineJoin = 'round'
  if (m.ink === 'limitation') ctx.setLineDash([m.width * 1.2, m.width * 0.8])
  else ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(m.pts[0][0], m.pts[0][1])
  for (let i = 1; i < n; i++) ctx.lineTo(m.pts[i][0], m.pts[i][1])
  ctx.stroke()
}

export default function InkField({ remarkSelector, paused = false, className = '' }) {
  const canvasRef = useRef(null)
  const lens = useLens()
  const lensRef = useRef(lens)
  const pausedRef = useRef(false)

  useEffect(() => { lensRef.current = lens }, [lens])
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let marks = []
    let trail = []
    let raf = 0
    let last = performance.now()
    let spawnIn = 0.2
    let remarkIn = 2
    let remarkIndex = 0
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const paint = () => {
      ctx.clearRect(0, 0, w, h)
      for (const m of marks) drawMark(ctx, m, lensRef.current)
      if (trail.length > 1) {
        const ink = lensRef.current || INKS[Math.floor(performance.now() / 4000) % 4]
        ctx.setLineDash([])
        ctx.strokeStyle = HEX[ink]
        ctx.lineCap = 'round'
        ctx.lineWidth = 1.6
        for (let i = 1; i < trail.length; i++) {
          ctx.globalAlpha = 0.5 * trail[i].life
          ctx.beginPath()
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
          ctx.lineTo(trail[i].x, trail[i].y)
          ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }

    const remark = () => {
      if (!remarkSelector || lensRef.current) return
      const phrases = document.querySelectorAll(remarkSelector)
      if (!phrases.length) return
      const el = phrases[remarkIndex % phrases.length]
      remarkIndex += 1
      el.classList.add('is-lifted')
      setTimeout(() => el.classList.remove('is-lifted'), 650)
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible || document.hidden || pausedRef.current) return

      spawnIn -= dt
      // Narrow screens stack the margin above the text, so there is no empty paper to mark.
      if (spawnIn <= 0 && w >= 1024 && marks.length < MAX_MARKS) {
        const ink = lensRef.current && Math.random() < 0.6 ? lensRef.current : INKS[Math.floor(Math.random() * 4)]
        marks.push(makeMark(w, h, ink))
        spawnIn = rand(0.45, 1.1)
      }
      for (const m of marks) {
        if (m.draw < 1) m.draw = Math.min(1, m.draw + dt * m.speed)
        else if (m.hold > 0) m.hold -= dt
        else m.fade -= dt * 0.5
      }
      marks = marks.filter((m) => m.fade > 0)
      for (const p of trail) p.life -= dt * 1.1
      trail = trail.filter((p) => p.life > 0)

      remarkIn -= dt
      if (remarkIn <= 0) { remark(); remarkIn = 2.6 }

      paint()
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (y < 0 || y > rect.height) return
      trail.push({ x, y, life: 1 })
      if (trail.length > 40) trail.shift()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    if (reduce) {
      // A still page with a few finished marks, so the hero still reads as marked up.
      if (w >= 1024) for (let i = 0; i < 6; i++) { const m = makeMark(w, h, INKS[i % 4]); m.draw = 1; marks.push(m) }
      paint()
      const still = new ResizeObserver(() => { resize(); paint() })
      still.observe(canvas)
      return () => { ro.disconnect(); still.disconnect() }
    }

    // Start with a few marks already on the page so the first frame is composed, not empty.
    if (w >= 1024) for (let i = 0; i < 7; i++) { const m = makeMark(w, h, INKS[i % 4]); m.draw = 1; m.hold = rand(0.5, 4); marks.push(m) }
    paint()

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(canvas)
    if (window.matchMedia('(pointer: fine)').matches) window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [remarkSelector])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
