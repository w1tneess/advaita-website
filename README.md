# advaita-website

## What this is

A personal portfolio, public profile and blog for Advaita Chandra, built with React 19, Vite 6 and Tailwind CSS v4, plus a frontend-only demo admin panel at `/admin`. The whole thing is static: there is no server, no database and no user accounts. The published content lives as JSON files in `src/data/`, and the build emits a plain directory of HTML, CSS and JavaScript that is deployed to GitHub Pages at `advaitachandra.in`.

## Requirements

Node 20 or newer, and npm. Nothing else — no database, no CLI tooling, no accounts.

## Installation and local development

Install dependencies:

```bash
npm install
```

Start the dev server on http://localhost:5173 (set in `vite.config.js`; it does not open a browser for you):

```bash
npm run dev
```

Build to `dist/`. This runs `vite build` and then `node scripts/prerender.js`, which writes a per-route `index.html`, `404.html` and `sitemap.xml`, and rewrites the `Sitemap:` line in `dist/robots.txt`:

```bash
npm run build
```

Serve the built `dist/` locally to check the pre-rendered output:

```bash
npm run preview
```

The pre-render step can also be re-run on its own against an existing `dist/`:

```bash
npm run prerender
```

## Project structure

```
advaita-website/
├─ .github/
│  └─ workflows/
│     └─ deploy.yml               build + deploy on push to main; reads vars.BASE_PATH
├─ public/                        copied verbatim into dist/
│  ├─ .nojekyll
│  ├─ CNAME                       advaitachandra.in
│  ├─ favicon.svg
│  ├─ og-placeholder.svg
│  └─ robots.txt
├─ scripts/
│  └─ prerender.js                post-build per-route <head> injection + sitemap
├─ src/
│  ├─ components/                 public UI primitives and content blocks
│  │  ├─ Avatar.jsx
│  │  ├─ Badge.jsx
│  │  ├─ Button.jsx
│  │  ├─ Callout.jsx
│  │  ├─ Card.jsx
│  │  ├─ Container.jsx
│  │  ├─ EmptyState.jsx
│  │  ├─ EpistemicLegend.jsx
│  │  ├─ FilterBar.jsx
│  │  ├─ Footer.jsx
│  │  ├─ Header.jsx
│  │  ├─ Icon.jsx
│  │  ├─ InterestCard.jsx
│  │  ├─ PostCard.jsx
│  │  ├─ ProjectCard.jsx
│  │  ├─ Prose.jsx
│  │  ├─ ScrollToTop.jsx
│  │  ├─ SearchInput.jsx
│  │  ├─ Section.jsx
│  │  ├─ Seo.jsx
│  │  ├─ SkipLink.jsx
│  │  ├─ SourceList.jsx
│  │  ├─ StatusBadge.jsx
│  │  ├─ Tag.jsx
│  │  ├─ ThemeToggle.jsx
│  │  ├─ ToastViewport.jsx
│  │  └─ admin/                   UI used only by the admin panel
│  │     ├─ AdminHeader.jsx
│  │     ├─ AdminPage.jsx
│  │     ├─ AdminSidebar.jsx
│  │     ├─ BlockEditor.jsx
│  │     ├─ CollectionEditor.jsx
│  │     ├─ ConfirmDialog.jsx
│  │     ├─ DataTable.jsx
│  │     ├─ DemoBanner.jsx
│  │     ├─ Field.jsx
│  │     ├─ LocalOnlyNotice.jsx
│  │     ├─ PublishChecklist.jsx
│  │     ├─ ReorderList.jsx
│  │     ├─ RepeatableFields.jsx
│  │     └─ Toggle.jsx
│  ├─ data/                       the published content; the source of truth for the live site
│  │  ├─ categories.json
│  │  ├─ home.json
│  │  ├─ interests.json
│  │  ├─ posts.json
│  │  ├─ profile.json
│  │  ├─ projects.json
│  │  ├─ settings.json
│  │  ├─ skills.json
│  │  ├─ social.json
│  │  ├─ tags.json
│  │  ├─ timeline.json
│  │  └─ seed.js                  assembles the JSON into one document; SCHEMA_VERSION, SEED_VERSION
│  ├─ hooks/                      reusable stateful logic
│  │  ├─ useConfirm.jsx
│  │  ├─ useDebouncedValue.js
│  │  ├─ useFilters.js
│  │  ├─ useLocalStorage.js
│  │  └─ useSectionForm.js
│  ├─ layouts/                    page shells
│  │  ├─ AdminLayout.jsx
│  │  └─ PublicLayout.jsx
│  ├─ lib/                        non-visual logic: content store, schema, routes, SEO, theme
│  │  ├─ content.jsx
│  │  ├─ format.js
│  │  ├─ routes.js
│  │  ├─ schema.js
│  │  ├─ seo.js
│  │  ├─ store.js
│  │  ├─ theme.jsx
│  │  └─ toast.jsx
│  ├─ pages/                      one file per public route
│  │  ├─ About.jsx
│  │  ├─ Article.jsx
│  │  ├─ Blog.jsx
│  │  ├─ Contact.jsx
│  │  ├─ Home.jsx
│  │  ├─ NotFound.jsx
│  │  ├─ Portfolio.jsx
│  │  └─ admin/                   one file per admin route
│  │     ├─ AdminApp.jsx
│  │     ├─ Dashboard.jsx
│  │     ├─ DataManager.jsx
│  │     ├─ HomeEditor.jsx
│  │     ├─ PostEditor.jsx
│  │     ├─ PostsList.jsx
│  │     ├─ ProfileEditor.jsx
│  │     ├─ ProjectEditor.jsx
│  │     ├─ ProjectsList.jsx
│  │     ├─ SettingsEditor.jsx
│  │     ├─ SkillsEditor.jsx
│  │     ├─ SocialEditor.jsx
│  │     ├─ Taxonomy.jsx
│  │     └─ TimelineEditor.jsx
│  ├─ App.jsx                     route table; the admin panel is lazy-loaded here
│  ├─ index.css                   Tailwind entry, @theme design tokens, dark overrides
│  └─ main.jsx                    React root, provider composition
├─ index.html                     app shell; holds the <!--seo--> markers and the pre-paint theme script
├─ package.json
└─ vite.config.js                 base path resolution from BASE_PATH
```

Four deliberate deviations from the original plan:

- `src/components/ToastViewport.jsx` sits at the top level of `components/`, not in `components/admin/`. `ContentProvider` can raise a toast on any page — for example when the browser blocks localStorage — not only inside the admin panel, so the viewport is mounted once in `App.jsx`.
- There is no `/admin/preview` page. Preview is a `previewDrafts` toggle in the admin header that makes the real public pages include drafts, so what you preview is the actual page rather than a mock of it.
- Three admin components that were not in the original plan: `src/components/admin/CollectionEditor.jsx` (one shared add/edit/reorder/delete surface, used by interests, abilities, timeline, links, categories and tags), `src/components/admin/RepeatableFields.jsx` (`PairList` and `TextList` for repeating field rows), and `src/components/admin/BlockEditor.jsx` (the typed article-body editor).
- One hook that was not in the original plan: `src/hooks/useSectionForm.js`, which holds draft state for the whole-object sections — profile, home and settings — where there is no collection to edit item by item.

## Editing content

There are two routes, and only one of them changes the published site.

**Edit the JSON directly.** Open the files in `src/data/`, change them, and commit. This is what changes the live site: the deploy workflow builds from these files.

**Use the admin panel.** Go to `/admin`, make the edits there, then go to Import & export, download the JSON, replace the corresponding files in `src/data/`, and commit. Nothing in the admin panel reaches the live site until that commit happens.

The shape: `src/data/seed.js` imports the eleven JSON files and assembles them into one content document, adding `schemaVersion` and `seedVersion`. `schemaVersion` is bumped when the document shape changes (and a matching entry must be added to `MIGRATIONS` in `src/lib/store.js`, or existing local edits are discarded rather than upgraded); `seedVersion` is bumped when the seed content changes, which only shows a non-destructive notice in the admin panel.

Article bodies are arrays of typed blocks, not markdown. Every permitted block type is listed in `BLOCK_TYPES` in `src/lib/schema.js`: `heading`, `paragraph`, `list`, `quote`, `callout`, `code` and `image`. The `callout` block takes one of the variants in `CALLOUT_VARIANTS` — `fact`, `analysis`, `opinion`, `limitation`, `note` — which is how the site keeps sourced claims, inference and opinion visually separate.

`src/data/posts.json` ships as `[]`. The blog is intentionally empty and adding invented sample articles is explicitly not wanted; the public blog renders the `blogEmptyState` message from `src/data/settings.json` instead. If a placeholder is genuinely needed for a layout check, label it `[SAMPLE — REPLACE BEFORE PUBLISHING]` so it cannot be mistaken for real work.

## The admin panel

Reachable only by typing `/admin` into the address bar. It is not linked from any public page. `AdminLayout` renders `noindex, nofollow` on every admin page, the route is excluded from `sitemap.xml`, and `public/robots.txt` carries `Disallow: /admin`. None of that is access control — see the next section.

| Page | Path | What it does |
| --- | --- | --- |
| Dashboard | `/admin` | Counts of what is in the content document, plus the publish checklist. No analytics, because there is none to report. |
| Profile & interests | `/admin/profile` | Name, tagline, roles, location, biography, learning direction, the four-step approach, and the research interests list. |
| Home page | `/admin/home` | Hero text, section headings and the credibility statement on the front page. |
| Projects | `/admin/projects` | List, reorder, create, edit and delete portfolio entries; each has role, tools, methodology, status, limitations, `published` and `featured`. |
| Writing | `/admin/posts` | List and edit articles. The body is edited with `BlockEditor` as typed blocks. |
| Categories & tags | `/admin/taxonomy` | The three vocabularies behind the blog and portfolio filters: article categories, project categories and tags. |
| Abilities | `/admin/skills` | The grouped abilities list, each labelled `learning` or `working-knowledge`. |
| Timeline | `/admin/timeline` | The ordered learning-direction entries shown on the About page. |
| Contact & links | `/admin/social` | Email and social entries, each with a `visible` flag. Unset URLs render as placeholders. |
| Settings | `/admin/settings` | Default theme, accent colour, list limits, section visibility toggles, blog empty state, footer note and the contact-page text. |
| Import & export | `/admin/data` | Download the whole document as JSON, import a file or pasted JSON (validated before anything is replaced), and reset local edits. |

Publish and unpublish set a real content field that the public pages filter on: `published !== false` for projects, `status === 'published'` for articles, `visible !== false` for links. So flipping the toggle genuinely removes the item from the public page you are looking at.

Saving, though, writes only to that one browser's localStorage under the key `advaita-site.content.v1`. The read path never writes, so an ordinary visitor who never opens `/admin` always sees the freshly deployed JSON. localStorage holds the complete document rather than a patch — a deep merge over the seed cannot represent a deletion, so a deleted seeded item would come back on reload.

## Security warning

**Frontend-only admin panel. The password gate is not secure production authentication.**

The `/admin` route now requires a password. Configure the build-time `VITE_ADMIN_PASSWORD_HASH` variable with the SHA-256 hash of the password. Generate one locally with:

```bash
printf %s 'choose-a-password' | sha256sum | cut -d' ' -f1
```

For local development, export that hash before starting Vite:

```bash
export VITE_ADMIN_PASSWORD_HASH='paste-the-64-character-hash-here'
npm run dev
```

For GitHub Pages, add `VITE_ADMIN_PASSWORD_HASH` under repository **Settings -> Secrets and variables -> Actions -> Variables**. The password hash is embedded in the static JavaScript bundle, so anyone who can inspect the deployed site can attempt to recover the password. Use hosting-level authentication or a server-backed admin application when the content must actually be private.

The successful unlock is kept in `sessionStorage` for the current browser tab only. It is not stored with the content document.

localStorage is plain text and readable by any script running on the origin. Only public site content belongs in it.

Anyone who opens `/admin` edits their own browser's copy of the content and nothing else. They cannot change what other visitors see, they cannot reach a server, and they cannot write to this repository. Do not put private or sensitive information into any field.

## Deploying to GitHub Pages

1. Push the repository to GitHub on the `main` branch.
2. In the repository, go to Settings → Pages and set **Source** to **GitHub Actions**. Without this the workflow builds fine but the deploy step has nowhere to publish.
3. `.github/workflows/deploy.yml` then builds and deploys on every push to `main` (and on manual `workflow_dispatch`). It runs `npm ci`, then `npm run build` with `BASE_PATH: ${{ vars.BASE_PATH || '/' }}`, then uploads `dist/` and deploys it.

### Custom domain (advaitachandra.in)

`public/CNAME` already contains `advaitachandra.in`, and Vite copies it into `dist/` on every build. Deleting it would drop the custom domain on the next deploy. The base path stays `/`, so leave the `BASE_PATH` repository variable unset.

At the DNS provider, point the apex domain at GitHub's four Pages addresses with A records:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Then add a `CNAME` record for `www` pointing at `<username>.github.io`. Once GitHub has issued the certificate, tick **Enforce HTTPS** in Settings → Pages.

### Project page (https://&lt;username&gt;.github.io/&lt;repo&gt;/)

1. Set a repository **variable** named `BASE_PATH` to `/<repo>/`, with both a leading and a trailing slash, under Settings → Secrets and variables → Actions → **Variables** (not Secrets). Omitting either slash produces broken asset paths.
2. Delete `public/CNAME`.
3. Change `SITE_URL` in `src/lib/routes.js` to `https://<username>.github.io`, so canonical URLs, Open Graph URLs and the sitemap point at the real origin.

The local equivalent of the build the workflow runs:

```bash
BASE_PATH=/your-repo-name/ npm run build
```

Changing the GitHub username or repository name only affects those two values — `BASE_PATH` and `SITE_URL` — plus `public/CNAME`. Nothing else in the codebase hardcodes the origin or the base.

`public/.nojekyll` stops GitHub Pages running the output through Jekyll, which would otherwise drop files and directories whose names begin with an underscore.

## How the static host is worked around

GitHub Pages serves files; it has no routing, no rewrites and no server-side rendering. `scripts/prerender.js` closes the gap after `vite build`.

| Problem | How it is handled |
| --- | --- |
| Deep links (`/about`, `/blog/some-slug`) | A real `index.html` is written for every known route, each with its own `<title>`, description, canonical URL and Open Graph tags injected between the `<!--seo-->` markers in `index.html`. Published articles become routes via `allPrerenderRoutes()` in `src/lib/routes.js`. |
| Unknown paths | `dist/404.html` is written with `noindex` metadata. GitHub Pages serves it for any unmatched path, so it also acts as the SPA fallback: React Router then renders the real `NotFound` page for whatever URL was requested. |
| Asset paths at depth | The base is always absolute and always trailing-slashed (`resolveBase()` in `vite.config.js`, mirrored by `normaliseBase()` in the pre-render script). Never `./` — a relative base breaks in nested files such as `/about/index.html`. |
| Trailing slashes | GitHub Pages redirects `/about` to `/about/`. React Router matches both, so either form resolves to the same page. |
| Sitemap | `dist/sitemap.xml` is generated by the build from the route table plus the published articles, so it cannot drift. It is not hand-maintained. The `Sitemap:` line in `dist/robots.txt` is rewritten to match `SITE_URL` and the active base path. |

To be plain about what this is not: the pre-render injects per-route `<head>` metadata only. It is not server-side rendering. Every emitted file is the same app shell, and the body is still rendered by React on load. That is enough for correct status codes, correct crawler metadata and correct link previews, which is what the static host actually breaks.

## Design tokens and theming

All tokens are declared in the `@theme` block in `src/index.css`, with dark values overridden on `:root.dark`.

| Token | Light | Dark |
| --- | --- | --- |
| `--color-canvas` | `#f7f6f3` | `#0e1520` |
| `--color-surface` | `#ffffff` | `#151e2b` |
| `--color-raised` | `#f1efea` | `#1b2635` |
| `--color-ink` | `#14181f` | `#edf0f4` |
| `--color-muted` | `#4a5361` | `#9ba6b7` |
| `--color-line` | `#e3e0da` | `#243244` |
| `--color-accent` | `#0f6b73` | `#5fbfc9` |
| `--color-accent-strong` | `#0b545b` | `#8ad4dc` |
| `--color-on-accent` | `#ffffff` | `#08131a` |
| `--color-fact` | `#1d4e89` | `#7fb2e5` |
| `--color-analysis` | `#574a8c` | `#b4a7e0` |
| `--color-opinion` | `#7d5300` | `#e3b341` |
| `--color-limitation` | `#8c3b4a` | `#f0a3ae` |

Non-colour tokens: `--font-display`, `--font-sans`, `--font-mono`, `--container-prose` (`68ch`), `--radius-card` (`0.75rem`), `--shadow-subtle` and `--shadow-raised` (the two shadows also have dark overrides).

The page background token is `--color-canvas`, not `--color-base`, and the reason is worth knowing before adding a token of your own: in Tailwind v4 a `--color-base` token makes the `text-base` utility resolve to a **colour** instead of a font size, which silently paints every `text-base` heading in the page-background colour — nearly invisible on a card. No colour token may share a name with a font-size step (`xs`, `sm`, `base`, `lg`, `xl`, `2xl`, …).

The four epistemic hues — `fact`, `analysis`, `opinion`, `limitation` — are deliberately distinct from the accent, so a content label never reads as branding.

The accent is a placeholder. It has two values, one per theme, because a single hex cannot reach WCAG AA against both a near-white (`#f7f6f3`) and a near-dark (`#0e1520`) background: darken it enough for the light theme and it fails on dark, lighten it enough for dark and it fails on light.

Change the accent either in `src/index.css` (`--color-accent` and `--color-accent-strong`, plus their `:root.dark` overrides) or per-site through admin → Settings, which writes `settings.accent.light` and `settings.accent.dark` (both `null` by default, meaning "use the CSS values"). **After any accent change, re-check the contrast against both backgrounds — aim for at least 4.5:1 for normal text**, and check `--color-on-accent` against the new accent as well.

Fonts are system stacks only: no network requests, no FOUT and no third-party dependency. To swap in a web font, install it from `@fontsource` and set `--font-display` (or `--font-sans`) to it:

```bash
npm install @fontsource/newsreader
```

Then `@import '@fontsource/newsreader'` at the top of `src/index.css` and point `--font-display` at `Newsreader`, keeping the existing stack behind it as the fallback.

## Privacy rules this site follows

The content is written to a fixed rule: publish the work, not the person. Deliberately never published anywhere on this site:

- Exact age or date of birth
- School name, or affiliation/registration number
- Exact city, district or address — location is only ever "West Bengal, India"
- Daily or weekly timetable
- Academic scores, marks, ranks or exam targets
- Physical information
- Phone number
- Private documents of any kind

Email address, GitHub, LinkedIn, other social links, the profile photo and the accent colour are all placeholders to be filled in. `profile.photo` in `src/data/profile.json` is `null`; every entry in `src/data/social.json` has `"url": null` and renders as a labelled placeholder rather than a dead link.

The content contains no invented awards, publications, clients, qualifications, statistics or results. Abilities are labelled only `learning` or `working-knowledge`, projects carry an explicit status and a stated limitation, and the admin dashboard shows counts rather than fabricated view or visitor metrics.

## Migrating to a backend later

The content document already has a clean seam. `src/lib/store.js` exposes `loadDocument`, `saveDocument` and `clearDocument`; every mutation goes through `ContentProvider` in `src/lib/content.jsx` (`upsertItem`, `removeItem`, `patchItem`, `moveItem`, `setSection`, `replaceDocument`, `resetDocument`). A migration replaces that one module with async calls and leaves every component untouched.

Two things apply to all three providers:

- **Keep the public site reading a build-time snapshot.** Fetch the document at build time, write it into `src/data/`, and let the provider serve it synchronously as it does now. The public pages then stay fast, work offline in preview, and keep working if the service is down or over quota. Only the admin panel needs a live connection.
- **Reads are currently synchronous**, so no component has a loading or error state. Making `loadDocument` async means `ContentProvider` has to expose `loading` and `error`, and the pages that consume it need to handle both. That is the real cost of the migration, not the queries.

### Supabase

Create a Postgres table per collection (`projects`, `posts`, `tags`, `skills`, `timeline`, `social`, `interests`) plus a single-row `site` table for `profile`, `home`, `settings` and `categories` — or, for the smallest change, one `content` table holding the whole document as `jsonb` keyed by version. Auth is real and server-side: Supabase Auth with email and password, or a magic link, for the single owner account. In the code, replace the body of `src/lib/store.js` with `supabase.from(...).select()` / `upsert()` / `delete()` and gate the admin routes on a session from `supabase.auth.getSession()`. The caveat that matters: the anon key ships in the browser bundle, so row-level security policies must be written explicitly — RLS off, or a permissive `using (true)` write policy, makes the data world-writable by anyone who reads the bundle.

### Firebase

Create a Firestore collection per content collection, with a `site` document for the whole-object sections. Auth is Firebase Auth, again real and server-side, restricted to one owner UID. In the code, `src/lib/store.js` becomes `getDoc`/`getDocs` on read and `setDoc`/`deleteDoc` on write, and the admin routes wait on `onAuthStateChanged`. The caveat: Firestore security rules default to test mode, which allows any read and write and silently expires after 30 days. Writes must be locked to the owner's UID (`allow write: if request.auth.uid == '...'`) before anything real goes in, or the database is open to the internet.

### Appwrite

Create a database with one collection per content collection, plus a single document for the whole-object sections, and define each attribute so Appwrite validates on write. Auth is Appwrite Account — email and password sessions, or a team the owner belongs to — which is real server-side auth. In the code, `src/lib/store.js` becomes `databases.listDocuments` / `createDocument` / `updateDocument` / `deleteDocument`, and the admin routes check `account.get()`. The caveat: Appwrite permissions are set per collection and per document, and a collection created with `any` write permission is world-writable; set read to `any` and write to the owner's user or team ID. If self-hosting, the site's availability then depends on that instance being up, which is the strongest argument for keeping the public pages on a build-time snapshot.

## Testing checklist

- [ ] Every route loads: `/`, `/about`, `/portfolio`, `/blog`, `/contact`, `/admin`, and an unknown path renders the not-found page
- [ ] Every header and footer nav link resolves; no dead links; every social placeholder renders as a placeholder rather than a broken `href`
- [ ] No errors or warnings in the browser console on any page
- [ ] Keyboard-only pass: the skip link works and is visible on focus, focus is visible on every interactive element, tab order follows reading order, and the confirm dialog traps focus and restores it on close
- [ ] Dark mode persists across a reload with no light flash on first paint
- [ ] Portfolio filters: category, status and search narrow the list, combine correctly, and show an empty state when nothing matches
- [ ] Blog shows its empty state (`blogEmptyState` from `src/data/settings.json`) with `posts.json` empty
- [ ] Admin: create a project → submit empty and confirm validation errors appear and nothing is saved → reorder an item using only the keyboard → set it to draft and confirm it disappears from the public page → delete it and confirm the confirmation dialog appears
- [ ] Reload after that delete and confirm the deleted item stays deleted
- [ ] Admin → Import & export: export the JSON, reset the demo data, then re-import the file and confirm the content comes back unchanged
- [ ] Toggle **Preview drafts** in the admin header and confirm drafts appear on the real public pages, and disappear when it is toggled off
- [ ] Build and preview the output:

```bash
npm run build
```

```bash
npm run preview
```

- [ ] Confirm all of these exist in `dist/`: `about/index.html`, `404.html`, `sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll` — and that the `Sitemap:` line in `dist/robots.txt` matches the deployed origin
- [ ] Re-run the build at a project-page base and confirm assets still resolve when served from that subpath:

```bash
BASE_PATH=/repo/ npm run build
```

- [ ] Final content audit: no invented awards, publications, clients, qualifications, statistics or results; no private details from the list above; no `[SAMPLE — REPLACE BEFORE PUBLISHING]` text left anywhere

## Replacing the placeholder assets

- `public/og-placeholder.svg` should become a 1200×630 **PNG**. Several social scrapers do not render SVG, so the current file produces no preview image on some platforms. Replace the file and update `DEFAULT_OG_IMAGE` in `src/lib/routes.js` to the new filename.
- `public/favicon.svg` is a placeholder mark, referenced from `index.html` as both the icon and the Apple touch icon.
- The profile photo is `profile.photo` in `src/data/profile.json`, currently `null`. While it is `null`, `Avatar` renders the initials instead of a broken image, so the page stays correct until a real photo exists. Set `photoAlt` at the same time.

## Licence

The content on this site is the author's, and no licence file is included — so add one if reuse should be allowed.
