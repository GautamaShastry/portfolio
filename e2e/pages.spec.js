// Every page loads and renders without JavaScript errors (desktop and mobile projects).
import { test, expect } from './fixtures'

const PAGES = [
    { path: '/', text: /Satya/i },
    { path: '/projects', text: /Sentinel AI/ },
    { path: '/experience', text: /KeelWorks/ },
    { path: '/contact', text: /Send Message/i },
    { path: '/blog', text: /Notes & Writing/ },
    { path: '/voice-agent', text: /English only/i },
    { path: '/admin/login', text: /Admin Login/ },
]

for (const { path, text } of PAGES) {
    test(`${path} loads`, async ({ page }) => {
        await page.goto(path)
        await expect(page.getByText(text).first()).toBeVisible()
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

test('resume downloads as satya.pdf', async ({ page, isMobile }) => {
    test.skip(isMobile, 'download behaviour is the same; desktop is enough')
    await page.goto('/')
    const link = page.locator('a[download="satya.pdf"]')
    await expect(link).toHaveAttribute('href', /Satya_Bulusu-Walmart.*\.pdf/)
})
