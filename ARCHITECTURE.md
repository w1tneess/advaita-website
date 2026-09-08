# Architecture

This document is the canonical description of the current technical architecture of the website. It reflects what the codebase actually implements.

## 1. Core Technology Stack

- **Framework**: React 19 (`react`, `react-dom`) with Vite 6
- **Routing**: React Router v7 (`react-router`) in Single Page Application (SPA) mode
- **Styling**: Tailwind CSS v4 configured via `@theme` tokens in `src/index.css`
- **Animation & Motion**: Framer Motion with centralized variants and strict `prefers-reduced-motion` compliance
- **Smooth Scroll**: Lenis (`src/lib/smooth-scroll.js`)
- **Icons**: Lucide React
- **Hosting**: Vercel (static file serving with SPA fallback configured in `vercel.json`)
- **Backend / Database**: Supabase Postgres (`site_content` table), Supabase Auth, and Supabase Storage

## 2. Rendering Model

The website operates as a **Single Page Application (SPA)** using Client-Side Rendering (CSR) combined with a build-time **Head-Only Prerender** for SEO and social sharing tags.

### Build-Time Head-Only Prerender

Instead of running a Node SSR server or full Static Site Generation (SSG) of DOM trees, a custom post-build script (`scripts/prerender.js`) executes automatically during `npm run build`:
1. It queries route definitions from `src/config/nav.js` and fetches published blog post slugs from Supabase (falling back to `src/data/blog.json` if offline).
2. It generates route-specific static HTML shells for all known public routes (e.g., `dist/index.html`, `dist/about/index.html`, `dist/blog/index.html`, etc.).
3. Crucially, it **only injects `<head>` metadata** (page `<title>`, `<meta name="description">`, canonical URLs, Open Graph tags, Twitter cards, and JSON-LD structured data) between `<!--seo-->` markers in `index.html`.
4. It also generates `dist/sitemap.xml` and `dist/404.html`.

The build-time prerenderer **does not render the page body or DOM elements**. The static HTML files contain an empty mounting point:
```html
<div id="root"></div>
```

### Runtime Client-Side Rendering (CSR)

1. When a visitor or crawler requests a URL, Vercel serves the static `index.html` corresponding to that route path, immediately delivering the prerendered `<head>` tags.
2. The browser downloads and executes the JavaScript application bundle.
3. The React application boots, mounts the component tree into `<div id="root"></div>`, initializes providers (`ToastProvider`, `ContentProvider`, `ThemeProvider`), and renders the view.
4. Route transitions occur client-side without full page reloads via React Router.

### Architectural Tradeoffs and Crawler Limitations

This hybrid CSR + Head-Only Prerender design involves specific architectural tradeoffs:

- **Social Unfurling**: Social platform crawlers (Twitter/X, LinkedIn, Facebook, Discord, Slack) do not execute JavaScript. Because the Open Graph and Twitter Card tags are statically present in the `<head>` of each route's pre-rendered HTML shell, link unfurling and preview cards work without a server.
- **Search Engine Indexing**:
  - Google can render JavaScript, but JavaScript rendering is executed as a separate, deferred processing stage and is not equivalent to universal, immediate, or guaranteed indexing.
  - Non-JavaScript search engines, lightweight archivers, or crawlers that do not execute client-side scripts will receive the `<head>` metadata (title, description, JSON-LD), but will **not see or index the dynamically rendered application body** (such as blog posts, philosophy notes, project descriptions, or photography galleries).
  - This is not a resolved bug; it is a known tradeoff of choosing client-side rendering with static hosting rather than full server-side rendering (SSR) or full static HTML body generation (SSG).

## 3. Data Flow and Content Management

### Primary Content Source: Supabase

All site copy, projects, blog posts, photography metadata, and profile settings are stored remotely in Supabase Postgres as a single JSONB document in the `site_content` table (record `id = 'main'`).

1. **Read Path**: When the application mounts, `ContentProvider` (`src/lib/content.jsx`) calls `loadDocument()` (`src/lib/store.js`), which invokes `fetchContentFromSupabase()` (`src/lib/supabase/sync.js`). The query fetches `site_content.data` where `id = 'main'` with a 3.5-second timeout safeguard.
2. **Offline / Seed Fallback**: If Supabase is unconfigured, unreachable, or times out, the data layer automatically falls back to bundled seed JSON files (`src/data/*.json` aggregated via `src/data/seed.js`). The public site continues to render gracefully using this baseline content.
3. **Admin Editorial Interface (`/admin`)**:
   - The admin dashboard is secured by Supabase Auth (email/password).
   - Content mutations in the admin panel invoke `saveDocument()` which calls `saveContentToSupabase()`, updating `site_content` directly using Row-Level Security (RLS) policies.
   - Media uploads are compressed client-side (`browser-image-compression`) and uploaded directly to the public Supabase Storage bucket (`images`).

### Publishing Model & Data Freshness

Because content is fetched dynamically from Supabase upon client mount, content published through the `/admin` interface is architected to be readable by public visitors on page load without requiring a static site rebuild or Git commit. 

*Verification Status*: The code implementation is complete, but the live end-to-end publishing round trip (`/admin` auth → mutation save → fresh public read in another session) remains **IMPLEMENTED — LIVE ROUND-TRIP NOT INDEPENDENTLY VERIFIED** in this environment due to the absence of active administrative credentials.

## 4. Code Splitting & Performance

To preserve fast initial page loads despite dynamic client-side libraries, Vite is configured with aggressive chunking:
- **`index-[hash].js`**: Core application shell, React runtime, and router.
- **`framer-motion-[hash].js`**: Motion and animation libraries isolated into a separate chunk.
- **`supabase-[hash].js`**: Supabase client SDK (`@supabase/supabase-js`) isolated.
- **`AdminApp-[hash].js`**: The `/admin` route tree is completely lazy-loaded via `React.lazy()`. Visitors to public routes never download the admin bundle or its dependencies.
- **Public Route Preloading**: Public route bundles (`/about`, `/philosophy`, `/projects`, `/blog`, `/photography`, `/contact`) are registered for preloading on idle (`requestIdleCallback`) and pointer/focus events to ensure responsive route navigation.
