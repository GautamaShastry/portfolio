// Shared setup for every browser test:
//  - Google Analytics / Tag Manager requests are blocked (recorded, never sent)
//  - the backend API is faked: tests register handlers with api.on(path, handler), and every
//    request the page makes is recorded in api.requests
//  - any uncaught JavaScript error fails the test
import { test as base, expect } from '@playwright/test'

export const test = base.extend({
    api: [async ({ page }, use) => {
        const handlers = new Map()
        const requests = []
        await page.route('**/*', (route) => {
            const url = new URL(route.request().url())
            if (/google-analytics\.com|googletagmanager\.com|doubleclick\.net/.test(url.host)) {
                return route.fulfill({ status: 204, body: '' })
            }
            if (url.host !== 'api.test.local') return route.fallback()
            const request = route.request()
            if (request.method() === 'OPTIONS') {
                return route.fulfill({ status: 204, headers: {
                    'access-control-allow-origin': '*', 'access-control-allow-methods': '*', 'access-control-allow-headers': '*',
                } })
            }
            let body = request.postData()
            try { body = JSON.parse(body) } catch { /* not JSON */ }
            requests.push({ method: request.method(), path: url.pathname, query: url.search, body })
            const handler = handlers.get(url.pathname)
            if (!handler) return route.fulfill({ status: 404, contentType: 'application/json', body: '{"detail":"no fake handler"}' })
            const { status = 200, json } = handler(body, url) || {}
            return route.fulfill({
                status,
                contentType: 'application/json',
                headers: { 'access-control-allow-origin': '*' },
                body: json === undefined ? '' : JSON.stringify(json),
            })
        })
        await use({
            on: (path, handler) => handlers.set(path, handler),
            requests,
            sent: (path) => requests.filter((r) => r.path === path),
        })
    }, { auto: true }],
    page: async ({ page }, use) => {
        const errors = []
        page.on('pageerror', (e) => errors.push(e.message))
        await use(page)
        expect(errors, 'uncaught JavaScript errors on the page').toEqual([])
    },
})

export { expect }

// A valid-looking (unsigned) admin JWT that expires in an hour; the real backend would verify
// it, here the backend is fake, so only the expiry check in the browser matters.
export function fakeAdminToken() {
    const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
    return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })}.signature`
}
