# Architecture Audit — advaitachandra.in

> Audit date: 2026-09-06  
> Auditor: Antigravity IDE (Claude Opus 4.6)  
> Scope: Full repository inspection per the 48-point specification

---

## 1. Current Architecture

### High-Level Overview

The site is a **React 19 SPA** built with Vite 6, Tailwind CSS v4, Framer Motion, and Lenis smooth scrolling. Content is stored as a **single JSONB document** in a Supabase `site_content` table (row id `main`), with bundled JSON files as seed/fallback. The admin panel uses Supabase Auth (email/password) and is code-split into its own chunk.

### Data Flow

```
Supabase (site_content.data) → loadDocument() → ContentProvider → useContent() → Pages
           ↓ fallback
    src/data/*.json (seed)
```

### Key Design Decisions (Already Working Well)

- **Single-document content model** — avoids complex relational queries; the entire site's content is one atomic JSON blob
- **Seed fallback** — the site renders meaningful content even if Supabase is unreachable
- **Schema migrations** — versioned migrations in `store.js` carry forward content across shape changes
- **Content validation** — `schema.js` has thorough entity validators and a document-level structural check
- **Prerendering** — each public route gets its own `index.html` with correct `<title>`, description, OG tags
- **Admin code-splitting** — the 243 KB admin chunk is never downloaded by visitors
- **MotionConfig reducedMotion="user"** — Framer Motion respects OS preference
- **CSS reduced-motion** — all animations and the grain texture are disabled for `prefers-reduced-motion`
- **Skip link, focus-visible, semantic HTML** — basic a11y foundations are in place
- **RLS policies** — public read, authenticated write; contact form inserts as anon
- **Theme system** — dark/light with custom accent color, persisted to localStorage
- **Timeout safeguard** — 3.5s timeout on Supabase fetch prevents app hangs

### Architecture Map

```
src/
├── App.jsx              — Route table (BrowserRouter, lazy routes)
├── main.jsx             — Provider tree: Toast → Content → Theme → App
├── index.css            — Full design system (Tailwind v4 @theme)
├── config/
│   ├── nav.js           — Route table (SSR-safe, no React)
│   └── site.js          — SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE
├── data/
│   ├── seed.js          — Creates seed doc from JSON files
│   └── *.json           — 12 seed data files
├── lib/
│   ├── content.jsx      — ContentProvider (context + mutations)
│   ├── store.js         — Load/save/migrate/import/export
│   ├── schema.js        — Validators, factories, vocabularies
│   ├── seo.js           — buildMeta(), renderMetaTags()
│   ├── routes.js        — Re-exports from config/*
│   ├── format.js        — Date, reading time, search, sort
│   ├── image.js         — srcset generation from variants
│   ├── animations.js    — Framer Motion presets
│   ├── smooth-scroll.js — Lenis wrapper
│   ├── theme.jsx        — ThemeProvider
│   ├── toast.jsx        — Toast system
│   └── supabase/
│       ├── client.js    — createClient, isSupabaseConfigured
│       ├── sync.js      — fetch/save/clear content
│       └── api.js       — Contact form, image upload/delete
├── hooks/               — 7 custom hooks
├── layouts/
│   ├── PublicLayout.jsx  — Header/Footer/Scroll/Suspense wrapper
│   └── AdminLayout.jsx   — Sidebar/Header/Footer admin shell
├── pages/
│   ├── 11 public pages   — Home, About, Blog, etc.
│   └── admin/
│       ├── AdminApp.jsx   — Admin router (19 editor screens)
│       └── 18 editors     — Dashboard, ProfileEditor, etc.
└── components/
    ├── ui/              — 22 reusable UI components
    ├── layout/          — Container, Header, Footer, Section, SkipLink
    ├── meta/            — Seo, Icon
    ├── features/        — InterestCard, ProjectCard, SearchInput, ThinkerCard
    ├── admin/           — 13 admin components + forms/ + feedback/
    ├── FilterBar.jsx    — Standalone (should be in ui/)
    ├── ProjectCard.jsx  — Standalone duplicate (should use features/)
    └── 7 re-export shims — Button.jsx, Seo.jsx, etc.
```

---

## 2. Problems Discovered

### Critical

| # | Problem | Details |
|---|---------|---------|
| C1 | **`.env.example` contains real Supabase credentials** | [`.env.example`](file:///d:/Website/advaita-website/.env.example) contains the actual Supabase URL and anon key. While the anon key is designed for public use, `.env.example` conventionally contains _placeholder_ values. This is confusing and violates the principle of least surprise. |
| C2 | **Duplicate `<title>` in prerendered HTML** | The prerendered pages have TWO `<title>` tags — one from the original `index.html` template (line 6: `Advaita Chandra`) and one injected by prerender (line 8: `About — Advaita Chandra`). Browsers use the _last_ `<title>`, but this is technically invalid HTML and some crawlers may use the first. |
| C3 | **`/portfolio` route is not pre-rendered** | The route exists in `App.jsx` but is NOT in `PUBLIC_ROUTES` in `nav.js`, so it has no pre-rendered HTML, no sitemap entry, and no SEO metadata baked in. It's a functional page with `<Seo>` but searches for `ROUTE` with key `'portfolio'` which returns `undefined`. |

### High

| # | Problem | Details |
|---|---------|---------|
| H1 | **No `Suspense` boundary for public routes** | Public pages are `lazy()`-loaded in `App.jsx` but the `<Suspense>` wrapper is inside `PublicLayout`, not around each `<Route>`. If a lazy chunk fails to load, the entire layout including Header/Footer crashes rather than showing a per-page fallback. This is partially mitigated by the top-level `<ErrorBoundary>`. |
| H2 | **`ErrorBoundary` has no recovery mechanism** | The error boundary shows a static "Something went wrong" message with no retry button, no navigation, and no way back except a full page reload. |
| H3 | **ESLint `react.version` set to `18.3` but React 19 is installed** | `eslint.config.js` line 20: `react: { version: '18.3' }`. The actual dependency is `^19.0.0`. This can cause false positives/negatives for React hooks rules. |
| H4 | **`social` accessed directly in Home.jsx hero** | `useContent()` returns `social` from `content.social`, but the derived `publicSocialLinks` is the filtered version. The hero section manually filters `social?.filter(s => s.visible && s.kind === 'link')` — this duplicates the filtering logic in `useDerivedContent`. |
| H5 | **BlogPost.jsx uses `<Navigate to="/404">` for missing posts** | This changes the URL to `/404`, losing the original URL the user typed. Should render `<NotFound />` inline without changing the URL, so the user can correct their URL or share it for debugging. |
| H6 | **`allPrerenderRoutes()` blog posts have no title/description** | Pre-rendered blog route entries only include `path`, `changefreq`, `priority` — no `title` or `description`. This means the prerendered `<title>` and `<meta description>` for blog posts will be empty or fallback to site defaults. |
| H7 | **Main bundle is 691 KB (207 KB gzip)** | The main `index-*.js` chunk is large. It includes React, React DOM, React Router, Framer Motion, Supabase, Lenis, and Lucide React all in one chunk. Some of these could benefit from manual chunking. |
| H8 | **`Portfolio.jsx` imports from old paths** | Uses `../components/Button.jsx`, `../components/Container.jsx`, `../components/Seo.jsx` etc. — the root-level re-export shims. These work but are vestiges of a migration and create confusing import paths. |

### Medium

| # | Problem | Details |
|---|---------|---------|
| M1 | **No structured data beyond basic Person/BlogPosting** | The `<Seo>` component emits JSON-LD but uses a single `Person` type for all non-article pages. Missing: `WebSite`, `WebPage`, `BreadcrumbList`, `ImageGallery`. |
| M2 | **OG image is an SVG placeholder** | `og-placeholder.svg` is used for all pages. Social platforms may not render SVG correctly. Should be a raster image (PNG/JPG, 1200×630). |
| M3 | **`portfolio` route is not in `NAV_ITEMS`** | `/portfolio` exists as a route but has `nav: false` (it's not in `PUBLIC_ROUTES` at all). This creates an orphan page — not linked from navigation, not in sitemap. |
| M4 | **Re-export shim files at `components/` root** | 7 files (`Button.jsx`, `Seo.jsx`, `SkipLink.jsx`, `Card.jsx`, `Container.jsx`, `EmptyState.jsx`, `StatusBadge.jsx`) exist only as `export { default } from './ui/X.jsx'`. These are migration artifacts that add indirection. |
| M5 | **`isLocal` state naming is inverted** | In `content.jsx` line 88: `setIsLocal(state.source === 'remote')`. The variable name `isLocal` is set to `true` when the source is `remote`. This is semantically backwards and confusing. |
| M6 | **Both `react` and `react-router-dom` in dependencies** | `package.json` has both `react-router` and `react-router-dom`. In React Router v7, `react-router` subsumes `react-router-dom`. The `BrowserRouter` import in `App.jsx` actually comes from `react-router`, but `react-router-dom` is still listed as a dependency. |
| M7 | **Both `@vitejs/plugin-react` and `@vitejs/plugin-react-swc` installed** | Only one should be used. `vite.config.js` uses `@vitejs/plugin-react` (Babel). The SWC variant is unused but installed. |
| M8 | **Google Fonts loaded with 5 weight variants** | `Inter:wght@400;500;600;700;800` and `Playfair Display` with 4 weights + italic. This is ~200KB of font data. Weight 800 appears unused in the codebase. |
| M9 | **`cmdk` installed but used in admin only** | The `cmdk` (command palette) package is in main dependencies. It's only used in `CommandPalette.jsx` inside the admin panel. It should be in the admin chunk only (which it likely is due to lazy loading, but it's still a main dependency). |
| M10 | **`body::before` grain texture at z-index 9999** | The grain overlay sits at the highest z-index in the app. While `pointer-events: none` prevents interaction issues, it can interfere with DevTools element picking and may mask real z-index issues. |
| M11 | **No `font-display` attribute on Google Fonts** | The Google Fonts URL includes `&display=swap` which is correct, but there's no `font-display` CSS override. This is actually fine — `display=swap` in the URL parameter handles it. _No action needed_. |
| M12 | **Contact form has no client-side rate limiting** | The `ContactForm` component submits directly to Supabase with no throttle or cooldown. A bot could spam submissions. |

### Low

| # | Problem | Details |
|---|---------|---------|
| L1 | **`scripts/` contains 5 unused lint-fix scripts** | `fix-imports.js`, `fix-lint.js`, `fix-lint.cjs`, `fix-lint-2.cjs`, `fix-lint-3.cjs`, `migrate-config.js` — one-off migration scripts that should be cleaned up. |
| L2 | **`rembg_env/` directory exists at root** | A Python virtual environment for background removal. Not part of the web app and shouldn't be in the repo root. |
| L3 | **`_redirects` file in `public/`** | Contains `/* /index.html 200` — this is a Netlify-specific redirect. The site deploys to Vercel, making this file unnecessary. |
| L4 | **`.nojekyll` in `public/`** | GitHub Pages specific. Not needed for Vercel. |
| L5 | **`llms.txt` in `public/`** | An AI-focused metadata file. Not harmful but niche. |
| L6 | **Test imports `imageProcessor.js`** | The test file imports `generateImageVariants` from `src/lib/imageProcessor.js`. This module exists but is a thin wrapper around `browser-image-compression`. The test correctly handles the null case. |
| L7 | **`CNAME` file at root** | Contains `advaitachandra.in`. This is a GitHub Pages artifact. Vercel uses its own domain configuration. |

---

## 3. Technical Debt

| Area | Debt |
|------|------|
| **Import paths** | Mix of `@/` alias imports and relative `../` imports across the same codebase |
| **Re-export shims** | 7 files exist solely to re-export from subdirectories |
| **Dual router packages** | `react-router` + `react-router-dom` both in `package.json` |
| **Dual React plugins** | `@vitejs/plugin-react` + `@vitejs/plugin-react-swc` both installed |
| **Legacy hosting artifacts** | `CNAME`, `.nojekyll`, `_redirects` — all for GitHub Pages/Netlify, not Vercel |
| **Script graveyard** | 5 one-off lint-fix scripts in `scripts/` |
| **`rembg_env/`** | Python venv in repo root |
| **`isLocal` naming** | Boolean is inverted from its name |

---

## 4. SEO Problems

| # | Problem | Severity |
|---|---------|----------|
| S1 | **Duplicate `<title>` in prerendered HTML** | Critical |
| S2 | **`/portfolio` not indexed, no SEO, no sitemap entry** | High |
| S3 | **Blog post prerendered pages lack title/description** | High |
| S4 | **OG image is SVG (not reliably rendered by social platforms)** | Medium |
| S5 | **No `WebSite` or `WebPage` JSON-LD** | Medium |
| S6 | **No `BreadcrumbList` structured data** | Medium |
| S7 | **Article JSON-LD missing `image` field** | Low |
| S8 | **No `datePublished`/`dateModified` passed to Seo from BlogPost** | Medium |

---

## 5. Performance Problems

| # | Problem | Impact |
|---|---------|--------|
| P1 | **Main JS bundle 691 KB** | Large initial download; Framer Motion alone is ~150 KB |
| P2 | **5 font weights loaded for Inter** | Weight 800 appears unused |
| P3 | **Hero portrait lacks `width`/`height` attributes** | Causes CLS until the image loads |
| P4 | **`body::before` grain texture runs continuously** | Renders a full-viewport SVG filter on every repaint |
| P5 | **Lenis runs a continuous `requestAnimationFrame` loop** | Constant JS execution even when idle |
| P6 | **All photography images lack explicit dimensions** | CLS on the photography masonry grid |

---

## 6. Loading / State-Management Problems

| # | Problem |
|---|---------|
| LS1 | Content provider shows only `"Loading..."` text with `animate-pulse` — no skeleton, no minimum dimensions |
| LS2 | `PageFallback` component is minimal — just a small spinner area that doesn't match page dimensions |
| LS3 | Blog post 404 redirects via `<Navigate>` rather than rendering inline |
| LS4 | No loading states differentiate between "no data yet" vs "error" vs "empty collection" |

---

## 7. Routing Problems

| # | Problem |
|---|---------|
| R1 | `/portfolio` exists but is not pre-rendered, not in sitemap, not in nav — orphan page |
| R2 | `/portfolio` and `/projects` appear to serve overlapping purposes |
| R3 | `BlogPost` navigates to `/404` for unknown slugs — should render 404 content at the current URL |
| R4 | Vercel catch-all rewrite `/(.*) → /index.html` may override pre-rendered route-specific HTML depending on Vercel's precedence rules |

---

## 8. Admin / CMS Problems

| # | Problem |
|---|---------|
| A1 | `AdminApp.jsx` imports `Button` from `../../components/Button.jsx` (re-export shim) |
| A2 | No unsaved-change warning when navigating away from editors with modified content |
| A3 | `rememberMe` checkbox on login screen has no effect — Supabase handles session persistence |
| A4 | No upload progress indicator for photography images |
| A5 | Admin dashboard shows activity log but no quick-action buttons for common tasks |

---

## 9. Supabase / Data Problems

| # | Problem |
|---|---------|
| D1 | `isLocal` state flag naming is inverted (set to `true` when source is `'remote'`) |
| D2 | `loadDocument()` throws on Supabase error, caught by `ContentProvider` which toasts — but the toast doesn't distinguish network vs. auth vs. permission failures |
| D3 | No retry mechanism when Supabase fetch fails on initial load |
| D4 | Supabase fetch timeout resolves with `null` data, making it indistinguishable from "no content saved yet" |

---

## 10. Accessibility Problems

| # | Problem |
|---|---------|
| A11y-1 | Hero portrait `<img>` lacks `width` and `height` for CLS prevention |
| A11y-2 | Photography masonry items use `role="button"` on `<figure>` — should use `<button>` wrapping or `role` with proper key handling (key handling IS implemented) |
| A11y-3 | `ErrorBoundary` fallback has no navigation or retry — screen reader users are stranded |
| A11y-4 | Mobile menu focus trap uses `setTimeout(100ms)` — timing-dependent, may not work reliably |
| A11y-5 | Lightbox keyboard navigation not audited (would need runtime check) |

---

## 11. Responsive / Device Problems

| # | Problem |
|---|---------|
| RD1 | Hero section uses custom CSS (`HeroSection.css`) with absolute positioning — needs verification at 320px |
| RD2 | Admin panel sidebar uses fixed-width layout that may overflow on small tablets |
| RD3 | Blog post content uses `whitespace-pre-wrap` which may cause horizontal overflow with long code/URLs |

---

## 12. Security Concerns

| # | Concern | Severity |
|---|---------|----------|
| SEC1 | `.env.example` contains real Supabase anon key | Medium (anon key is public by design, but this violates convention) |
| SEC2 | No CSRF protection on contact form (mitigated by Supabase RLS) | Low |
| SEC3 | `dangerouslySetInnerHTML` not detected — content is rendered as text nodes, which is correct | ✅ Good |
| SEC4 | Admin auth uses only Supabase email/password — no MFA | Low (acceptable for personal site) |
| SEC5 | RLS policies are appropriate: public SELECT, authenticated ALL | ✅ Good |
| SEC6 | Storage bucket is public — images are accessible to anyone | ✅ By design |
| SEC7 | No service-role key in client-side code | ✅ Good |

---

## 13. Build / Deployment Problems

| # | Problem |
|---|---------|
| B1 | `npm run lint` command in `package.json` uses `--ext js,jsx` which is an ESLint v8 flag; ESLint v9 with flat config ignores `--ext`. Lint currently passes but may not catch all files. |
| B2 | `Vercel.json` catch-all rewrite may override pre-rendered static HTML files |
| B3 | No production build validation script — `npm run build` succeeds but doesn't verify the output HTML |

---

## 14. Recommended Changes

### R1: Fix Duplicate `<title>` in Prerendered HTML

- **Current**: `index.html` has `<title>Advaita Chandra</title>` before the SEO markers
- **Problem**: Prerender injects a second `<title>` inside the markers, creating duplicate titles
- **Solution**: Remove the static `<title>` from `index.html` — it serves no purpose because the prerender and the React `<Seo>` component both set it
- **Files**: [`index.html`](file:///d:/Website/advaita-website/index.html)
- **Risk**: Low

### R2: Fix Blog Post Prerender Metadata

- **Current**: `allPrerenderRoutes()` generates blog entries with only `path`, `changefreq`, `priority`
- **Problem**: No `title` or `description` → empty metadata in prerendered HTML
- **Solution**: Pass `title` and `description` from the blog post data in `allPrerenderRoutes()`
- **Files**: [`config/nav.js`](file:///d:/Website/advaita-website/src/config/nav.js), [`scripts/prerender.js`](file:///d:/Website/advaita-website/scripts/prerender.js)
- **Risk**: Low

### R3: Resolve `/portfolio` vs `/projects` Overlap

- **Current**: Two routes serve similar content — `/projects` is a simple list, `/portfolio` adds category filtering
- **Problem**: `/portfolio` is an orphan page (no nav, no sitemap, no prerender)
- **Solution**: Either add `/portfolio` to `PUBLIC_ROUTES` or merge its filtering into `/projects` and redirect `/portfolio` → `/projects`
- **Files**: [`config/nav.js`](file:///d:/Website/advaita-website/src/config/nav.js), [`App.jsx`](file:///d:/Website/advaita-website/src/App.jsx)
- **Risk**: Medium (requires user decision)

### R4: Fix BlogPost 404 Behavior

- **Current**: `<Navigate to="/404" replace />` — changes URL
- **Problem**: Loses the original URL; user can't see what they mistyped
- **Solution**: Render `<NotFound />` inline without navigation
- **Files**: [`pages/BlogPost.jsx`](file:///d:/Website/advaita-website/src/pages/BlogPost.jsx)
- **Risk**: Low

### R5: Improve ErrorBoundary

- **Current**: Static "Something went wrong" with no actions
- **Solution**: Add "Go home" and "Reload page" buttons, show the error message in development
- **Files**: [`components/ui/ErrorBoundary.jsx`](file:///d:/Website/advaita-website/src/components/ui/ErrorBoundary.jsx)
- **Risk**: Low

### R6: Fix ESLint React Version

- **Current**: `react: { version: '18.3' }`
- **Solution**: Change to `react: { version: 'detect' }`
- **Files**: [`eslint.config.js`](file:///d:/Website/advaita-website/eslint.config.js)
- **Risk**: Very low

### R7: Generate Proper OG Image

- **Current**: SVG placeholder
- **Solution**: Generate a 1200×630 PNG/JPG OG image
- **Files**: `public/og-image.png`, [`config/site.js`](file:///d:/Website/advaita-website/src/config/site.js)
- **Risk**: Low

### R8: Add Structured Data

- **Current**: Basic `Person` on all pages, `BlogPosting` on articles
- **Solution**: Add `WebSite` (home), `WebPage` (all pages), `BreadcrumbList` (where breadcrumbs exist)
- **Files**: [`components/meta/Seo.jsx`](file:///d:/Website/advaita-website/src/components/meta/Seo.jsx)
- **Risk**: Low

### R9: Clean Up Dependencies

- **Solution**: Remove `react-router-dom` (subsumed by `react-router` v7), remove `@vitejs/plugin-react-swc` (unused)
- **Files**: [`package.json`](file:///d:/Website/advaita-website/package.json)
- **Risk**: Low (test after removal)

### R10: Clean Up Legacy Files

- **Solution**: Remove `CNAME`, `.nojekyll`, `_redirects`, unused lint scripts, `rembg_env/` reference
- **Risk**: Very low

### R11: Add `width`/`height` to Hero Image

- **Current**: `<img src="/pfp.png" ...>` with no dimensions
- **Solution**: Add width/height attributes or CSS `aspect-ratio`
- **Files**: [`pages/Home.jsx`](file:///d:/Website/advaita-website/src/pages/Home.jsx)
- **Risk**: Very low

### R12: Fix `isLocal` Naming

- **Current**: `setIsLocal(state.source === 'remote')` — inverted
- **Solution**: Rename to `isRemote` or invert the condition
- **Files**: [`lib/content.jsx`](file:///d:/Website/advaita-website/src/lib/content.jsx)
- **Risk**: Low (internal state, not exposed API)

### R13: Pass `publishedAt` / `updatedAt` to BlogPost Seo

- **Current**: BlogPost `<Seo>` doesn't pass date props
- **Solution**: Pass `publishedAt={post.published_at}` and `updatedAt={post.updated_at}`
- **Files**: [`pages/BlogPost.jsx`](file:///d:/Website/advaita-website/src/pages/BlogPost.jsx)
- **Risk**: Very low

### R14: Clean Up Re-Export Shims

- **Solution**: Update all imports to use canonical paths (`components/ui/Button`, `components/meta/Seo`, etc.) and remove the 7 shim files
- **Files**: Multiple
- **Risk**: Medium (many files affected, but purely mechanical)

---

## 15. Validation Results

| Command | Result |
|---------|--------|
| `npm run content:validate` | ✅ Passed |
| `npm run lint` (via `npx eslint`) | ✅ Passed (0 warnings, 0 errors) |
| `npx vite build` | ✅ Passed (built in 4.02s) |
| `node scripts/prerender.js` | ✅ Passed (7 routes + 404 + sitemap) |
| `node --test` | ✅ Passed (10/10 tests) |

---

## 16. What Is Working Well

> [!TIP]
> The following systems are **well-designed and should not be rewritten**:

1. **Content store architecture** — single-document model with seed fallback, schema migrations, validation
2. **SEO metadata pipeline** — shared `buildMeta()` between React component and prerender script
3. **Admin code splitting** — visitors never download admin code
4. **Theme system** — dark/light with custom accent, localStorage persistence
5. **Design system** — comprehensive Tailwind v4 `@theme` tokens with proper contrast ratios
6. **Validation system** — thorough entity validators with composable rules
7. **Animation system** — well-organized presets with reduced-motion support
8. **Skip link and focus indicators** — proper accessibility foundations
9. **Mobile menu** — focus trapping, Escape handler, body scroll lock
10. **Supabase timeout** — prevents app hangs on network issues
