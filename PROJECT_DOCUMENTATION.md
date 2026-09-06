# Advaita Chandra - Comprehensive Project Documentation

## 1. Project Overview
This repository contains the source code for a complete personal portfolio, public profile, and blog for Advaita Chandra. It is designed to be highly performant, visually engaging, and easily maintainable. 

A standout feature of this project is its built-in **local editorial workspace (Admin Panel)**. Rather than relying on a third-party Headless CMS, content is managed locally in the browser through a visual interface, stored in JSON files, and deployed statically.

## 2. Technology Stack
- **Core Framework**: React 19 + Vite 6
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Animations & Interactions**: Framer Motion
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React
- **Content Database**: Supabase Postgres (`site_content` table) with fallback to bundled flat JSON files (`src/data/*.json`)
- **Backend / Storage / Auth**: Supabase (`@supabase/supabase-js`)
- **Deployment**: Vercel (custom domain `advaitachandra.in`)

## 3. System Architecture
The application is bifurcated into two main experiences:

### 3.1 Public Site
The public-facing application is a highly optimized Static Site Generation (SSG) / Client-Side Rendered (CSR) hybrid:
- Data is dynamically loaded from Supabase Postgres on mount, with immediate fallback to bundled `src/data/*.json` seed files if offline or unreachable.
- At build time, `scripts/prerender.js` queries Supabase and pre-renders static HTML for all public routes alongside `sitemap.xml` for optimal SEO and crawler discovery.

### 3.2 Admin Panel (`/admin`)
The admin panel is an integrated editorial dashboard:
- **Authentication**: Secured with Supabase Auth.
- **Persistence**: Content updates write directly to Supabase (`site_content` table) via Row-Level Security (RLS) policies, reflecting immediately on the live public site without requiring manual code rebuilds.
- **Media**: Uploads are compressed client-side via `browser-image-compression` and stored in Supabase Storage (`images` bucket).

## 4. Directory Structure

```text
advaita-website/
├── public/                   # Static media, icons, and assets (served at root)
├── scripts/                  # Build scripts (prerender.js, validate-content.js)
├── supabase/                 # Supabase schema definitions (schema.sql)
├── src/                      # Source code
│   ├── components/           # Reusable UI components (Buttons, Cards, Badges)
│   │   ├── admin/            # Admin-specific components
│   │   ├── ui/               # Core UI primitive components
│   │   └── ...
│   ├── config/               # App-wide configuration values
│   ├── data/                 # Seed database: JSON files (blog, projects, skills)
│   ├── hooks/                # Custom React hooks (useFilters, useShortcuts)
│   ├── layouts/              # Layout wrappers (PublicLayout vs AdminLayout)
│   ├── lib/                  # Utilities (animations, seo, format, supabase sync)
│   ├── pages/                # Route entry components (Home, About, Blog, etc.)
│   ├── App.jsx               # App shell and routing configuration
│   ├── main.jsx              # React mounting entry point
│   └── index.css             # Global styles and Tailwind imports
├── package.json              # Dependencies and scripts
├── vercel.json               # Vercel deployment rewrites
└── vite.config.js            # Vite configuration
```

## 5. Development Workflow

### Prerequisites
- Node.js 20 or newer
- npm (Node Package Manager)

### Commands
- `npm run dev`: Starts the Vite development server (usually at `http://localhost:5173`).
- `npm run build`: Compiles the application and runs the custom prerenderer.
- `npm run preview`: Previews the production build locally.
- `npm run content:validate`: Checks the JSON files in `src/data/` for schema correctness.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run format`: Formats code via Prettier.
- `npm test`: Runs the automated test suite.

## 6. Content Management & Publishing

1. **Live Admin Updates**: Navigate to `/admin` on the live site or locally. Authenticate and make edits to pages, blog posts, or projects. Changes save immediately to Supabase and reflect live.
2. **Media Uploads**: Add photos in the photography or project editors. Images are automatically resized and compressed on the client before uploading to Supabase Storage.
3. **Code & Seed Updates**: When modifying site components, layouts, or baseline seed JSON:
   ```bash
   git add .
   git commit -m "Your descriptive commit message"
   git push origin main
   ```
4. **Automated Deployment**: Pushes to the `main` branch automatically trigger Vercel to build the project, pre-render all routes, and deploy to production at `advaitachandra.in`.

## 7. Key Features & Integrations

- **Seo.jsx & Prerendering**: Ensures meta tags, descriptions, and page titles are injected statically into the DOM so web crawlers index the site effectively.
- **useFilters / FilterBar**: Robust filtering system implemented in the portfolio and blog pages.
- **Lenis Smooth Scroll**: Found in `src/lib/smooth-scroll.js`, applies butter-smooth native-feeling scrolling across the application.
- **Framer Motion**: Complex page transitions, hover states, and revealing elements are implemented in `src/lib/animations.js` and wrapped within components.
- **Supabase Integration (Experimental/Sync)**: Found in `src/lib/supabase`, this provides potential remote synchronization of state or schema enforcement.

## 8. Extensibility
To add a new section to the site:
1. Define the schema and create a new JSON file in `src/data/`.
2. Map the data via a new page component in `src/pages/`.
3. Add the route in `App.jsx`.
4. (Optional) Create admin form fields to manage the new JSON file via the `/admin` interface.

## 9. Design System & Styling

The site employs an **"editorial and contemporary"** visual identity, combining classic typography with modern layout primitives.

- **Tailwind CSS v4**: Styling is strictly utility-driven using the newest version of Tailwind CSS, configured in `src/index.css` via the `@theme` directive.
- **Color Palette**: The site features distinct Dark (default) and Light mode themes.
  - Base surfaces use tailored neutral tokens (`--color-canvas`, `--color-surface`).
  - The accent identity is branded as **"Warm Stone / Oxidized Copper"** (`--color-accent` / `--color-accent-strong`).
  - The system also exposes "epistemic labels" (`--color-fact`, `--color-analysis`, `--color-opinion`, `--color-limitation`) for callouts and blog categorization.
- **Fluid Typography**: Responsive typography is powered by `clamp()` functions spanning from `--text-base` to `--text-6xl`, scaling smoothly between screen sizes without discrete breakpoints.
  - **Headings**: Playfair Display (Serif)
  - **Body**: Inter (Sans)

## 10. Animations & Interactions

Visual polish is a first-class feature of the project, built thoughtfully to maintain accessibility.

- **Framer Motion Centralization**: Common animation variants and easings (e.g., `EASE_OUT_EXPO`) are centrally maintained in `src/lib/animations.js`. This guarantees that transitions (like `pageLoadVariant`, `heroLine`, or `cardHover`) feel unified across all pages.
- **Scroll Effects**: Intersection observers tied to Framer Motion reveal sections fluidly as the user scrolls (`sectionReveal`, `imageReveal`).
- **Reduced Motion Support**: `index.css` actively respects the user's OS `prefers-reduced-motion` settings.
- **Lenis Integration**: The application bypasses harsh native scroll jumps in favor of Lenis, creating a highly tactile, continuous vertical scroll experience.

## 11. Code Conventions & Organization

- **Alias Imports**: The `vite.config.js` declares `@/` as an alias mapped to `src/`. For example, `import Button from '@/components/ui/Button'`.
- **Component Hierarchy**: Components are deliberately scoped into:
  - `@/components/ui`: Dumb/primitive visual components (Cards, Buttons).
  - `@/components/admin`: CMS-specific visual boundaries.
  - `@/pages`: High-level route entries.
- **Custom React Hooks**: Complex logic is extracted into pure hooks found in `src/hooks/`.
  - `useFilters.js`: Reusable sorting/filtering logic used for the Portfolio and Blog.
  - `useShortcuts.js`: Event listener wrappers for Admin keyboard commands.
  - `useDerivedContent.js`: Normalizing raw JSON into safely renderable structures.
- **Performance Profiling**: The Admin panel is code-split and lazy-loaded via `React.lazy()` to ensure that the heavy editorial interfaces are never pushed onto public end-users visiting the static site, conforming to the strict Vite chunk limits set in the build config.
