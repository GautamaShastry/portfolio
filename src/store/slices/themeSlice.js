import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
}

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        isDark: getInitialTheme()
    },
    reducers: {
        toggleTheme: (state) => {
            state.isDark = !state.isDark
            localStorage.setItem('theme', state.isDark ? 'dark' : 'light')
            document.documentElement.classList.toggle('dark', state.isDark)
        },
        setTheme: (state, action) => {
            state.isDark = action.payload
            localStorage.setItem('theme', state.isDark ? 'dark' : 'light')
            document.documentElement.classList.toggle('dark', state.isDark)
        }
    }
})

export const { toggleTheme, setTheme } = themeSlice.actions
export const selectIsDark = (state) => state.theme.isDark
export default themeSlice.reducer
