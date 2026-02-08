import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isMobileMenuOpen: false,
        activeSection: 'home',
        isScrolled: false
    },
    reducers: {
        toggleMobileMenu: (state) => {
            state.isMobileMenuOpen = !state.isMobileMenuOpen
        },
        closeMobileMenu: (state) => {
            state.isMobileMenuOpen = false
        },
        setActiveSection: (state, action) => {
            state.activeSection = action.payload
        },
        setIsScrolled: (state, action) => {
            state.isScrolled = action.payload
        }
    }
})

export const { toggleMobileMenu, closeMobileMenu, setActiveSection, setIsScrolled } = uiSlice.actions
export const selectUiState = (state) => state.ui
export default uiSlice.reducer
