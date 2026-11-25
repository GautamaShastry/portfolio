import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const STORAGE_KEY = 'admin_token'
const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || '').replace(/\/$/, '')
const apiPath = (path) => `${API_URL}${path}`

// Reads the JWT's exp claim (no signature check - the API still verifies every request)
const isTokenValid = (token) => {
    if (!token) return false
    try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
        return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
    } catch {
        return false
    }
}

const loadStoredToken = () => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (isTokenValid(token)) return token
    localStorage.removeItem(STORAGE_KEY)
    return null
}

export const login = createAsyncThunk(
    'adminAuth/login',
    async (password, { rejectWithValue }) => {
        try {
            const response = await fetch(apiPath('/api/admin/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })
            if (!response.ok) {
                const err = await response.json().catch(() => ({}))
                throw new Error(err.detail || 'Login failed')
            }
            const data = await response.json()
            return data.token
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState: {
        token: loadStoredToken(),
        isLoading: false,
        error: null
    },
    reducers: {
        logout: (state) => {
            state.token = null
            localStorage.removeItem(STORAGE_KEY)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.token = action.payload
                localStorage.setItem(STORAGE_KEY, action.payload)
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { logout } = adminAuthSlice.actions
export const selectAdminAuthState = (state) => state.adminAuth
export const selectIsAdminAuthenticated = (state) => isTokenValid(state.adminAuth.token)
export default adminAuthSlice.reducer
