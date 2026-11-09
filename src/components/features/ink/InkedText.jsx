import { useEffect, useRef } from 'react'

// The phrases of the owner's rule, in the order they appear, with the ink each one names.
const PHRASES = [
  ['facts from sources', 'fact'],
  ['my inferences', 'analysis'],
  ['my opinions', 'opinion'],
  ['things I do not know', 'limitation'],
]

/**
 * Renders the epistemic rule with each of its four phrases inked. If the text was edited
 * and no longer contains the phrases, it renders as plain text instead of guessing.
 * `idle` lets a pen re-mark one phrase at a time while the text is on screen.
 */
export default function InkedText({ text, idle = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!idle || !root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const marks = [...root.querySelectorAll('.ink')]
    if (!marks.length) return
    let visible = true
    let i = 0
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(root)
    // shortcut: a plain interval rather than a shared animation clock; there is only one idle loop on the site.
    const timer = setInterval(() => {
      if (!visible || document.documentElement.dataset.lens || document.hidden) return
      const mark = marks[i % marks.length]
      i += 1
      mark.classList.add('is-lifted')
      setTimeout(() => mark.classList.remove('is-lifted'), 700)
    }, 3200)
    return () => { clearInterval(timer); io.disconnect() }
  }, [idle, text])

  if (!text) return null
  const lower = text.toLowerCase()
  const found = PHRASES.map(([p, ink]) => [lower.indexOf(p.toLowerCase()), p.length, ink]).filter(([at]) => at >= 0)
  if (found.length !== PHRASES.length) return <span ref={ref}>{text}</span>

  const parts = []
  let cursor = 0
  found.sort((a, b) => a[0] - b[0]).forEach(([at, len, ink], n) => {
    parts.push(text.slice(cursor, at))
    parts.push(
      <span key={ink} className="ink ink-enter" data-ink={ink} style={{ '--enter-delay': `${500 + n * 140}ms` }}>
        {text.slice(at, at + len)}
      </span>,
    )
    cursor = at + len
  })
  parts.push(text.slice(cursor))
  return <span ref={ref}>{parts}</span>
}
