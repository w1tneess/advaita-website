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
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Keep the shell small; the admin panel is lazy-loaded in src/App.jsx.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'supabase': ['@supabase/supabase-js'],
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
