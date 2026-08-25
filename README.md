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

The public React/Vite site and the existing `/admin` editor are deployed as static files
to GitHub Pages. Content remains human-readable JSON under `src/data/`, and the existing
React content context keeps public and admin projections stable. The admin panel is a
local editorial workspace: it stores drafts in this browser and exports a validated
publish bundle. GitHub Codespaces or GitHub's web editor is the trusted publishing
boundary; no GitHub token is ever sent to browser JavaScript.

## GitHub Actions deployment

`.github/workflows/deploy.yml` runs `npm ci`, validates content, builds the site, and
deploys `dist/` with the official GitHub Pages actions. It needs no repository secrets.
For a project-page URL, set the repository variable `BASE_PATH` to `/advaita-website/`;
for the custom domain, leave it as `/`.

## Admin panel

Open `/admin` locally with `npm run dev`. The local unlock screen is only a convenience
for this browser; it is not authentication for GitHub or the live site. Use **Export
publish bundle**, apply the listed files in Codespaces, inspect `git diff`, and then run:

```bash
git status
git diff
git add src/data public/assets
git commit -m "Update website content"
git push
```

The public site never calls the GitHub API at runtime. This is deliberate: a static site
cannot safely hold a repository-write token. GitHub's authenticated Codespace/web editor
is the secure write boundary.

## Media

Small public images may be kept under `public/assets/`. The local editor validates image
extensions and size before an asset is added to a publish bundle. GitHub is not suitable
for large media, private uploads, or arbitrary file storage, so the repository workflow
keeps media intentionally limited.

## Content

This site is focused on learning in public: showing work clearly, separating evidence from interpretation, and being honest about limitations.

## License

The content belongs to the author. No reuse license is currently provided.
