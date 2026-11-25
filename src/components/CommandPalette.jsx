import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowRight, FaMagnifyingGlass } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

const CommandPalette = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState('')

    const commands = useMemo(() => [
        { id: 'home', label: t('command.home'), path: '/' },
        { id: 'projects', label: t('command.projects'), path: '/projects' },
        { id: 'experience', label: t('command.experience'), path: '/experience' },
        { id: 'blog', label: t('command.blog'), path: '/blog' },
        { id: 'voice', label: t('command.voice'), path: '/voice-agent' },
        { id: 'contact', label: t('command.contact'), path: '/contact' },
    ], [t])

    const filteredCommands = commands.filter((command) =>
        command.label.toLowerCase().includes(query.toLowerCase().trim())
    )

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                setOpen((value) => !value)
            }
            if (event.key === 'Escape') setOpen(false)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const goTo = (path) => {
        setOpen(false)
        setQuery('')
        navigate(path)
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={t('command.open')}
                title={t('command.shortcut')}
                className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur border border-gray-200 dark:border-neutral-700 text-xs text-gray-600 dark:text-gray-300 shadow-lg hover:border-purple-400 transition-colors"
            >
                <FaMagnifyingGlass size={12} aria-hidden="true" />
                <span>{t('command.search')}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 font-mono">⌘K</kbd>
            </button>

            {open && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
                    <div role="dialog" aria-modal="true" aria-label={t('command.title')} className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-neutral-700">
                            <FaMagnifyingGlass className="text-gray-400" aria-hidden="true" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={t('command.placeholder')}
                                aria-label={t('command.placeholder')}
                                className="flex-1 py-4 bg-transparent text-gray-900 dark:text-white outline-none"
                            />
                            <kbd className="text-xs text-gray-400">Esc</kbd>
                        </div>
                        <div className="p-2 max-h-72 overflow-y-auto">
                            {filteredCommands.length ? filteredCommands.map((command) => (
                                <button key={command.id} type="button" onClick={() => goTo(command.path)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-gray-700 dark:text-gray-200 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                    <span>{command.label}</span>
                                    <FaArrowRight size={12} aria-hidden="true" />
                                </button>
                            )) : <p className="p-4 text-sm text-gray-500">{t('command.empty')}</p>}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CommandPalette
