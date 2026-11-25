import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '')

// Posts the contact form to the backend (/api/contact), which emails Satya and sends the
// sender a confirmation. Takes the <form> element.
export const sendContactForm = createAsyncThunk(
    'contact/sendForm',
    async (formRef, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(formRef)))
            })
            if (!response.ok) {
                const data = await response.json().catch(() => ({}))
                throw new Error(typeof data.detail === 'string' ? data.detail : 'Failed to send message')
            }
            return true
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to send message')
        }
    }
)

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        isSending: false,
        success: false,
        error: null,
        focusedField: null
    },
    reducers: {
        setFocusedField: (state, action) => {
            state.focusedField = action.payload
        },
        clearFocusedField: (state) => {
            state.focusedField = null
        },
        resetContactState: (state) => {
            state.success = false
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendContactForm.pending, (state) => {
                state.isSending = true
                state.error = null
                state.success = false
            })
            .addCase(sendContactForm.fulfilled, (state) => {
                state.isSending = false
                state.success = true
            })
            .addCase(sendContactForm.rejected, (state, action) => {
                state.isSending = false
                state.error = action.payload
            })
    }
})

export const { setFocusedField, clearFocusedField, resetContactState } = contactSlice.actions
export const selectContactState = (state) => state.contact
export default contactSlice.reducer
