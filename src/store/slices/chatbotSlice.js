import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import i18n from '../../i18n'
import { getSessionId, markConversationActive } from '../../lib/chatSession'
import { trackEvent } from '../../lib/analytics'

const MAX_HISTORY = 8

export const sendMessage = createAsyncThunk(
    'chatbot/sendMessage',
    async (message, { getState, rejectWithValue }) => {
        try {
            // Retrieval now happens server-side (chatbot-backend/rag.py embeds the message,
            // pulls the closest chunks from Supabase, and grounds the answer in those alone)
            const configuredUrl = import.meta.env.VITE_CHATBOT_API_URL
            const baseUrl = configuredUrl || (import.meta.env.DEV ? 'http://localhost:8000' : '')
            if (!baseUrl) {
                throw new Error('Chatbot backend URL is not configured')
            }

            // Prior turns (minus the greeting and the message just added) so follow-ups have context
            const history = getState().chatbot.messages
                .slice(1, -1)
                .filter((m) => !m.isError && !m.isNote)
                .slice(-MAX_HISTORY)
                .map(({ role, content }) => ({ role, content }))
            const language = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]

            const startedAt = performance.now()
            const apiUrl = `${baseUrl.replace(/\/$/, '')}/api/chat`
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, history, language, session_id: getSessionId() })
            })

            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                throw new Error(data.detail || data.message || `Chatbot request failed (${response.status})`)
            }
            if (!data.response) {
                throw new Error('Chatbot returned an empty response')
            }
            markConversationActive()
            // Response time as the visitor experiences it (network included), for GA
            trackEvent('assistant_response', { channel: 'chat', response_ms: Math.round(performance.now() - startedAt) })
            // action: e.g. { type: 'confirm_conversation_copy', email } -> show the copy card
            return { text: data.response, action: data.action || null }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Unable to reach the chatbot backend')
        }
    }
)

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState: {
        isOpen: false,
        messages: [],
        isLoading: false,
        error: null,
        // "Email me a copy" card: null, or { email } (prefilled address, may be empty)
        copyCard: null
    },
    reducers: {
        toggleChatbot: (state) => {
            state.isOpen = !state.isOpen
        },
        openChatbot: (state) => {
            state.isOpen = true
        },
        closeChatbot: (state) => {
            state.isOpen = false
        },
        addUserMessage: (state, action) => {
            state.messages.push({ role: 'user', content: action.payload })
        },
        setGreeting: (state, action) => {
            if (state.messages.length === 0 || state.messages[0].role === 'assistant') {
                state.messages = [{ role: 'assistant', content: action.payload }]
            }
        },
        clearMessages: (state) => {
            state.messages = []
        },
        openCopyCard: (state, action) => {
            state.copyCard = { email: action.payload || '' }
        },
        closeCopyCard: (state) => {
            state.copyCard = null
        },
        addAssistantNote: (state, action) => {
            state.messages.push({ role: 'assistant', content: action.payload, isNote: true })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.messages.push({ role: 'assistant', content: action.payload.text })
                if (action.payload.action?.type === 'confirm_conversation_copy') {
                    state.copyCard = { email: action.payload.action.email || '' }
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.messages.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', isError: true })
            })
    }
})

export const {
    toggleChatbot, openChatbot, closeChatbot, addUserMessage, setGreeting, clearMessages,
    openCopyCard, closeCopyCard, addAssistantNote
} = chatbotSlice.actions
export const selectChatbotState = (state) => state.chatbot
export default chatbotSlice.reducer
