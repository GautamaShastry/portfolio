// Contact form, voice page, admin insights, and analytics setup.
import { test, expect, fakeAdminToken } from './fixtures'

// --- contact form ---------------------------------------------------------------------------------

async function fillContactForm(page) {
    await page.goto('/contact')
    await page.locator('input[name="name"]').fill('Sam Lee')
    await page.locator('input[name="email"]').fill('sam@example.com')
    await page.locator('textarea[name="message"]').fill('Hi Satya, are you free for a call?')
    await page.getByRole('button', { name: /send message/i }).click()
}

test('contact form posts to the backend and confirms', async ({ page, api }) => {
    api.on('/api/contact', () => ({ json: { status: 'sent', acknowledged: true } }))
    await fillContactForm(page)
    await expect(page.getByText(/message sent! a confirmation is on its way/i)).toBeVisible()
    expect(api.sent('/api/contact')[0].body).toEqual({
        name: 'Sam Lee', email: 'sam@example.com', message: 'Hi Satya, are you free for a call?', website: '',
    })
    await expect(page.locator('input[name="name"]')).toHaveValue('') // form reset
})

test('contact form shows the backend error message', async ({ page, api }) => {
    api.on('/api/contact', () => ({ status: 429, json: { detail: 'Too many requests, please slow down and try again shortly.' } }))
    await fillContactForm(page)
    await expect(page.getByText(/too many requests/i)).toBeVisible()
})

test('contact form honeypot field is invisible to people', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('input[name="website"]')).not.toBeInViewport()
})

// --- voice agent ----------------------------------------------------------------------------------

test('voice page says it is English only (also when the site is in German)', async ({ page }) => {
    await page.goto('/voice-agent')
    await expect(page.getByText('The voice agent works in English only.', { exact: false })).toBeVisible()
    await expect(page.getByRole('button', { name: /tap the mic to start a conversation/i })).toBeVisible()

    await page.evaluate(() => localStorage.setItem('i18nextLng', 'de'))
    await page.reload()
    await expect(page.getByText(/Der Sprachassistent funktioniert nur auf Englisch/)).toBeVisible()
})

// --- admin insights -------------------------------------------------------------------------------

const INSIGHTS = {
    days: 30,
    summary: { conversations: 3, questions: 7, recruiters: 1, leads_with_email: 1, contact_messages: 2, copies_sent: 1, chat_conversations: 2, voice_conversations: 1 },
    visitor_types: { recruiter: 1, exploring: 1, 'not yet classified': 1 },
    daily: Array.from({ length: 30 }, (_, i) => ({ date: new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10), conversations: i % 3 })),
    leads: [{ session_id: 's1', created_at: new Date().toISOString(), visitor_type: 'recruiter', name: 'Priya', company: 'Stripe', role: 'Backend Engineer II', email: 'priya@example.com', next_step: 'Email Priya' }],
    conversations: [{ id: 's1', started_at: new Date().toISOString(), last_message_at: new Date().toISOString(), questions: 3, channels: ['chat'], first_question: 'Does he know Kafka?', visitor_type: 'recruiter', name: 'Priya', company: 'Stripe', summary: 'Asked about Kafka.', emailed: true }],
    contacts: [{ id: 1, created_at: new Date().toISOString(), source: 'form', name: 'Sam', email: 'sam@example.com', message: 'Hello!', ack_sent_at: new Date().toISOString() }],
    truncated: false,
}

test('admin insights shows totals, leads and expandable transcripts', async ({ page, api }) => {
    api.on('/api/admin/insights', () => ({ json: INSIGHTS }))
    api.on('/api/admin/insights/conversations/s1', () => ({ json: { id: 's1', messages: [
        { role: 'user', channel: 'chat', content: 'Does he know Kafka?', created_at: new Date().toISOString() },
        { role: 'assistant', channel: 'chat', content: 'Yes, Kafka pipelines in Sentinel AI.', created_at: new Date().toISOString() },
    ] } }))
    await page.goto('/')
    await page.evaluate((token) => localStorage.setItem('admin_token', token), fakeAdminToken())
    await page.goto('/admin/insights')

    await expect(page.getByRole('heading', { name: 'Insights' })).toBeVisible()
    await expect(page.getByText('2 chat · 1 voice')).toBeVisible()
    await expect(page.getByRole('link', { name: 'priya@example.com' })).toBeVisible()
    await page.getByRole('button', { name: /does he know kafka/i }).click()
    await expect(page.getByText('Yes, Kafka pipelines in Sentinel AI.')).toBeVisible()

    await page.getByRole('button', { name: '7 days' }).click()
    await expect.poll(() => api.sent('/api/admin/insights').map((r) => r.query)).toContain('?days=7')
    expect(api.sent('/api/admin/insights')[0].query).toBe('?days=30')
})

test('an expired admin session goes back to login', async ({ page, api }) => {
    api.on('/api/admin/insights', () => ({ status: 401, json: { detail: 'Session expired, please log in again' } }))
    await page.goto('/')
    await page.evaluate((token) => localStorage.setItem('admin_token', token), fakeAdminToken())
    await page.goto('/admin/insights')
    await expect(page).toHaveURL(/\/admin\/login$/)
})

// --- analytics ------------------------------------------------------------------------------------

test('analytics: no cookie banner, ads off, EU visitors cookieless by default', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    const consent = await page.evaluate(() => window.dataLayer.filter((a) => a[0] === 'consent').map((a) => a[2]))
    expect(consent[0]).toMatchObject({ analytics_storage: 'denied', ad_storage: 'denied' })
    expect(consent[0].region).toContain('DE')
    expect(consent[1]).toMatchObject({ analytics_storage: 'granted', ad_storage: 'denied' })
})

test('analytics: route changes send one page view each', async ({ page }) => {
    await page.goto('/')
    // In-app navigation (works on mobile too, where the nav links sit in a collapsed menu)
    await page.evaluate(() => {
        window.history.pushState({}, '', '/projects')
        window.dispatchEvent(new PopStateEvent('popstate'))
    })
    await expect(page.getByText('Sentinel AI').first()).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.dataLayer.filter((a) => a[0] === 'event' && a[1] === 'page_view').length)).toBe(1)
})
