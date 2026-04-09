import { useMemo } from 'react'
import { FaHeart, FaGamepad } from 'react-icons/fa'
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import { NAV_LINK } from '../constants'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '../store/hooks'
import { openGame } from '../store/slices/gameSlice'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const { t } = useTranslation()
    const dispatch = useAppDispatch()

    const scrollToTop = useMemo(() => () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const socialLinks = useMemo(() => [
        { Icon: FaLinkedin, href: NAV_LINK.linkedin },
        { Icon: FaGithub, href: NAV_LINK.github },
        { Icon: FaInstagram, href: NAV_LINK.instagram },
    ], [])

    return (
        <footer className="py-12 border-t border-gray-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-4">
                <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                    <motion.div whileHover={{ scale: 1.05 }} onClick={scrollToTop} className="cursor-pointer">
                        <span className="text-2xl font-bold gradient-text">Satya</span>
                    </motion.div>
                    
                    {/* Secret Game Trigger */}
                    <motion.button
                        onClick={() => dispatch(openGame())}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-500/20 transition-colors"
                        title="Play a game to unlock secret content!"
                    >
                        <FaGamepad size={20} />
                    </motion.button>
                    
                    <div className='flex items-center gap-4'>
                        {socialLinks.map(({ Icon, href }, idx) => (
                            <motion.a
                                key={idx}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 transition-colors"
                            >
                                <Icon size={20} />
                            </motion.a>
                        ))}
                    </div>
                    <div className='text-center md:text-right'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>© {currentYear} Satya Subrahmanya Gautama Shastry Bulusu Venkata. {t('footer.rights')}</p>
                        <p className='mt-1 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center md:justify-end gap-1'>
                            {t('footer.built_with')} <FaHeart className='text-red-500' /> React & Tailwind
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
