// Theme slice
export { default as themeReducer, toggleTheme, setTheme, selectIsDark } from './themeSlice'

// Chatbot slice
export { 
    default as chatbotReducer, 
    toggleChatbot, 
    openChatbot, 
    closeChatbot, 
    addUserMessage, 
    setGreeting, 
    clearMessages,
    sendMessage,
    selectChatbotState 
} from './chatbotSlice'

// Contact slice
export { 
    default as contactReducer, 
    setFocusedField, 
    clearFocusedField, 
    resetContactState,
    sendContactForm,
    selectContactState 
} from './contactSlice'

// UI slice
export { 
    default as uiReducer, 
    toggleMobileMenu, 
    closeMobileMenu, 
    setActiveSection, 
    setIsScrolled,
    selectUiState 
} from './uiSlice'
