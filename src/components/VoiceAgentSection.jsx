import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMicrophone, FaStop, FaRobot, FaUser } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
    askVoice,
    setRecording,
    selectVoiceAgentState,
    openCopyCard,
    closeCopyCard
} from '../store/slices/voiceAgentSlice'
import { endConversation } from '../lib/chatSession'
import { trackEvent } from '../lib/analytics'
import ConversationCopyCard from './ConversationCopyCard'

// Speech is transcribed in the browser (Web Speech API); only the text goes to the backend,
// which answers with Claude on Bedrock and speaks the answer with Amazon Polly.
//
// Hands-free conversation: one tap starts it. The agent greets the visitor and asks who they
// are, then loops listen -> answer -> speak -> listen. A turn ends after ~2s of quiet (not at
// the first pause), so long questions are captured whole. If nobody speaks, the agent asks
// whether there are any other questions; only a second silence ends the conversation. The
// visitor can end it any time with the button.
const SpeechRecognition = typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : undefined
const isSupported = Boolean(SpeechRecognition)

const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '')
// The voice agent is English-only: it listens for English and answers in English whatever the
// site language is (speech recognition and the natural voices are tuned for English).
const VOICE_LANGUAGE = 'en'
const RECOGNITION_LOCALE = 'en-US'
const END_OF_TURN_SILENCE_MS = 2000   // quiet after speaking = the visitor has finished their question
const NO_SPEECH_TIMEOUT_MS = 10000    // nothing said at all this long = silence

const VoiceAgentSection = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { isRecording, isProcessing, conversation, error, copyCard } = useAppSelector(selectVoiceAgentState)

    const recognitionRef = useRef(null)
    const audioRef = useRef(null)
    const conversationEndRef = useRef(null)
    const activeRef = useRef(false)          // hands-free conversation running?
    const silentTurnsRef = useRef(0)
    const copyCardOpenRef = useRef(false)
    const timersRef = useRef({ silence: null, noSpeech: null })
    const promptCacheRef = useRef({})
    const listenRef = useRef(() => {})
    const liveTextRef = useRef('')          // latest words heard, including not-yet-final ones

    const [active, setActive] = useState(false)
    const [speaking, setSpeaking] = useState(false)
    const [liveText, setLiveText] = useState('')
    const [greeting, setGreeting] = useState(null)
    const [micError, setMicError] = useState(null)
    const language = VOICE_LANGUAGE

    useEffect(() => {
        copyCardOpenRef.current = Boolean(copyCard)
    }, [copyCard])

    const clearTimers = () => {
        clearTimeout(timersRef.current.silence)
        clearTimeout(timersRef.current.noSpeech)
    }

    const stopConversation = useCallback(() => {
        activeRef.current = false
        setActive(false)
        clearTimers()
        recognitionRef.current?.abort()
        audioRef.current?.pause()
        setSpeaking(false)
        setLiveText('')
        dispatch(setRecording(false))
    }, [dispatch])

    // Plays MP3 audio; resolves when it finishes (or right away if the browser blocks playback)
    const playAudio = useCallback((base64) => new Promise((resolve) => {
        audioRef.current?.pause()
        const audio = new Audio(`data:audio/mpeg;base64,${base64}`)
        audioRef.current = audio
        const done = () => { setSpeaking(false); resolve() }
        audio.onended = done
        audio.onerror = done
        setSpeaking(true)
        audio.play().catch(done)
    }), [])

    // Greeting / "any other questions?" / goodbye, spoken by the same voice (cached per language)
    const speakPrompt = useCallback(async (kind) => {
        const key = `${kind}:${language}`
        try {
            if (!promptCacheRef.current[key]) {
                const response = await fetch(`${API_URL}/api/voice/prompt?kind=${kind}&language=${language}`)
                if (!response.ok) throw new Error('prompt failed')
                promptCacheRef.current[key] = await response.json()
            }
            const prompt = promptCacheRef.current[key]
            if (kind === 'greeting') setGreeting(prompt.text)
            if (activeRef.current) await playAudio(prompt.audio_base64)
        } catch {
            /* a missing prompt shouldn't stop the conversation */
        }
    }, [language, playAudio])

    // Silence: ask if there are any other questions; a second silence ends the conversation
    const handleSilence = useCallback(async () => {
        silentTurnsRef.current += 1
        if (silentTurnsRef.current === 1) {
            await speakPrompt('checkin')
            if (activeRef.current) listenRef.current()
        } else {
            await speakPrompt('goodbye')
            stopConversation()
        }
    }, [speakPrompt, stopConversation])

    const listen = useCallback(() => {
        if (!activeRef.current || copyCardOpenRef.current) return
        setMicError(null)
        setLiveText('')

        const recognition = new SpeechRecognition()
        recognition.lang = RECOGNITION_LOCALE
        recognition.continuous = true       // don't stop at the first pause
        recognition.interimResults = true   // show words as they're spoken
        recognition.maxAlternatives = 1
        recognitionRef.current = recognition

        let finalText = ''
        let heardSomething = false
        let blocked = false
        const endTurn = () => recognition.stop()

        recognition.onresult = (event) => {
            let interim = ''
            finalText = ''
            for (const result of event.results) {
                if (result.isFinal) finalText += result[0].transcript
                else interim += result[0].transcript
            }
            const text = `${finalText} ${interim}`.trim()
            if (text) {
                heardSomething = true
                setLiveText(text)
                // Restart the end-of-turn countdown on every word
                clearTimeout(timersRef.current.noSpeech)
                clearTimeout(timersRef.current.silence)
                timersRef.current.silence = setTimeout(endTurn, END_OF_TURN_SILENCE_MS)
            }
        }
        recognition.onerror = (event) => {
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                blocked = true
                setMicError(t('voiceAgent.mic_denied'))
            }
        }
        recognition.onend = () => {
            clearTimers()
            dispatch(setRecording(false))
            if (recognitionRef.current !== recognition || !activeRef.current) return
            const question = (finalText || (heardSomething ? liveTextRef.current : '')).trim()
            setLiveText('')
            if (blocked) {
                stopConversation()
            } else if (question) {
                silentTurnsRef.current = 0
                trackEvent('voice_question_asked', { language })
                dispatch(askVoice({ transcript: question, language }))
            } else {
                handleSilence()
            }
        }

        try {
            recognition.start()
            dispatch(setRecording(true))
            timersRef.current.noSpeech = setTimeout(endTurn, NO_SPEECH_TIMEOUT_MS)
        } catch {
            setMicError(t('voiceAgent.mic_denied'))
            stopConversation()
        }
    }, [dispatch, handleSilence, language, stopConversation, t])

    // Interim words can be lost if recognition stops before they're finalized; keep the latest
    useEffect(() => {
        liveTextRef.current = liveText
    }, [liveText])

    useEffect(() => {
        listenRef.current = listen
    }, [listen])

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, [conversation, copyCard, liveText])

    // Speak each new answer, then listen for the next question
    useEffect(() => {
        const last = conversation[conversation.length - 1]
        if (!last?.audioBase64 || !activeRef.current) return
        playAudio(last.audioBase64).then(() => listenRef.current())
    }, [conversation, playAudio])

    // A failed request ends the hands-free loop rather than retrying forever
    useEffect(() => {
        if (error) {
            toast.error(error)
            stopConversation()
        }
    }, [error, stopConversation])

    // Leaving the page: stop everything and send the conversation transcript to the site owner
    useEffect(() => () => {
        activeRef.current = false
        clearTimeout(timersRef.current.silence)
        clearTimeout(timersRef.current.noSpeech)
        recognitionRef.current?.abort()
        audioRef.current?.pause()
        endConversation()
    }, [])

    const handleMicClick = async () => {
        if (active) {
            stopConversation()
            return
        }
        activeRef.current = true
        silentTurnsRef.current = 0
        setActive(true)
        trackEvent('voice_conversation_started', { language })
        // Greet and ask who they are on the first start; later starts go straight to listening
        if (conversation.length === 0) await speakPrompt('greeting')
        listenRef.current()
    }

    const finishCopyCard = (result) => {
        dispatch(closeCopyCard())
        copyCardOpenRef.current = false
        if (result === 'sent') toast.success(t('conversationCopy.sent'))
        if (!speaking && !isProcessing) listenRef.current()
    }

    const status = !active
        ? t('voiceAgent.tap_to_start')
        : isProcessing
            ? t('voiceAgent.processing')
            : speaking
                ? t('voiceAgent.speaking')
                : isRecording
                    ? t('voiceAgent.listening')
                    : copyCard
                        ? t('voiceAgent.paused')
                        : t('voiceAgent.processing')

    if (!isSupported) {
        return (
            <section className="py-20 max-w-2xl mx-auto text-center">
                <p className="text-gray-600 dark:text-gray-400">{t('voiceAgent.unsupported')}</p>
            </section>
        )
    }

    const AgentBubble = ({ children }) => (
        <div className="flex gap-3">
            <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-gray-200 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 shrink-0">
                <FaRobot size={12} />
            </div>
            <div className="max-w-[80%] p-3 rounded-2xl rounded-bl-md text-sm bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200">
                {children}
            </div>
        </div>
    )
    const VisitorBubble = ({ children, live = false }) => (
        <div className="flex gap-3 flex-row-reverse">
            <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center bg-purple-500 text-white shrink-0">
                <FaUser size={12} />
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl rounded-br-md text-sm text-white ${live ? 'bg-purple-400 italic' : 'bg-purple-500'}`}>
                {children}
            </div>
        </div>
    )

    return (
        <section className="py-20 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10 relative z-10"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-block">
                    {t('voiceAgent.title')}
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {t('voiceAgent.subtitle')}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t('voiceAgent.description')}
                </p>
                <p className="mt-3 inline-block px-3 py-1 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200">
                    {t('voiceAgent.english_only')}
                </p>
            </motion.div>

            <div className="max-w-2xl mx-auto">
                <div className="flex flex-col items-center gap-4 mb-10">
                    <motion.button
                        onClick={handleMicClick}
                        aria-label={active ? t('voiceAgent.end') : t('voiceAgent.tap_to_start')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-8 rounded-full text-white shadow-lg ${
                            active ? 'bg-red-500 shadow-red-500/30' : 'bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-500/30'
                        }`}
                    >
                        {(isRecording || speaking) && (
                            <motion.span
                                className={`absolute inset-0 rounded-full ${speaking ? 'bg-indigo-500' : 'bg-red-500'}`}
                                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                        <span className="relative z-10">
                            {active ? <FaStop size={28} /> : <FaMicrophone size={28} />}
                        </span>
                    </motion.button>
                    <p className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">{status}</p>
                    {active && <p className="text-xs text-gray-400 dark:text-gray-500">{t('voiceAgent.tap_to_end')}</p>}
                    {micError && <p className="text-sm text-red-500">{micError}</p>}
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-md">
                        {t('voiceAgent.transcript_notice')}
                        {conversation.length > 0 && !copyCard && (
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
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto p-2">
                    {greeting && <AgentBubble>{greeting}</AgentBubble>}
                    <AnimatePresence initial={false}>
                        {conversation.map((turn) => (
                            <motion.div
                                key={turn.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3"
                            >
                                <VisitorBubble>{turn.transcript}</VisitorBubble>
                                <AgentBubble>{turn.answer}</AgentBubble>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {liveText && <VisitorBubble live>{liveText}</VisitorBubble>}
                    {isProcessing && (
                        <AgentBubble>
                            <span className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                        </AgentBubble>
                    )}
                    {copyCard && !isProcessing && (
                        <div className="max-w-md mx-auto">
                            <ConversationCopyCard initialEmail={copyCard.email} onDone={finishCopyCard} />
                        </div>
                    )}
                    <div ref={conversationEndRef} />
                </div>
            </div>
        </section>
    )
}

export default VoiceAgentSection
