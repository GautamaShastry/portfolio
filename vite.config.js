import os from 'node:os'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Keep Vite's dependency cache outside the project: this folder is synced by OneDrive,
  // which locks files mid-write and makes Vite's cache rename fail (EPERM), leaving the
  // dev server serving "504 Outdated Optimize Dep". Dev-only; doesn't affect builds.
  cacheDir: process.env.VITE_CACHE_DIR || path.join(os.tmpdir(), 'vite-cache-gautam-portfolio'),
  // Pre-bundle deps that are only imported by lazy-loaded components (Chatbot, charts),
  // so Vite doesn't discover them mid-session and re-optimize while the page is open.
  optimizeDeps: {
    include: ['react-markdown', 'recharts'],
  },
  server: {
    port: 3001,
    strictPort: false,
  },
})
