import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { generatePortfolioContext } from '../../utils/generatePortfolioContext'

export const sendMessage = createAsyncThunk(
    'chatbot/sendMessage',
    async (message, { rejectWithValue }) => {
        try {
            // Generate context dynamically from portfolio constants
            const context = generatePortfolioContext()
            
            const response = await fetch(import.meta.env.VITE_CHATBOT_API_URL || '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, context })
            })
            if (!response.ok) throw new Error('API error')
            const data = await response.json()
            return data.response
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const chatbotSlice = createSlice({
    name: 'chatbot',
    initialState: {
        isOpen: false,
        messages: [],
        isLoading: false,
        error: null
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
                state.messages.push({ role: 'assistant', content: action.payload })
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.messages.push({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' })
            })
    }
})

export const { toggleChatbot, openChatbot, closeChatbot, addUserMessage, setGreeting, clearMessages } = chatbotSlice.actions
export const selectChatbotState = (state) => state.chatbot
export default chatbotSlice.reducer
