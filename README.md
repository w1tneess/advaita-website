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

To run the API locally, install Wrangler if it is not already available and copy
`.env.example` to `.env` for reference. The frontend remains fully usable with its
seed data when `VITE_API_URL` is empty. With a running Worker, set
`VITE_API_URL=http://localhost:8787` in `.env.local` and start both processes:

```bash
npx wrangler d1 migrations apply advaita-content --local
npm run worker:dev
npm run dev
```

## Architecture

The public React/Vite site and the existing `/admin` editor are deployed to Cloudflare
Pages. The Worker in `worker/src/index.js` is the only server-side boundary for writes.
It exposes the content document, contact messages, authentication sessions, and optional
R2 media endpoints under `/api`. D1 stores the content document, expiring admin sessions,
and contact submissions. The browser never receives
the admin password or Cloudflare credentials. When the API is not configured, the
public site uses the checked-in seed and the admin is intentionally unavailable.

## Cloudflare setup

Create the D1 resource once. R2 is optional and requires account billing:

```bash
npx wrangler login
npx wrangler d1 create advaita-content
npm run worker:migrate
npm run worker:deploy
npx wrangler pages project create advaita-website
```

The current deployment intentionally runs without R2, so the application does not
require billing activation. Media endpoints return a clear `503` until R2 is enabled.

Set the Worker secret with a PBKDF2 value in the format
`salt:iterations:hex-digest`. A portable example for generating one is:

```bash
node -e "const c=require('crypto'),p=process.argv[1],s=c.randomBytes(16).toString('hex'),i=310000; console.log(s+':'+i+':'+c.pbkdf2Sync(p,s,i,32,'sha256').toString('hex'))" 'replace-with-a-long-password'
npx wrangler secret put ADMIN_PASSWORD_HASH
```

In Cloudflare Pages, add `VITE_API_URL` as a production build variable pointing to
the Worker origin. In the Worker, set `FRONTEND_ORIGIN` to the exact Pages/custom
domain origin. The D1 database is declared in `wrangler.toml`. R2 is optional and can
be added later by an account owner if media uploads become necessary.

## GitHub Actions deployment

`.github/workflows/deploy.yml` runs the frontend build, validates the Worker bundle,
and deploys both on pushes to `main`. Add these GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN`: token with Pages and Workers deploy permissions
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID

Add this Actions variable:

- `CLOUDFLARE_PAGES_PROJECT`: the Pages project name, normally `advaita-website`
- `VITE_API_URL`: the deployed Worker origin

The Pages workflow intentionally builds with `BASE_PATH=/` because the custom domain
and Pages project are served from the origin root. Remove any old `BASE_PATH` repository
variable used for GitHub Pages project URLs.

The D1 migration and `ADMIN_PASSWORD_HASH` secret are deliberately managed through
Wrangler/Cloudflare rather than committed to Git. Apply future migrations with
`npm run worker:migrate` and deploy the Worker with `npm run worker:deploy`.

## Admin panel

Open `/admin` on the deployed site. Login is verified by the Worker and held in an
HttpOnly, Secure, SameSite cookie. Existing editors continue to manage profile, home,
projects, posts, taxonomy, skills, timeline, social links, settings, and JSON import /
export. Saving a document synchronizes it to D1 when the API is configured. Contact
submissions appear in D1 through `GET /api/messages`; a richer messages screen can be
added to the existing admin navigation without introducing a second admin surface.

## API surface

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`
- `GET|PUT|PATCH /api/content`
- `POST /api/messages`, authenticated `GET /api/messages`
- Authenticated `PUT|DELETE /api/media/:key`, public `GET /api/media/:key`

All database calls use prepared statements. JSON and image requests have size/type
validation, write routes require a server-side session, and CORS is limited to the
configured frontend origin.

## Content

This site is focused on learning in public: showing work clearly, separating evidence from interpretation, and being honest about limitations.

## License

The content belongs to the author. No reuse license is currently provided.
