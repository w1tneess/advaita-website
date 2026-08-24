import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Base path resolution.
 *
 * - Custom domain (advaitachandra.in) or a <user>.github.io repo  ->  "/"
 * - Project page at <user>.github.io/<repo>/                      ->  "/<repo>/"
 *
 * Set it at build time:  BASE_PATH=/advaita-website/ npm run build
 *
 * IMPORTANT: the base must be absolute and end with a slash. Do NOT use "./".
 * Relative asset URLs break on the pre-rendered nested pages (e.g. /about/index.html)
 * that scripts/prerender.js emits.
 */
function resolveBase() {
  const raw = (process.env.BASE_PATH ?? '/').trim()
  if (!raw || raw === '/') return '/'
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react({ jsxRuntime: 'automatic' }), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Keep the shell small; the admin panel is lazy-loaded in src/App.jsx.
    chunkSizeWarningLimit: 700,
  },
  server: {
    port: 5173,
    open: false,
  },
})
