import { useState, useEffect } from 'react'
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa6'
import { HiMenuAlt3, HiX } from 'react-icons/hi'
import { BsSun, BsMoon } from 'react-icons/bs'
import { Link, useLocation } from 'react-router-dom'
import { NAV_LINK } from '../constants'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectIsDark, toggleTheme } from '../store/slices/themeSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './LanguageSelector'

const navItems = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/projects', labelKey: 'nav.projects' },
    { path: '/experience', labelKey: 'nav.experience' },
    { path: '/contact', labelKey: 'nav.contact' },
]

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dispatch = useAppDispatch()
    const isDark = useAppSelector(selectIsDark)
    const { t } = useTranslation()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false)
    }, [location.pathname])

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                className={`rounded-2xl transition-all duration-300 ${
                    scrolled
                        ? 'bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-lg shadow-purple-500/10'
                        : 'bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm'
                }`}
            >
                <div className="flex items-center gap-2 px-4 py-2">
                    {/* Logo */}
                    <Link to="/">
                        <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="text-xl font-bold gradient-text mr-4"
                        >
                            G
                        </motion.span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all inline-block ${
                                        location.pathname === item.path
                                            ? 'bg-purple-500 text-white'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400'
                                    }`}
                                >
                                    {t(item.labelKey)}
                                </motion.span>
                            </Link>
                        ))}
                    </div>

                    <LanguageSelector />

                    {/* Theme Toggle */}
                    <motion.button
                        onClick={() => dispatch(toggleTheme())}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: 180 }}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-500 transition-all"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isDark ? 'moon' : 'sun'}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isDark ? <BsSun size={18} /> : <BsMoon size={18} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="px-6 pb-4 space-y-2">
                                {navItems.map((item, idx) => (
                                    <Link key={item.path} to={item.path}>
                                        <motion.span
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                                                location.pathname === item.path
                                                    ? 'bg-purple-500 text-white'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-500/10'
                                            }`}
                                        >
                                            {t(item.labelKey)}
                                        </motion.span>
                                    </Link>
                                ))}
                                <div className="flex justify-center gap-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                                    {[
                                        { Icon: FaLinkedin, link: NAV_LINK.linkedin },
                                        { Icon: FaGithub, link: NAV_LINK.github },
                                        { Icon: FaInstagram, link: NAV_LINK.instagram },
                                    ].map(({ Icon, link }, idx) => (
                                        <a key={idx} href={link} target="_blank" rel="noopener noreferrer">
                                            <Icon className="text-2xl text-gray-600 dark:text-gray-400 hover:text-purple-500" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    )
}

export default Navbar
