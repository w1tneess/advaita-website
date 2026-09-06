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
  },
  optimizeDeps: {
    include: ['react-router-dom', 'react-router', 'framer-motion', 'lucide-react', '@supabase/supabase-js'],
  },
  server: {
    port: 5173,
    open: false,
  },
})
