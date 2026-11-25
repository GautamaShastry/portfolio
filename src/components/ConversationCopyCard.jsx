import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getSessionId } from '../lib/chatSession'
import { trackEvent } from '../lib/analytics'

const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Confirmation card for "email me a copy of this conversation". The assistant offers it (or the
// visitor clicks the link); nothing is sent until the visitor confirms the address here.
// onDone(result) is called with 'sent' or 'cancelled'.
const ConversationCopyCard = ({ initialEmail = '', onDone }) => {
    const { t } = useTranslation()
    const [email, setEmail] = useState(initialEmail || '')
    const [status, setStatus] = useState('idle') // idle | sending | error
    const [error, setError] = useState(null)
    const valid = EMAIL_RE.test(email.trim())

    const send = async (e) => {
        e.preventDefault()
        if (!valid || status === 'sending') return
        setStatus('sending')
        setError(null)
        try {
            const response = await fetch(`${API_URL}/api/conversations/send-copy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: getSessionId(), email: email.trim() })
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) throw new Error(typeof data.detail === 'string' ? data.detail : t('conversationCopy.failed'))
            trackEvent('conversation_copy_sent')
            onDone('sent')
        } catch (err) {
            setStatus('error')
            setError(err.message || t('conversationCopy.failed'))
        }
    }

    return (
        <form
            onSubmit={send}
            className="p-3 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 text-sm space-y-2"
        >
            <p className="font-medium text-gray-900 dark:text-white">{t('conversationCopy.title')}</p>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('conversationCopy.placeholder')}
                aria-label={t('conversationCopy.placeholder')}
                autoFocus={!initialEmail}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            <div className="flex gap-2 justify-end">
                <button
                    type="button"
                    onClick={() => onDone('cancelled')}
                    className="px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-neutral-800"
                >
                    {t('conversationCopy.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={!valid || status === 'sending'}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'sending' ? t('conversationCopy.sending') : t('conversationCopy.confirm')}
                </button>
            </div>
        </form>
    )
}

export default ConversationCopyCard
