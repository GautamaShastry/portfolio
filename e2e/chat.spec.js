// The chat assistant: greeting with visitor-type buttons, replies (Markdown rendered), history
// sent with follow-ups, the conversation-copy card, and error handling.
import { test, expect } from './fixtures'

async function openChat(page) {
    await page.goto('/')
    await page.getByRole('button', { name: /open ai assistant/i }).click()
}

test('greets with visitor-type buttons and sends the choice', async ({ page, api }) => {
    api.on('/api/chat', () => ({ json: { response: 'Great! What role are you **hiring** for?', action: null } }))
    await openChat(page)
    await expect(page.getByText(/are you a recruiter/i)).toBeVisible()
    await page.getByRole('button', { name: "I'm a recruiter" }).click()

    // Markdown is rendered, not shown as asterisks
    await expect(page.locator('strong', { hasText: 'hiring' })).toBeVisible()
    await expect(page.getByRole('button', { name: "I'm a recruiter" })).toHaveCount(0) // buttons go away
    const [request] = api.sent('/api/chat')
    expect(request.body).toMatchObject({ message: "I'm a recruiter", language: 'en' })
    expect(request.body.session_id).toMatch(/^[0-9a-f-]{36}$/)
})

test('follow-up questions include the conversation history', async ({ page, api }) => {
    let n = 0
    api.on('/api/chat', () => ({ json: { response: `Answer ${++n}`, action: null } }))
    await openChat(page)
    const input = page.getByPlaceholder(/ask about/i)
    await input.fill('What projects has he built?')
    await input.press('Enter')
    await expect(page.getByText('Answer 1')).toBeVisible()
    await input.fill('Tell me more about the first one')
    await input.press('Enter')
    await expect(page.getByText('Answer 2')).toBeVisible()

    const second = api.sent('/api/chat')[1].body
    expect(second.history).toEqual([
        { role: 'user', content: 'What projects has he built?' },
        { role: 'assistant', content: 'Answer 1' },
    ])
})

test('copy card: offered by the assistant, prefilled, sent on confirm', async ({ page, api }) => {
    api.on('/api/chat', () => ({ json: { response: 'Check the card below.', action: { type: 'confirm_conversation_copy', email: 'priya@example.com' } } }))
    api.on('/api/conversations/send-copy', () => ({ json: { status: 'sent' } }))
    await openChat(page)
    await page.getByPlaceholder(/ask about/i).fill('Yes, send me a copy')
    await page.getByPlaceholder(/ask about/i).press('Enter')

    const email = page.locator('input[type="email"]')
    await expect(email).toHaveValue('priya@example.com')
    await page.getByRole('button', { name: 'Send copy' }).click()
    await expect(page.getByText(/a copy of this conversation is on its way/i)).toBeVisible()
    expect(api.sent('/api/conversations/send-copy')[0].body).toMatchObject({ email: 'priya@example.com' })
})

test('"Email me this conversation" link opens an empty card that validates the address', async ({ page, api }) => {
    api.on('/api/chat', () => ({ json: { response: 'Hello!', action: null } }))
    await openChat(page)
    await page.getByPlaceholder(/ask about/i).fill('hi')
    await page.getByPlaceholder(/ask about/i).press('Enter')
    await page.getByRole('button', { name: /email me this conversation/i }).click()
    const send = page.getByRole('button', { name: 'Send copy' })
    await expect(send).toBeDisabled()
    await page.locator('input[type="email"]').fill('not-an-email')
    await expect(send).toBeDisabled()
    await page.locator('input[type="email"]').fill('me@example.com')
    await expect(send).toBeEnabled()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.locator('input[type="email"]')).toHaveCount(0)
})

test('backend errors show a friendly message', async ({ page, api }) => {
    api.on('/api/chat', () => ({ status: 500, json: { detail: 'The assistant is unavailable right now.' } }))
    await openChat(page)
    await page.getByPlaceholder(/ask about/i).fill('hello?')
    await page.getByPlaceholder(/ask about/i).press('Enter')
    await expect(page.getByText(/sorry, i encountered an error/i)).toBeVisible()
})
