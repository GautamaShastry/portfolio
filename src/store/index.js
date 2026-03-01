import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import chatbotReducer from './slices/chatbotSlice'
import contactReducer from './slices/contactSlice'
import uiReducer from './slices/uiSlice'
import gameReducer from './slices/gameSlice'

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        chatbot: chatbotReducer,
        contact: contactReducer,
        ui: uiReducer,
        game: gameReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore non-serializable values for form refs
                ignoredActions: ['contact/sendForm/pending', 'contact/sendForm/fulfilled', 'contact/sendForm/rejected']
            }
        })
})

export default store
