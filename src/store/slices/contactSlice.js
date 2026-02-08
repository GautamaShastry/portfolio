import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import emailjs from '@emailjs/browser'

export const sendContactForm = createAsyncThunk(
    'contact/sendForm',
    async (formRef, { rejectWithValue }) => {
        try {
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formRef,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
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
