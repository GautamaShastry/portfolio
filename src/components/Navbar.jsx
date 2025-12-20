import { useState, useEffect } from "react"
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa6"
import { HiMenuAlt3, HiX } from "react-icons/hi"
import { BsSun, BsMoon } from "react-icons/bs"
import { Link } from "react-router-dom"
import { NAV_LINK } from "../constants"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
    { id: "about", label: "About" },
    { id: "tech", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "work", label: "Experience" },
    { id: "contact", label: "Contact" },
]

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState("")
    const { isDark, toggleTheme } = useTheme()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
            const sections = navItems.map(item => document.getElementById(item.id))
            const scrollPos = window.scrollY + 100
            sections.forEach((section, index) => {
                if (section) {
                    const top = section.offsetTop
                    const height = section.offsetHeight
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(navItems[index].id)
                    }
                }
            })
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (id) => {
        const section = document.getElementById(id)
        if (section) section.scrollIntoView({ behavior: "smooth" })
        setIsMenuOpen(false)
    }

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className={`rounded-2xl transition-all duration-300 ${
                    scrolled
                        ? "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg shadow-lg shadow-purple-500/10"
                        : "bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
                }`}
            >
                <div className="flex items-center gap-2 px-4 py-2">
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <motion.button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                    activeSection === item.id
                                        ? "bg-purple-500 text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                            >
                                {item.label}
                            </motion.button>
                        ))}
                    </div>
                    <motion.button
                        onClick={toggleTheme}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9, rotate: 180 }}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-500 transition-all"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isDark ? "moon" : "sun"}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isDark ? <BsSun size={18} /> : <BsMoon size={18} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="md:hidden p-2 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
                    </motion.button>
                </div>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden overflow-hidden"
                        >
                            <div className="px-6 pb-4 space-y-2">
                                {navItems.map((item, idx) => (
                                    <motion.button
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
                                            activeSection === item.id
                                                ? "bg-purple-500 text-white"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-purple-500/10"
                                        }`}
                                    >
                                        {item.label}
                                    </motion.button>
                                ))}
                                <div className="flex justify-center gap-6 pt-4 border-t border-gray-200 dark:border-neutral-700">
                                    {[
                                        { Icon: FaLinkedin, link: NAV_LINK.linkedin },
                                        { Icon: FaGithub, link: NAV_LINK.github },
                                        { Icon: FaInstagram, link: NAV_LINK.instagram },
                                    ].map(({ Icon, link }, idx) => (
                                        <Link key={idx} to={link} target="_blank">
                                            <Icon className="text-2xl text-gray-600 dark:text-gray-400 hover:text-purple-500" />
                                        </Link>
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
