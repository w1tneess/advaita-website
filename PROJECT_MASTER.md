# advaitachandra.in — Master Project Instructions

This file is the source of truth for any AI agent (Antigravity, Claude Code, or 
otherwise) working on this codebase. Read this in full before making changes. 
When this file conflicts with `PROJECT_DOCUMENTATION.md` or any other doc, 
**this file wins** unless the owner says otherwise — documentation drifts, this 
file is actively maintained.

---

## 1. What this site is

A personal site for Advaita Chandra — Class 10 student, Berhampore, West Bengal. 
Purpose: portfolio, blog, and public thinking space. **Not** a commercial/service 
site, not a freelancer portfolio, not a brand.

**Tone**: intelligent, factual, curious, independent, approachable. A serious 
learner documenting real work and real thinking — not an expert, not performing 
seniority or achievement that doesn't exist yet.

**Sections**: Home, About, Philosophy, Photography, Projects, Blog, Contact.

---

## 2. Content rules — read before touching any copy

These exist because early passes on this site repeatedly produced generic, 
templated, AI-sounding copy. Do not repeat that.

- **Never generate placeholder personal content and present it as real.** If a 
  section needs the owner's actual opinion, memory, or specific fact, mark it 
  clearly (see "TODO/tracking" below) and leave it — do not fill the gap with 
  plausible-sounding generic prose.
- **No invented achievements, awards, publications, affiliations, testimonials, 
  review counts, or "Hire Me"-style commercial framing.** If a design reference 
  includes any of these, they get filtered out before implementation — flag it 
  to the owner instead of silently adopting it.
- **Ban these specific patterns in generated/edited copy:**
  - "It's not X, it's Y" / "This isn't about X — it's Y" negation-then-restatement
  - Meta-commentary that describes a section instead of containing real content 
    ("this is where I think out loud" instead of actually saying something)
  - Generic reassurance filler with no information ("I read everything, even if 
    the reply isn't instant")
  - Uniform sentence rhythm across unrelated sections (signal of templated text)
  - Self-aware disclaimers with no specific content behind them
  - Abstract nouns substituted for concrete ones where a real name/date/number/
    quote could exist instead
- **Specificity test**: every content block should contain at least one concrete 
  fact — a proper noun, number, date, direct quote, or named detail. A block with 
  zero concrete specifics is HOLLOW regardless of how well-written the sentences 
  are, and should be flagged, not polished.
- **TODO/tracking markers for incomplete content are load-bearing — do not delete 
  them as part of "cleanup."** A `_todo` field or `// TODO` comment marking 
  content as HOLLOW or PLACEHOLDER is tracking real outstanding work, not 
  clutter. If a cleanup pass would remove these, stop and confirm with the owner 
  first whether the underlying content has actually been replaced, or only the 
  marker is being deleted.
- Privacy: never display home address, phone number, school name/schedule, or 
  other sensitive personal info anywhere on the site.

---

## 3. Design system (current, as of last confirmed update)

- **Base**: dark mode default, navy/charcoal neutral surfaces.
- **Accent**: single decisive accent color, used consistently — do not introduce 
  competing accent colors. (Confirm current accent value in `index.css` `@theme` 
  tokens before assuming — this has changed during the project; check, don't 
  guess.)
- **Typography**: serif display headings (Playfair Display or confirmed current 
  equivalent) + sans body (Inter or confirmed current equivalent). Fluid type 
  scale via `clamp()`. Confident, larger-scale headings on section intros — not 
  timid/safe sizing.
- **Motion**: purposeful, restrained. Scroll-driven reveals, hover micro-
  interactions, smooth scroll (Lenis). Explicitly **not** cinematic/3D/WebGL/
  game-like motion — that direction was considered and rejected in favor of 
  staying editorial. `prefers-reduced-motion` must always be respected — never 
  regress this.
- **What NOT to add**: 3D/WebGL scenes, shaders, character mascots, AI chatbot 
  companions, testimonial carousels, review/rating displays.

---

## 4. Technical architecture — VERIFY, DO NOT ASSUME

This project's docs have drifted from reality multiple times. Before making any 
claim about the current architecture, check the actual code, not a doc file.

- **Canonical Architecture Specification**: For complete, current technical 
  implementation details, rendering strategy, crawler limitations, and data flow, 
  consult [`ARCHITECTURE.md`](file:///d:/Website/advaita-website/ARCHITECTURE.md). Detailed architecture belongs there, 
  not in this governance document.
- **Stack**: React 19 + Vite 6, React Router v7 (SPA mode), Tailwind CSS v4, 
  Framer Motion, Lenis, Lucide icons.
- **Hosting**: Vercel (migrated from GitHub Pages — confirm this is still 
  current, and that no doc still claims GitHub Pages).
- **Backend**: Supabase (Postgres + Auth + Storage), free tier.
- **Cost constraint: ₹0/month.** No paid tier, no billing enabled. Before using 
  any platform feature (e.g. Supabase Image Transformations, which is paid-tier 
  only), verify it's actually available on the free tier — don't assume.
- **Image pipeline**: client-side compression/resizing before upload (via 
  `browser-image-compression`), generating fixed-width variants (400/800/1600w) 
  stored directly in Supabase Storage — NOT via Supabase's paid on-the-fly 
  transformation endpoint.

---

## 5. Working standards for AI agents on this repo

These exist because of specific, repeated failures on this project: skipped 
verification steps reported as complete, a hallucinated dependency used to 
justify not fixing something, cosmetic fixes presented as root-cause fixes, and 
scope creep into features/aesthetics never actually approved.

- **Report actual evidence, not summaries.** "Build succeeded," "tests pass," 
  "performance improved" are not acceptable on their own — show the actual build 
  output, actual test results, actual before/after numbers (e.g. real Lighthouse 
  scores from a real deployed preview, not a local build with no real data 
  seeded).
- **Don't declare something fixed if it wasn't actually tested end-to-end.** If 
  a fix can't be verified in the current environment (e.g. a local Playwright/
  Lighthouse limitation), say so explicitly and specify what's needed to verify 
  — don't silently skip verification and report success anyway.
- **Distinguish masking a symptom from fixing a root cause.** E.g. `overflow-x: 
  hidden` on `body` hides a scroll symptom without finding which element 
  overflows — if you reach for a global suppressor, say so explicitly and flag 
  it as a temporary mask, not a fix, unless the actual offending element has 
  been identified and addressed.
- **Before deleting anything (files, dependencies, TODO/tracking markers, 
  content), confirm it is actually unused/obsolete via real verification** — 
  check build scripts, tests, and router wiring, not just a naive import search. 
  If a file is orphaned from routing/UI but otherwise complete and functional, 
  that's a "not yet wired in" flag, not "dead code" — treat differently.
- **Don't invent a technical justification for skipping something.** If asked 
  to fix or verify something and it turns out unnecessary, say plainly why, 
  citing what was actually checked — never assert a dependency, error, or 
  constraint that wasn't actually confirmed to exist.
- **Scope discipline**: don't adopt visual/content direction from a reference 
  image or site wholesale. Extract only the specific, approved elements; flag 
  anything in a reference that conflicts with Sections 1–3 of this file instead 
  of silently implementing it.
- **Before a significant architecture, hosting, or design-system change, confirm 
  the plan with the owner before writing code** — these changes are expensive 
  to reverse and this project has hit real cost/scope surprises before.
- **Keep this file and `PROJECT_DOCUMENTATION.md` in sync** — if a change makes 
  either file inaccurate, update it as part of the same change, not as a 
  follow-up.

---

## 6. Known open items (update as resolved)

- [ ] Confirm final content architecture: live Supabase writes vs. JSON+git-push 
      model — Architecture implemented; live round-trip not yet independently verified. 
      (Code implemented: Supabase Postgres `site_content` table row `main` writes via 
      `/admin`, client-side dynamic fetching with bundled JSON seed fallback, and static 
      head-only route prerendering at build time on Vercel via `scripts/prerender.js`. 
      Live round-trip mutation and read verification pending per Section 5 standards).
- [ ] Navigation from Home to another tab first-click reliability — Architecture 
      implemented; live interaction not yet independently verified. (Code implemented: 
      removed Framer Motion `mode="wait"` stall in `PublicLayout.jsx`, added eager 
      bundle preloading on idle/pointer/focus in `src/lib/preload.js`; unit tests pass; 
      interactive multi-page navigation test pending).
- [ ] Philosophy section reading notes (Krishnamurti, Camus, Dostoevsky, Ramana 
      Maharshi, Osho) — `notes: []` preserved empty in `src/data/philosophy.json` 
      until owner supplies real personal reading notes; auto-generated fake 
      notes strictly prohibited per Section 2.
- [x] Confirm final accent color decision — FINALIZED: Warm Stone / Copper 
      (`--color-accent: #c2956a` with `--color-accent-strong: #d4a87d`) in `src/index.css`.
- [x] Verify no remaining reference to GitHub Pages anywhere in docs, config 
      comments, or README badges after Vercel migration — COMPLETED. Verified 
      and eliminated across `src/data/projects.json`, `README.md`, 
      `PROJECT_DOCUMENTATION.md`, `scripts/prerender.js`, `src/pages/NotFound.jsx`, 
      `src/App.jsx`, `src/config/nav.js`, and `public/robots.txt`.
