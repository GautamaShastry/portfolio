import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'
import { logout } from './adminAuthSlice'

const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || '').replace(/\/$/, '')

// --- Public reads: straight from Supabase (anon key + RLS), no Lambda round-trip needed ---

export const fetchPublishedPosts = createAsyncThunk(
    'posts/fetchPublished',
    async (_, { rejectWithValue }) => {
        if (!supabase) return rejectWithValue('Blog is not configured')
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('published_at', { ascending: false })
        if (error) return rejectWithValue(error.message)
        return data
    }
)

export const fetchPostBySlug = createAsyncThunk(
    'posts/fetchBySlug',
    async (slug, { rejectWithValue }) => {
        if (!supabase) return rejectWithValue('Blog is not configured')
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('published', true)
            .single()
        if (error) return rejectWithValue(error.message)
        return data
    }
)

// --- Admin writes: through the Lambda API (service-role key + immediate re-embedding) ---

const adminRequest = async (path, options, getState, dispatch) => {
    const token = getState().adminAuth.token
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...options.headers
        }
    })
    if (response.status === 401) {
        dispatch(logout())
        throw new Error('Session expired, please log in again')
    }
    if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.detail || 'Request failed')
    }
    return response.json()
}

export const fetchAllPostsAdmin = createAsyncThunk(
    'posts/fetchAllAdmin',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            return await adminRequest('/api/admin/posts', { method: 'GET' }, getState, dispatch)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createPost = createAsyncThunk(
    'posts/create',
    async (post, { getState, dispatch, rejectWithValue }) => {
        try {
            return await adminRequest('/api/admin/posts', {
                method: 'POST',
                body: JSON.stringify(post)
            }, getState, dispatch)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updatePost = createAsyncThunk(
    'posts/update',
    async ({ id, ...post }, { getState, dispatch, rejectWithValue }) => {
        try {
            return await adminRequest(`/api/admin/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify(post)
            }, getState, dispatch)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deletePost = createAsyncThunk(
    'posts/delete',
    async (id, { getState, dispatch, rejectWithValue }) => {
        try {
            await adminRequest(`/api/admin/posts/${id}`, { method: 'DELETE' }, getState, dispatch)
            return id
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        published: [],
        current: null,
        adminPosts: [],
        isLoading: false,
        isSaving: false,
        error: null
    },
    reducers: {
        clearCurrentPost: (state) => {
            state.current = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublishedPosts.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchPublishedPosts.fulfilled, (state, action) => {
                state.isLoading = false
                state.published = action.payload
            })
            .addCase(fetchPublishedPosts.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(fetchPostBySlug.pending, (state) => {
                state.isLoading = true
                state.error = null
                state.current = null
            })
            .addCase(fetchPostBySlug.fulfilled, (state, action) => {
                state.isLoading = false
                state.current = action.payload
            })
            .addCase(fetchPostBySlug.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(fetchAllPostsAdmin.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchAllPostsAdmin.fulfilled, (state, action) => {
                state.isLoading = false
                state.adminPosts = action.payload
            })
            .addCase(fetchAllPostsAdmin.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(createPost.pending, (state) => { state.isSaving = true })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isSaving = false
                state.adminPosts.unshift(action.payload)
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isSaving = false
                state.error = action.payload
            })
            .addCase(updatePost.pending, (state) => { state.isSaving = true })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.isSaving = false
                state.adminPosts = state.adminPosts.map(p => p.id === action.payload.id ? action.payload : p)
            })
            .addCase(updatePost.rejected, (state, action) => {
                state.isSaving = false
                state.error = action.payload
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.adminPosts = state.adminPosts.filter(p => p.id !== action.payload)
            })
    }
})

export const { clearCurrentPost } = postsSlice.actions
export const selectPostsState = (state) => state.posts
export default postsSlice.reducer
