// One conversation id per browser tab, shared by the chatbot and the voice agent.
// The backend saves every turn under this id and emails the transcript to Satya when
// the conversation ends: the chat is closed, or the visitor leaves the page.
const STORAGE_KEY = 'chat_session_id'
const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '')

let hasUnsentMessages = false
let listenersAttached = false

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)

export const getSessionId = () => {
    let id = sessionStorage.getItem(STORAGE_KEY)
    if (!id) {
        id = newId()
        sessionStorage.setItem(STORAGE_KEY, id)
    }
    return id
}

// Tells the backend the conversation ended so it emails the transcript. Uses sendBeacon
// (text/plain, so no CORS preflight) because it must survive the page unloading.
export const endConversation = () => {
    if (!hasUnsentMessages || !API_URL) return
    hasUnsentMessages = false
    const body = JSON.stringify({ session_id: getSessionId() })
    const url = `${API_URL}/api/conversations/end`
    const sent = navigator.sendBeacon?.(url, new Blob([body], { type: 'text/plain' }))
    if (!sent) {
        fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'text/plain' }, keepalive: true }).catch(() => {})
    }
}

// Call after each successful question/answer turn.
export const markConversationActive = () => {
    hasUnsentMessages = true
    if (listenersAttached) return
    listenersAttached = true
    // pagehide fires when the tab closes or navigates away. Not on tab switches, so a
    // visitor who glances at another tab doesn't trigger an email; when pagehide never
    // fires (e.g. mobile), the backend's scheduled sweep sends it once the chat goes idle.
    window.addEventListener('pagehide', endConversation)
}
