import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'



export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
  server: {
    port: 5173,
    open: false,
  },
})
