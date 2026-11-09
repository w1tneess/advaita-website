# Redesign: design notes

Working document for the `design/redesign` branch. Kept in the repo so later passes stay consistent.

## Brief

- **Subject:** Advaita Chandra, a student in West Bengal, India. Public notebook: philosophy reading notes, photography, small web and data projects, essays.
- **Audience:** readers who arrive from a note or a project, teachers and peers, people who might send a correction.
- **Job:** read the notes, see the work, send a correction or a book. Not "get hired".
- **Constraints (site rules):** dark only, no home address, phone, school or schedule anywhere, no invented claims, no third-party requests (fonts are self-hosted).
- **Stack:** the existing Vite + React 19 + React Router + Tailwind v4 project, with the framer-motion and Lenis already installed. No GSAP: the motion here is small enough for what is installed, and adding a second animation library would only add weight.

## Concepts

| | Idea | Anchor | Signature | O / F / Fe / P |
|---|---|---|---|---|
| A. Name | *Advaita* means "not two": every section is two halves (source and reading) that close into one as you scroll | his name | split panels merge on scroll | 3 / 3 / 4 / 3 |
| B. Method | **Four inks.** The site is marked up like a proofread notebook: every claim carries one of four marks, sourced fact, inference, opinion, unknown | his stated rule: "separate four things: facts from sources, my inferences, my opinions, and things I do not know" | a four-key lens: pick an ink and every passage of that kind lights up while the rest recede | 4 / 5 / 4 / 1 |
| C. Material | Contact sheet: every page is a roll of film | he photographs | film advance between pages | 2 / 3 / 4 / 4 |

**Pick B.** It comes from the one rule that is unmistakably his, it already exists in the content (projects record limitations, notes mark opinions), and it gives decisions for color, type, layout, motion and copy. From A, the 404 borrows "not two": a page with only the unknown ink.

## Concept card

```
Idea:        A public notebook marked in four inks: fact, inference, opinion, unknown.
Metaphor:    a proofread notebook; marginal marks in coloured pencil and highlighter.
Signature:   the Ink lens. A four-key legend (fixed, bottom left). Choosing an ink draws a
             highlighter stroke under every passage of that kind and fades the rest.
             The hero sentence is the rule itself, its four phrases inked in their colours.
Emotion:     the first 3 seconds feel like opening someone's careful, honest notebook.
Motion verb: "mark like a pen": strokes draw left to right (scaleX from origin left),
             text settles in place, nothing bounces.
Screenshot:  the hero sentence at display size with four highlighter strokes, one per ink.
```

## Palette (dark, cool graphite, not the warm cream-and-copper default)

| Role | Hex | Use |
|---|---|---|
| ground | `#0E0F11` | page |
| raised | `#16181B` | panels, inputs |
| ink | `#ECEDE8` | text, display |
| muted | `#9A9EA6` | secondary text (7.3:1 on ground) |
| line | `rgba(236,237,232,0.12)` | hairlines |
| fact (blue pencil) | `#7DB4FF` | sourced fact |
| inference (highlighter) | `#F2D45C` | my inference / analysis |
| opinion (red pen) | `#FF7A5C` | my opinion; also the one action colour |
| unknown (graphite) | `#B9BCC2` dashed | things I do not know / limitations |

The inks are the only colour. Chrome stays graphite. Opinion red doubles as the accent for the primary action and focus ring, because the action ("tell me I'm wrong") is itself an opinion invitation.

## Type

- **Switzer** (Fontshare, self-hosted, 400/500/600): everything, including display. Display at 500 with tight negative tracking.
- **Caveat** (Google, self-hosted, 500): only for the margin marks that name an ink ("fact", "my inference"). Carries real information, never decoration, never below 18px.
- Scale: `--t-mega clamp(2.75rem, 1.2rem + 6.4vw, 7.5rem)`, `--t-xl clamp(2.25rem, 1.3rem + 3.6vw, 4.75rem)`, `--t-l clamp(1.5rem, 1.15rem + 1.5vw, 2.5rem)`, `--t-m clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)`, body 17px / 1.6, UI 13–14px.
- Sentence case everywhere. No uppercase tracked labels, no mono labels.

## Grid and rhythm

- 12 columns, gutter `clamp(16px, 2.2vw, 32px)`, max width 1440. Two hanging lines: column 1 (labels, margin marks) and column 4 (all text starts here on desktop). The left three columns are the margin, like a notebook.
- Section spacing moods: tight 64, normal 128, airy 192, full viewport for the hero.

## Shape and motion

- Radius: 0 for layout, 6px for controls and inputs, 999px only for the ink dots.
- Ease `cubic-bezier(0.22, 1, 0.36, 1)` for everything. Durations: 160ms feedback, 420ms strokes, 700ms hero entrance. Stagger 60ms.
- Primary links: the label underline draws in left to right in ink (the pen stroke). Buttons: the fill sweeps in from the left. Utility links only change colour.
- Idle: in the hero, a soft pen cycles through the four phrases, redrawing one stroke every few seconds. Paused when the hero is off screen or the visitor has picked an ink, off under reduced motion.
- Reduced motion: strokes appear fully drawn, no smooth scroll, nothing hidden.

## Composition (each section a different family)

```
Home
 hero (statement)       | margin: "a public notebook" |  the rule, mega, four inked phrases  |
                        | marks in Caveat beside each line                              |
                        | name, place, 2 actions                                        |
 notes (index list)     | margin label | title ............ thinker ........ date       |
 work (asymmetric pair) | margin | project title large  / what it shows / what it can't |
 reading (statement)    | margin | "Reading now" thinkers as a run of large text         |
 correspondence (poster)| "Tell me where I'm wrong." huge, then email + form link       |
 footer (finale)        | name huge, nav, legal                                         |
Inner pages: margin + text column header, then the page's own list or grid.
404: the unknown ink only. "No source for this page."
```

## Genericness test

- A generic model lands on "dark portfolio, serif hero, copper accent" (the old site) or "cream editorial". Changed to cool graphite with four functional inks.
- A generic hero says "I build things". Changed to his own rule, set as the headline.
- Generic labels are uppercase mono eyebrows. Changed to Caveat margin marks that say which kind of claim the text is.
