import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaPaperPlane, FaTimes, FaUser } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
    selectChatbotState,
    openChatbot,
    closeChatbot,
    addUserMessage,
    sendMessage,
    setGreeting,
    openCopyCard,
    closeCopyCard,
    addAssistantNote
} from '../store/slices/chatbotSlice'
import ConversationCopyCard from './ConversationCopyCard'
import { endConversation } from '../lib/chatSession'
import { trackEvent } from '../lib/analytics'

const Chatbot = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { isOpen, messages, isLoading, error, copyCard } = useAppSelector(selectChatbotState)
    const hasConversation = messages.some((m) => m.role === 'user')

    const finishCopyCard = (result) => {
        dispatch(closeCopyCard())
        if (result === 'sent') dispatch(addAssistantNote(t('conversationCopy.sent')))
    }
    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        dispatch(setGreeting(t('chatbot.greeting')))
    }, [t, dispatch])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, copyCard])

    // Quick replies under the greeting: who is the visitor? (sent as a normal message)
    const quickReplies = ['chatbot.quick_recruiter', 'chatbot.quick_hiring_manager', 'chatbot.quick_exploring']
    const showQuickReplies = messages.length === 1 && !isLoading

    const sendText = (text) => {
        trackEvent('chat_message_sent', { message_number: messages.filter((m) => m.role === 'user').length + 1 })
        dispatch(addUserMessage(text))
        dispatch(sendMessage(text))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        sendText(userMessage)
    }

    return (
        <>
            <motion.button
                aria-label={t('chatbot.open')}
                title={t('chatbot.open')}
                onClick={() => { dispatch(openChatbot()); trackEvent('chatbot_opened') }}
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
                            <button aria-label={t('chatbot.close')} title={t('chatbot.close')} onClick={() => { dispatch(closeChatbot()); endConversation() }} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                <FaTimes size={16} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300'}`}>
                                        {msg.role === 'user' ? <FaUser size={12} /> : <FaRobot size={12} />}
                                    </div>
                                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'whitespace-pre-line bg-purple-500 text-white rounded-br-md' : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-md'}`}>
                                        {msg.role === 'user' ? msg.content : (
                                            // Assistant replies may use light Markdown (bold, lists, links)
                                            <div className="space-y-2 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:mt-1 [&_a]:text-purple-600 dark:[&_a]:text-purple-400 [&_a]:underline [&_strong]:font-semibold">
                                                <ReactMarkdown
                                                    components={{ a: (props) => <a {...props} target="_blank" rel="noopener noreferrer" /> }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {showQuickReplies && (
                                <div className="flex flex-wrap gap-2 pl-11">
                                    {quickReplies.map((key) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => {
                                                // e.g. visitor_type: "recruiter" (no personal data)
                                                trackEvent('visitor_type_selected', { visitor_type: key.replace('chatbot.quick_', '') })
                                                sendText(t(key))
                                            }}
                                            className="px-3 py-1.5 text-xs rounded-full border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            {t(key)}
                                        </button>
                                    ))}
                                </div>
                            )}
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
                            {copyCard && !isLoading && (
                                <ConversationCopyCard initialEmail={copyCard.email} onDone={finishCopyCard} />
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        {error && <p className="px-4 pt-3 text-xs text-red-600 dark:text-red-400">{error}</p>}
                        <p className="px-4 pt-2 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                            {t('chatbot.transcript_notice')}
                            {hasConversation && !copyCard && (
                                <>
                                    {' '}
                                    <button
                                        type="button"
                                        onClick={() => dispatch(openCopyCard())}
                                        className="underline text-purple-600 dark:text-purple-400 hover:text-purple-700"
                                    >
                                        {t('conversationCopy.link')}
                                    </button>
                                </>
                            )}
                        </p>
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
