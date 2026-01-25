import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaPaperPlane, FaTimes, FaUser } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

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

const Chatbot = () => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)

    // Initialize greeting message and update when language changes
    useEffect(() => {
        setMessages([{ role: 'assistant', content: t('chatbot.greeting') }])
    }, [t])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch(import.meta.env.VITE_CHATBOT_API_URL || '/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, context: PORTFOLIO_CONTEXT })
            })
            if (!response.ok) throw new Error('API error')
            const data = await response.json()
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch (error) {
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: t('chatbot.error')
            }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg shadow-purple-500/30 ${isOpen ? 'hidden' : ''}`}
            >
                <FaRobot size={24} />
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-700 flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full"><FaRobot size={18} /></div>
                                <div>
                                    <h3 className="font-semibold">{t('chatbot.title')}</h3>
                                    <p className="text-xs text-white/80">{t('chatbot.subtitle')}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                <FaTimes size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300'}`}>
                                        {msg.role === 'user' ? <FaUser size={12} /> : <FaRobot size={12} />}
                                    </div>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line ${msg.role === 'user' ? 'bg-purple-500 text-white rounded-br-md' : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-md'}`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-neutral-700">
                                        <FaRobot size={12} className="text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-neutral-800 p-3 rounded-2xl rounded-bl-md">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-neutral-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('chatbot.placeholder')}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-purple-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaPaperPlane size={14} />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Chatbot
