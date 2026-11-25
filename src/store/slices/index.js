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

// Game slice
export {
    default as gameReducer,
    openGame,
    closeGame,
    submitGuess,
    resetGame,
    selectGameState
} from './gameSlice'

// Posts (blog) slice
export {
    default as postsReducer,
    fetchPublishedPosts,
    fetchPostBySlug,
    fetchAllPostsAdmin,
    createPost,
    updatePost,
    deletePost,
    clearCurrentPost,
    selectPostsState
} from './postsSlice'

// Admin auth slice
export {
    default as adminAuthReducer,
    login,
    logout,
    selectAdminAuthState,
    selectIsAdminAuthenticated
} from './adminAuthSlice'

// Voice agent slice
export {
    default as voiceAgentReducer,
    askVoice,
    setRecording,
    clearConversation,
    selectVoiceAgentState
} from './voiceAgentSlice'
