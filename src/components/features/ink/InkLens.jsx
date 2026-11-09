import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'

/**
 * The four inks of this notebook. Order and wording follow the owner's own rule:
 * "facts from sources, my inferences, my opinions, and things I do not know".
 * `key` matches the existing epistemic tokens (fact / analysis / opinion / limitation).
 */
export const INKS = [
  { key: 'fact', mark: 'fact', label: 'Facts from sources', short: 'Sourced fact' },
  { key: 'analysis', mark: 'inference', label: 'My inferences', short: 'Inference' },
  { key: 'opinion', mark: 'opinion', label: 'My opinions', short: 'Opinion' },
  { key: 'limitation', mark: 'unknown', label: 'Things I do not know', short: 'Unknown' },
]

const listeners = new Set()
let current = null

/** Picks an ink (or clears it). The lens is a page-wide attribute on <html> so CSS does the rest. */
export function setLens(key) {
  current = key && key !== current ? key : null
  if (current) document.documentElement.dataset.lens = current
  else delete document.documentElement.dataset.lens
  listeners.forEach((fn) => fn(current))
}

export function useLens() {
  const [lens, setState] = useState(current)
  useEffect(() => {
    listeners.add(setState)
    return () => listeners.delete(setState)
  }, [])
  return lens
}

/** Clears the lens on navigation so a new page always opens unfiltered. */
export function useLensReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (current) setLens(null)
  }, [pathname])
}

/**
 * Ink keys. `variant="hero"` is the large legend under the home headline;
 * the default is the compact fixed key in the corner of every public page.
 */
export function InkKeys({ variant = 'compact', className = '' }) {
  const lens = useLens()
  const hero = variant === 'hero'

  return (
    <div
      role="group"
      aria-label="Ink lens: highlight one kind of claim"
      className={className}
    >
      {!hero && <span className="sr-only">Lens</span>}
      <ul className={hero ? 'grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8' : 'flex items-center gap-1'}>
        {INKS.map((ink) => {
          const active = lens === ink.key
          return (
            <li key={ink.key}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setLens(ink.key)}
                title={hero ? undefined : ink.label}
                aria-label={hero ? undefined : `${ink.short}: ${ink.label}`}
                className={
                  hero
                    ? `group flex items-baseline gap-3 py-1.5 text-left transition-opacity duration-300 ${lens && !active ? 'opacity-45' : ''}`
                    : `group flex h-8 items-center gap-2 rounded-[6px] px-2.5 text-[13px] transition-colors duration-150 ${active ? 'bg-raised text-ink' : 'text-muted hover:text-ink hover:bg-raised/60'}`
                }
              >
                <span
                  aria-hidden="true"
                  className={`inline-block shrink-0 rounded-full transition-transform duration-300 ${hero ? 'h-2.5 w-2.5' : 'h-2 w-2'} group-hover:scale-150 ${active ? 'scale-125' : ''}`}
                  style={{ background: `var(--color-${ink.key})` }}
                />
                {hero ? (
                  <span className="flex flex-col">
                    <span className="mark-label" data-ink={ink.key}>{ink.mark}</span>
                    <span className="mt-1 text-[14px] text-muted group-hover:text-ink transition-colors duration-150">
                      {ink.label}
                    </span>
                  </span>
                ) : (
                  <span className={active ? '' : 'hidden xl:inline'}>{ink.short}</span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
