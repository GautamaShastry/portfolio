import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit'
import { getSessionId, markConversationActive } from '../../lib/chatSession'
import { trackEvent } from '../../lib/analytics'

const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '')

export const askVoice = createAsyncThunk(
    'voiceAgent/ask',
    async ({ transcript, language }, { getState, rejectWithValue }) => {
        try {
            // Last few voice turns, so follow-ups work and the agent remembers who the visitor is
            const history = getState().voiceAgent.conversation.slice(-4).flatMap((turn) => [
                { role: 'user', content: turn.transcript },
                { role: 'assistant', content: turn.answer }
            ])
            const startedAt = performance.now()
            const response = await fetch(`${API_URL}/api/voice/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript, history, language, session_id: getSessionId() })
            })
            if (!response.ok) {
                const err = await response.json().catch(() => ({}))
                throw new Error(err.detail || 'Voice request failed')
            }
            const data = await response.json()
            markConversationActive()
            // Time until the spoken answer is ready to play, as the visitor experiences it, for GA
            trackEvent('assistant_response', { channel: 'voice', response_ms: Math.round(performance.now() - startedAt) })
            return data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const voiceAgentSlice = createSlice({
    name: 'voiceAgent',
    initialState: {
        isRecording: false,
        isProcessing: false,
        conversation: [],
        error: null,
        // "Email me a copy" card: null, or { email } (prefilled address, may be empty)
        copyCard: null
    },
    reducers: {
        setRecording: (state, action) => {
            state.isRecording = action.payload
        },
        clearConversation: (state) => {
            state.conversation = []
        },
        openCopyCard: (state, action) => {
            state.copyCard = { email: action.payload || '' }
        },
        closeCopyCard: (state) => {
            state.copyCard = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(askVoice.pending, (state) => {
                state.isProcessing = true
                state.error = null
            })
            .addCase(askVoice.fulfilled, (state, action) => {
                state.isProcessing = false
                state.conversation.push({
                    id: nanoid(),
                    transcript: action.payload.transcript,
                    answer: action.payload.answer,
                    audioBase64: action.payload.audio_base64
                })
                if (action.payload.action?.type === 'confirm_conversation_copy') {
                    state.copyCard = { email: action.payload.action.email || '' }
                }
            })
            .addCase(askVoice.rejected, (state, action) => {
                state.isProcessing = false
                state.error = action.payload
            })
    }
})

export const { setRecording, clearConversation, openCopyCard, closeCopyCard } = voiceAgentSlice.actions
export const selectVoiceAgentState = (state) => state.voiceAgent
export default voiceAgentSlice.reducer
