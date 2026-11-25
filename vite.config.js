import os from 'node:os'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import site from './site.config.js'

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Fills index.html's %SITE.*% placeholders from site.config.js, and generates robots.txt and
// sitemap.xml at build time, so the owner's details live in one file.
function siteConfigPlugin() {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.legalName || site.name,
    alternateName: site.name,
    url: `${site.siteUrl}/`,
    image: `${site.siteUrl}${site.logo}`,
    jobTitle: site.jobTitle,
    email: `mailto:${site.email}`,
    sameAs: Object.values(site.socials || {}),
  }).replace(/</g, '\\u003c')

  return {
    name: 'site-config',
    transformIndexHtml(html) {
      return html.replace(/%SITE\.(\w+)%/g, (match, key) => {
        if (key === 'jsonLd') return jsonLd
        if (!(key in site)) throw new Error(`index.html uses %SITE.${key}% but site.config.js has no "${key}"`)
        return escapeHtml(site[key])
      })
    },
    generateBundle() {
      const disallow = (site.robotsDisallow || []).map((p) => `Disallow: ${p}`).join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${disallow}\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`,
      })
      const urls = (site.sitemapRoutes || ['/'])
        .map((route) => `  <url>\n    <loc>${site.siteUrl}${route}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${route === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), siteConfigPlugin()],
  // Keep Vite's dependency cache outside the project: this folder is synced by OneDrive,
  // which locks files mid-write and makes Vite's cache rename fail (EPERM), leaving the
  // dev server serving "504 Outdated Optimize Dep". Dev-only; doesn't affect builds.
  cacheDir: process.env.VITE_CACHE_DIR || path.join(os.tmpdir(), 'vite-cache-portfolio'),
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
