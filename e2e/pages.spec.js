// Every page loads and renders without JavaScript errors (desktop and mobile projects).
import { test, expect } from './fixtures'
import site from '../site.config.js'

const PAGES = [
    { path: '/', text: site.name },
    { path: '/projects', heading: true },
    { path: '/experience', heading: true },
    { path: '/contact', text: /Send Message/i },
    { path: '/blog', text: /Notes & Writing/ },
    { path: '/voice-agent', text: /English only/i },
    { path: '/admin/login', text: /Admin Login/ },
]

for (const { path, text, heading } of PAGES) {
    test(`${path} loads`, async ({ page }) => {
        await page.goto(path)
        // Content pages: just check something rendered, so the tests don't depend on whose portfolio it is
        const target = heading ? page.locator('main h1, main h2').first() : page.getByText(text).first()
        await expect(target).toBeVisible()
    })
}

test('unknown pages show the not-found page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist')
    await expect(page.getByText(/404|not found/i).first()).toBeVisible()
})

test('admin pages redirect to login when not signed in', async ({ page }) => {
    await page.goto('/admin/insights')
    await expect(page).toHaveURL(/\/admin\/login$/)
})

test('resume download uses the configured file and name', async ({ page, isMobile }) => {
    test.skip(isMobile, 'download behaviour is the same; desktop is enough')
    await page.goto('/')
    const link = page.locator(`a[download="${site.resume.downloadName}"]`)
    await expect(link).toHaveAttribute('href', `/${site.resume.file}`)
    const response = await page.request.get(`/${site.resume.file}`)
    expect(response.headers()['content-type']).toContain('pdf')
})

test('browser tab titles follow site.config.js', async ({ page }) => {
    await page.goto('/projects')
    await expect(page).toHaveTitle(site.pageTitles ? `Projects | ${site.name}` : site.title)
    await page.goto('/')
    await expect(page).toHaveTitle(site.title)
})
