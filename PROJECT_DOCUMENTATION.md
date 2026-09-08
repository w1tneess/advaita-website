# Advaita Chandra - Comprehensive Project Documentation

## 1. Project Overview
This repository contains the source code for the personal website, portfolio, and public thinking space of Advaita Chandra. It is built as a fast, accessible, and responsive personal web property.

The site includes an integrated **Admin Panel (`/admin`)** powered by Supabase (Auth, Postgres, and Storage). Content is managed through this visual interface and stored remotely in a single JSONB document (`site_content`), with bundled static JSON files serving as fallback and seed data.

## 2. Technology Stack
- **Core Framework**: React 19 + Vite 6
- **Routing**: React Router v7 (SPA mode)
- **Styling**: Tailwind CSS v4 (`src/index.css`)
- **Animations & Interactions**: Framer Motion
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React
- **Content Database**: Supabase Postgres (`site_content` table, row `main`) with fallback to bundled flat JSON files (`src/data/*.json`)
- **Backend / Storage / Auth**: Supabase (`@supabase/supabase-js`)
- **Deployment**: Vercel (`advaitachandra.in`)

> For the canonical technical architecture specification, rendering model, crawler limitations, and data flow details, see [`ARCHITECTURE.md`](file:///d:/Website/advaita-website/ARCHITECTURE.md).

## 3. System Architecture Summary

The codebase provides two primary user-facing areas:

### 3.1 Public Site
- Built as a React 19 Single Page Application (SPA).
- **Build time**: `scripts/prerender.js` generates route-specific static HTML shells injecting only `<head>` metadata (title, description, OG/Twitter tags, JSON-LD) and generates `sitemap.xml`.
- **Runtime**: Rendered client-side (CSR) into `<div id="root"></div>`. Dynamic content loads from Supabase Postgres on mount with immediate fallback to bundled `src/data/*.json` seed files if unreachable or offline.

### 3.2 Admin Panel (`/admin`)
- Lazy-loaded via `React.lazy()` so public visitors never download admin bundles.
- Secured by Supabase Auth (email/password).
- Content updates persist to Supabase Postgres (`site_content` table, row `main`) via Row-Level Security (RLS) policies.
- Media uploads are compressed client-side via `browser-image-compression` and stored directly in the Supabase Storage `images` bucket.
- *Verification Status*: `IMPLEMENTED — LIVE ROUND-TRIP NOT INDEPENDENTLY VERIFIED`.

## 4. Directory Structure

```text
advaita-website/
├── public/                   # Static media, icons, robots.txt
├── scripts/                  # Build scripts (prerender.js, validate-content.js)
├── supabase/                 # Supabase schema definitions (schema.sql)
├── src/                      # Source code
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin-specific components & forms
│   │   ├── layout/           # Container, Header, Footer, Section, SkipLink
│   │   ├── meta/             # Seo, Icon
│   │   ├── ui/               # Core UI primitives (Button, Card, Modal, etc.)
│   │   └── ...
│   ├── config/               # App configuration (nav.js, site.js)
│   ├── data/                 # Seed database: JSON files (blog, projects, philosophy)
│   ├── hooks/                # Custom React hooks (useDerivedContent, useFilters)
│   ├── layouts/              # Layout wrappers (PublicLayout, AdminLayout)
│   ├── lib/                  # Utilities (animations, format, seo, store, supabase)
│   ├── pages/                # Route components (Home, About, Blog, etc.)
│   │   └── admin/            # AdminApp and 18 editor views
│   ├── App.jsx               # App shell and route configuration
│   ├── main.jsx              # React mounting entry point
│   └── index.css             # Design tokens and Tailwind directives
├── package.json              # Dependencies and scripts
├── vercel.json               # Vercel deployment rewrites
└── vite.config.js            # Vite build configuration
```

## 5. Development Workflow

### Prerequisites
- Node.js 20 or newer
- npm (Node Package Manager)

### Commands
- `npm run dev`: Starts the Vite development server (`http://localhost:5173`).
- `npm run build`: Compiles the application and runs the head-only prerenderer (`scripts/prerender.js`).
- `npm run preview`: Previews the production build locally.
- `npm run content:validate`: Validates seed JSON files against schema rules.
- `npm run lint`: Lints the codebase using ESLint.
- `npm test`: Runs automated test suite (`test/core.test.js`).

## 6. Content Management & Publishing

1. **Admin Updates (`/admin`)**: Authenticate and modify profile details, blog posts, philosophy notes, projects, or photography metadata. Changes save to Supabase Postgres. Because public visitors fetch content dynamically on client mount, updates are architected to appear without triggering a static code rebuild. (*Status: IMPLEMENTED — LIVE ROUND-TRIP NOT INDEPENDENTLY VERIFIED*).
2. **Media Uploads**: Images are compressed client-side via `browser-image-compression` and uploaded to the public Supabase Storage bucket (`images`).
3. **Seed / Code Changes**: When updating site components, design tokens, or bundled fallback seed data:
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push origin main
   ```
4. **Automated Deployment**: Pushes to `main` trigger automated builds on Vercel (`npm run build`), producing static assets, route-specific `<head>` metadata, and updated sitemaps.

## 7. Key Features & Integrations

- **Seo Component & Head-Only Prerender**: Injects route-specific `<head>` metadata for social unfurling and crawler discovery. See [`ARCHITECTURE.md`](file:///d:/Website/advaita-website/ARCHITECTURE.md) for limitations regarding dynamic body content.
- **Supabase Data Layer**: Primary backend integration (`src/lib/supabase/`) providing Postgres JSONB content persistence, Auth session management, and image storage, with automatic fallback to bundled JSON if offline.
- **Lenis Smooth Scroll**: Found in `src/lib/smooth-scroll.js`, handles smooth vertical page scrolling.
- **Framer Motion Centralization**: Centralized easing and animation variants (`src/lib/animations.js`) with OS `prefers-reduced-motion` compliance.
- **Route Preloading**: Found in `src/lib/preload.js`, preloads route bundles on idle and pointer/focus events for responsive navigation.

## 8. Extensibility
To add or modify data models:
1. Update schema definitions in `src/lib/schema.js` and document migrations in `src/lib/store.js` if the document shape changes.
2. Update seed defaults in `src/data/seed.js` or the corresponding JSON file in `src/data/`.
3. Wire page components in `src/pages/` and register routes in `src/config/nav.js` and `src/App.jsx`.
4. Update the corresponding editor in `src/pages/admin/` to allow editing the new fields.

## 9. Design System & Styling

- **Tailwind CSS v4**: Utility-driven styling configured in `src/index.css` via the `@theme` directive.
- **Color Palette**: Dark mode default with light mode toggle.
  - Base neutrals: `--color-canvas`, `--color-surface`, `--color-raised`.
  - Accent color: **Warm Stone / Copper** (`--color-accent: #c2956a`, `--color-accent-strong: #d4a87d`).
  - Epistemic markers: `--color-fact`, `--color-analysis`, `--color-opinion`, `--color-limitation`.
- **Typography**: Responsive typography powered by `clamp()` fluid type scaling.
  - Headings: Playfair Display (Serif)
  - Body: Inter (Sans)
- **Reduced Motion Support**: `src/index.css` and Framer Motion's `MotionConfig` strictly respect `prefers-reduced-motion: reduce`.

## 10. Code Conventions

- **Alias Imports**: `vite.config.js` configures `@/` mapped to `src/`.
- **Admin Code Splitting**: The admin panel is code-split and lazy-loaded via `React.lazy()` to ensure editorial dependencies never impact public bundle sizes.
- **Pure Helpers**: Formatting and schema validation routines are kept pure and independently testable in `src/lib/format.js` and `src/lib/schema.js`.
