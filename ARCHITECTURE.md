# Architecture

This document describes the final rendering strategy and architecture of the website.

## Rendering Model

The website operates as a pure **Single Page Application (SPA)** built with React 19 and Vite 6, using a highly optimized Client-Side Rendering (CSR) strategy paired with a build-time Head-Only Prerender.

### 1. Head-Only Prerender (Build Time)
Instead of relying on a complex SSR framework (like Next.js) or React Router's framework mode, we use a custom post-build script (`scripts/prerender.js`). 

During the Vite build process, this script dynamically evaluates our route definitions (from `src/config/nav.js`) and generates static `index.html` files for every route (e.g., `/dist/about/index.html`). 

Crucially, it **only injects the `<head>` metadata** (title, description, canonical URL, OG tags, Twitter cards, and JSON-LD). It does not render the body.

### 2. Client-Side Rendering (Runtime)
When a user or crawler visits a route, the static host (Vercel) immediately serves the route-specific `index.html` containing the prerendered SEO metadata. The browser then downloads the React bundle, boots the application, and mounts the UI into the empty `<div id="root"></div>`.

## Why this Architecture?

1. **SEO Perfection**: Googlebot has flawlessly executed JavaScript for over a decade. It queues the page, runs the bundle, and indexes the dynamic content.
2. **Social Unfurling**: Social media crawlers (Twitter, LinkedIn, Slack) do *not* execute JavaScript. Our head-only prerender perfectly serves them the static OG tags they require.
3. **Data Freshness**: Because the body is rendered client-side, any content published via the `/admin` interface is immediately visible to users without requiring a CI/CD build step.
4. **Maintenance Simplicity**: We avoid the massive overhead of full meta-frameworks, serverless cold starts, and complex hydration mismatches. The app remains 100% statically hosted.

## Data Flow & Fallback

The site fetches all content dynamically from a Supabase Postgres database.
If the database connection times out or fails, the data layer (`src/lib/sync.js` and `src/lib/content.jsx`) automatically and gracefully falls back to local JSON seed data (`src/data/*.json`). This ensures the public site remains highly available and never locks up due to network partitions.

## Code Splitting

Vite is configured to aggressively code-split the application to optimize load times:
- `index-[hash].js`: The core application shell.
- `framer-motion-[hash].js`: Animations are chunked separately.
- `supabase-[hash].js`: The heavy Supabase client is isolated.
- `AdminApp-[hash].js`: The entire `/admin` interface is lazy-loaded (`React.lazy`). Visitors to public routes never download the admin bundle.
