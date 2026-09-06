# Advaita Chandra

A personal portfolio, public profile, and blog for Advaita Chandra.

## Visit the site

[advaitachandra.in](https://advaitachandra.in/)

The site includes:

- A profile and introduction
- Background, interests, and learning direction
- Selected projects and portfolio work
- Published writing
- Contact and social links

## Run locally

Requires Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

To create a production preview:

```bash
npm run build
npm run preview
```

To validate content before publishing:

```bash
npm run content:validate
npm test
```

## Architecture

The site runs on a **Supabase-backed Hybrid SSG/CSR architecture**:
- **Public Site**: Fast, client-side rendered React application with pre-rendered static HTML routes and `sitemap.xml` generated at build time (`scripts/prerender.js`).
- **Data Layer**: Live content is loaded from Supabase Postgres (`site_content` table). If the remote database is unreachable or the visitor is offline, the site instantly falls back to bundled static seed data (`src/data/*.json`).
- **Admin Workspace (`/admin`)**: Content editorial dashboard authenticated via Supabase Auth with Postgres Row-Level Security (RLS). Mutations write directly to Supabase and reflect live without requiring a full site rebuild.

## Deployment

The site is hosted on **Vercel** with custom domain routing (`advaitachandra.in`).
- Pushes to the `main` branch trigger Vercel's build pipeline (`npm run build`).
- Build output consists of compiled Vite chunks in `dist/` alongside pre-rendered static HTML entries for each public route.
- SPA fallback rewrites are configured in `vercel.json`.

## Admin Panel

Access `/admin` on the live site or locally with `npm run dev`.
- Authentication is handled securely through Supabase Auth.
- Form mutations immediately persist to the Supabase database.
- Drafts and published items are managed with full epistemic labeling and live previews.

## Media

- Production images and photography uploads are stored in Supabase Storage (`images` bucket).
- Images are compressed client-side before upload via `browser-image-compression` to stay well within free-tier quotas.
- Core site brand assets and icons reside in `public/`.

## Content

This site is focused on learning in public: showing work clearly, separating evidence from interpretation, and being honest about limitations.

## License

The content belongs to the author. No reuse license is currently provided.
