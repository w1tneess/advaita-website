import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [react({ jsxRuntime: 'automatic' }), tailwindcss()],
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: true,
    // Keep the shell small; the admin panel is lazy-loaded in src/App.jsx.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Vite 8 / Rolldown expects manualChunks to be a function.
        // Return a chunk name when a module matches the given package path.
        manualChunks(id) {
          if (!id) return undefined
          if (id.includes('node_modules/framer-motion')) return 'framer-motion'
          if (id.includes('node_modules/@supabase/supabase-js')) return 'supabase'
          if (id.includes('node_modules/lucide-react')) return 'lucide'
          return undefined
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react-router', 'framer-motion', 'lucide-react', '@supabase/supabase-js'],
  },
  server: {
    port: 5173,
    open: false,
    watch: {
      // Exclude nested sub-projects and build outputs from the file watcher.
      // These directories contain their own lock files, binaries, and build
      // artifacts that cause EBUSY crashes on Windows when Vite tries to watch them.
      ignored: [
        '**/sandbox/**',
        '**/sandbox-landing-page/**',
        '**/rembg_env/**',
        '**/audit_scratch/**',
        '**/dist/**',
        '**/.git/**',
      ],
    },
  },
})
