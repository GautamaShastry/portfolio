import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const PORTFOLIO_CONTEXT = `You are Gautam's (Satya's) AI assistant on his portfolio website. Answer questions about his background, skills, and projects concisely.

ABOUT:
- Software Engineer & AI Engineer specializing in intelligent autonomous systems
- MS in Computer Science at George Mason University (GPA: 3.87/4.0, Jan 2024 - Dec 2025)
- BTech in Computer Science from Andhra University (2019-2023)
- Expertise: LangChain, LangGraph, RAG architectures, AI agents
- Full-stack: React, Node.js, Spring Boot, Python, FastAPI, Django
- Cloud/DevOps: AWS, Docker, Kubernetes, Jenkins, Ansible

CERTIFICATIONS:
- AWS Certified Cloud Practitioner (July 2025)
- AWS Certified AI Practitioner (Dec 2025)
- Deep Learning.ai Specialization (Coursera, Sep 2023)

KEY PROJECTS:
1. AutoE2E Testing Framework - Ansible-based infrastructure-as-code, CLI E2E testing, reduced QA setup by 80%
2. Support Sage - AI customer support agent using LangGraph & RAG for order management and ticket escalation
3. TRUST Agents - Multi-agent fact-checking with 4 LLM agents, 65.2% accuracy on LIAR dataset
4. Resume Analyzer - 9-agent LangGraph pipeline, Redis caching, Resilience4j circuit breakers, 100 concurrent users
5. ChatBook - Real-time chat app (React, Node, MongoDB, Socket.io)
6. Image Captioning - CNN+LSTM model, BLEU-1 score 0.48
7. Student Survey App - Spring Boot, Kubernetes, Jenkins CI/CD, 99.9% uptime

EXPERIENCE:
- Associate Software Engineer at Backflipt (Jan-Dec 2023) - React.js, Spring Boot

CONTACT:
- Email: gautamashastry@gmail.com
- Location: Fairfax, VA
- GitHub: github.com/GautamaShastry
- LinkedIn: linkedin.com/in/satya2603`

export const sendMessage = createAsyncThunk(
    'chatbot/sendMessage',
    async (message, { rejectWithValue }) => {
        try {
            const response = await fetch(import.meta.env.VITE_CHATBOT_API_URL || '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, context: PORTFOLIO_CONTEXT })
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
