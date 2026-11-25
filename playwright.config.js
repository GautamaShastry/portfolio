// Browser tests (e2e/). They build the site and serve the production build on port 4173 (the
// code that actually ships, and much faster and steadier than the dev server), with the backend
// and Google Analytics replaced by fakes inside each test: no backend, no AWS, no network, and
// never any real email or analytics hits.
//
//   npm run test:e2e            (locally: uses your installed Google Chrome)
//   CI=1 npm run test:e2e       (CI: run `npx playwright install --with-deps chromium` first)
import os from 'node:os'
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const isCI = Boolean(process.env.CI)

export default defineConfig({
    testDir: './e2e',
    timeout: 45_000,
    fullyParallel: true,
    workers: isCI ? 2 : 4,
    retries: isCI ? 1 : 0,
    reporter: isCI ? 'line' : 'list',
    use: {
        baseURL: `http://localhost:${PORT}`,
        // Local runs use the installed Chrome; CI uses Playwright's own Chromium
        channel: isCI ? undefined : 'chrome',
        trace: 'retain-on-failure',
    },
    projects: [
        { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
        { name: 'mobile', use: { ...devices['Pixel 7'] } },
    ],
    webServer: {
        command: `npx vite build --outDir dist-e2e --emptyOutDir && npx vite preview --outDir dist-e2e --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: false,  // always test a fresh build of the current code
        timeout: 240_000,
        env: {
            // Real environment variables override .env / .env.local in Vite (baked into the build)
            VITE_CHATBOT_API_URL: 'http://api.test.local',
            VITE_GA_MEASUREMENT_ID: 'G-TEST000000',
            VITE_SUPABASE_URL: '',
            VITE_SUPABASE_ANON_KEY: '',
            // Separate cache, so tests don't clash with a dev server you have running
            VITE_CACHE_DIR: path.join(os.tmpdir(), 'vite-cache-portfolio-e2e'),
        },
    },
})
