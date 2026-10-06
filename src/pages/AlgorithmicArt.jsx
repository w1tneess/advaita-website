import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  ArrowLeft,
  Atom,
  Wind,
  Compass,
} from 'lucide-react'
import Seo from '@/components/meta/Seo.jsx'
import PageHeader from '@/components/ui/PageHeader.jsx'

const PRESETS = [
  {
    id: 'turbulence',
    name: 'Organic Turbulence',
    icon: Wind,
    description: 'Chaos constrained by vector fields, trails accumulating into density maps.',
    noiseScale: 0.005,
    speed: 1.4,
    particleCount: 1600,
    trailAlpha: 0.04,
    palette: ['#c2956a', '#d4a87d', '#F8F6F0', '#38bdf8'],
  },
  {
    id: 'harmonics',
    name: 'Quantum Harmonics',
    icon: Atom,
    description: 'Harmonic orbital interference generating resonant mathematical geometry.',
    noiseScale: 0.012,
    speed: 2.0,
    particleCount: 2200,
    trailAlpha: 0.06,
    palette: ['#a78bfa', '#38bdf8', '#F8F6F0', '#c2956a'],
  },
  {
    id: 'gravitation',
    name: 'Singularity Attractor',
    icon: Compass,
    description: 'Orbital velocity curves bending around dynamic gravitational wells.',
    noiseScale: 0.003,
    speed: 2.2,
    particleCount: 2000,
    trailAlpha: 0.05,
    palette: ['#fb923c', '#c2956a', '#F8F6F0', '#fb7185'],
  },
]

// Simple 2D Perlin-like pseudo noise generator for high performance
class FastNoise {
  constructor(seed = 1337) {
    this.seed = seed
  }
  noise(x, y) {
    const s = Math.sin(x * 12.9898 + y * 78.233 + this.seed) * 43758.5453123
    return s - Math.floor(s)
  }
  smoothNoise(x, y) {
    const i = Math.floor(x)
    const j = Math.floor(y)
    const fx = x - i
    const fy = y - j

    // Smoothstep
    const u = fx * fx * (3.0 - 2.0 * fx)
    const v = fy * fy * (3.0 - 2.0 * fy)

    const s00 = this.noise(i, j)
    const s10 = this.noise(i + 1, j)
    const s01 = this.noise(i, j + 1)
    const s11 = this.noise(i + 1, j + 1)

    return (
      (1 - u) * ((1 - v) * s00 + v * s01) +
      u * ((1 - v) * s10 + v * s11)
    )
  }
}

export default function AlgorithmicArt() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [isRunning, setIsRunning] = useState(true)
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0])
  const [seed, setSeed] = useState(42069)
  const [particleCount, setParticleCount] = useState(PRESETS[0].particleCount)
  const [speed, setSpeed] = useState(PRESETS[0].speed)

  // Simulation state
  const particlesRef = useRef([])
  const noiseGenRef = useRef(new FastNoise(42069))
  const mouseRef = useRef({ x: -1000, y: -1000, isDown: false })

  const initSimulation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const width = canvas.width
    const height = canvas.height

    noiseGenRef.current = new FastNoise(seed)

    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        age: Math.random() * 200,
        maxAge: 200 + Math.random() * 200,
        colorIndex: Math.floor(Math.random() * selectedPreset.palette.length),
      })
    }
    particlesRef.current = particles

    // Clear canvas with deep canvas background
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#0F0E0D'
    ctx.fillRect(0, 0, width, height)
  }, [particleCount, selectedPreset.palette.length, seed])

  // Resize canvas to container
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    initSimulation()
  }, [initSimulation])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  // Preset switch
  const applyPreset = (preset) => {
    setSelectedPreset(preset)
    setParticleCount(preset.particleCount)
    setSpeed(preset.speed)
  }

  // Animation render loop
  useEffect(() => {
    let active = true

    const loop = () => {
      if (!active) return

      if (isRunning && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const width = canvas.width
        const height = canvas.height
        const particles = particlesRef.current
        const noise = noiseGenRef.current

        // Fade background for motion trails
        ctx.fillStyle = `rgba(15, 14, 13, ${selectedPreset.trailAlpha})`
        ctx.fillRect(0, 0, width, height)

        const mouse = mouseRef.current
        const scale = selectedPreset.noiseScale
        const palette = selectedPreset.palette

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]

          // Angle computed from smooth mathematical noise
          let angle = noise.smoothNoise(p.x * scale, p.y * scale) * Math.PI * 4

          // Attractor / repulsion from mouse cursor
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const distSq = dx * dx + dy * dy
          if (distSq < 90000 && distSq > 100) {
            const dist = Math.sqrt(distSq)
            const force = (1 - dist / 300) * (mouse.isDown ? -2.5 : 1.5)
            angle += Math.atan2(dy, dx) * force
          }

          // Move
          p.vx += Math.cos(angle) * 0.4 * speed
          p.vy += Math.sin(angle) * 0.4 * speed

          // Friction damping
          p.vx *= 0.94
          p.vy *= 0.94

          const prevX = p.x
          const prevY = p.y
          p.x += p.vx
          p.y += p.vy

          // Draw trail segment
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = palette[p.colorIndex]
          ctx.lineWidth = 1.15
          ctx.stroke()

          p.age += 1
          // Reset bounds or age
          if (
            p.x < 0 ||
            p.x > width ||
            p.y < 0 ||
            p.y > height ||
            p.age > p.maxAge
          ) {
            p.x = Math.random() * width
            p.y = Math.random() * height
            p.vx = 0
            p.vy = 0
            p.age = 0
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop)
    }

    animationFrameRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isRunning, selectedPreset, speed])

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `advaita-generative-${selectedPreset.id}-seed${seed}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <>
      <Seo
        title="Algorithmic Art & Creative Computing"
        description="Interactive computational aesthetics, mathematical flow fields, and particle dynamics by Advaita Chandra."
        path="/art"
      />

      {/* Cinematic noise overlay */}
      <div className="premium-noise" />

      <PageHeader
        eyebrow={<span className="text-[10px] uppercase tracking-[0.2em] font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted">Creative Computing</span>}
        title={<span className="text-[clamp(2.5rem,5vw,5rem)] leading-none block py-2">Algorithmic Art</span>}
        lead="Interactive procedural systems, vector noise fields, and emergent dynamics exploring computational beauty."
      >
        <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-muted">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-accent hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Projects Index</span>
          </Link>
          <span>•</span>
          <span>GPU/Canvas 60fps Vector Field Simulation</span>
        </div>
      </PageHeader>

      <section className="shell pb-16">
        {/* Interactive Canvas Viewport (Double-Bezel) */}
        <div className="relative p-1.5 rounded-[2.5rem] bg-surface/40 border border-line shadow-raised w-full h-[65vh] min-h-[480px] max-h-[780px]">
          <div
            ref={containerRef}
            className="relative w-full h-full rounded-[calc(2.5rem-0.375rem)] border border-white/5 bg-canvas overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] group"
            onMouseMove={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect()
              if (!rect) return
              const dpr = Math.min(window.devicePixelRatio || 1, 2)
              mouseRef.current.x = (e.clientX - rect.left) * dpr
              mouseRef.current.y = (e.clientY - rect.top) * dpr
            }}
            onMouseDown={() => (mouseRef.current.isDown = true)}
            onMouseUp={() => (mouseRef.current.isDown = false)}
            onMouseLeave={() => {
              mouseRef.current.x = -1000
              mouseRef.current.y = -1000
              mouseRef.current.isDown = false
            }}
          >
            <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

            {/* Interactive Hint Banner (Fades on hover) */}
            <div className="absolute top-5 left-5 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md font-mono text-[11px] text-muted opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>Move cursor to bend field lines • Click to deflect particles</span>
            </div>

            {/* Seed indicator pill */}
            <div className="absolute top-5 right-5 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md font-mono text-[11px] text-muted opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <span>SEED:</span>
              <span className="text-accent font-semibold">#{seed}</span>
            </div>

            {/* Floating Apple Dock Controls (Magnetic + Glassmorphism) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center gap-2 p-1.5 rounded-full border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <button
                type="button"
                onClick={() => setIsRunning((r) => !r)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-ink hover:bg-white/20 active:scale-[0.96] transition-all duration-300 ease-[var(--ease-spring)] cursor-pointer"
                title={isRunning ? 'Pause simulation' : 'Resume simulation'}
              >
                {isRunning ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={initSimulation}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-transparent border border-white/10 hover:bg-white/5 text-muted hover:text-ink active:scale-[0.96] transition-all duration-300 ease-[var(--ease-spring)] cursor-pointer"
                title="Reset Canvas"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextSeed = Math.floor(Math.random() * 900000) + 100000
                  setSeed(nextSeed)
                }}
                className="flex items-center gap-2 px-4 h-11 rounded-full bg-transparent border border-white/10 hover:bg-white/5 text-muted hover:text-ink font-mono text-xs active:scale-[0.96] transition-all duration-300 ease-[var(--ease-spring)] cursor-pointer"
                title="Generate new pseudo-random mathematical seed"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span>New Seed</span>
              </button>

              <span className="w-[1px] h-6 bg-white/10 mx-1" />

              {/* Button-in-Button */}
              <button
                type="button"
                onClick={exportImage}
                className="group flex items-center gap-3 pl-5 pr-1.5 h-11 rounded-full bg-ink text-canvas font-mono text-xs font-semibold hover:bg-ink/90 active:scale-[0.96] transition-all duration-300 ease-[var(--ease-spring)] cursor-pointer shadow-subtle"
                title="Export high-resolution PNG snapshot"
              >
                <span>Save PNG</span>
                <div className="w-8 h-8 rounded-full bg-canvas/10 flex items-center justify-center group-hover:bg-canvas/20 group-hover:scale-105 group-hover:translate-x-[2px] transition-all duration-300">
                  <Download className="h-3.5 w-3.5" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Preset Selector & Parameter Deck */}
        <motion.div 
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {PRESETS.map((preset) => {
            const Icon = preset.icon
            const isSelected = selectedPreset.id === preset.id

            return (
              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`group p-1.5 rounded-[2rem] border text-left cursor-pointer flex flex-col justify-between transition-all duration-500 ease-[var(--ease-out-quart)] active:scale-[0.98] ${
                  isSelected
                    ? 'border-accent/40 bg-accent/5 shadow-subtle'
                    : 'border-line bg-surface/30 hover:bg-surface/60'
                }`}
              >
                <div className={`p-5 h-full rounded-[calc(2rem-0.375rem)] border transition-colors duration-500 flex flex-col justify-between ${
                  isSelected ? 'border-accent/20 bg-accent/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]' : 'border-white/5 bg-surface/20 group-hover:bg-surface/40'
                }`}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`p-2.5 rounded-full border transition-colors duration-500 ${
                          isSelected
                            ? 'border-accent/30 bg-accent/20 text-accent'
                            : 'border-line bg-canvas text-muted group-hover:text-ink group-hover:border-white/20'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                        {preset.particleCount} ptcls
                      </span>
                    </div>
                    <h3 className="font-sans text-base text-ink font-medium mb-1.5">
                      {preset.name}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-line/60 flex items-center gap-2">
                    {preset.palette.map((color, idx) => (
                      <span
                        key={idx}
                        className="h-1.5 w-6 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </section>
    </>
  )
}
