import { useState, useEffect } from 'react'
import profilePic from '../assets/projects/image_2.webp'
import { motion } from 'framer-motion'
import { FaArrowDown } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const roles = ['Full Stack Developer', 'AI Engineer', 'Cloud Architect', 'Problem Solver']

const Hero = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [roleIndex, setRoleIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    // Typewriter effect
    useEffect(() => {
        const currentRole = roles[roleIndex]
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (displayText.length < currentRole.length) {
                    setDisplayText(currentRole.slice(0, displayText.length + 1))
                } else {
                    setTimeout(() => setIsDeleting(true), 2000)
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1))
                } else {
                    setIsDeleting(false)
                    setRoleIndex((prev) => (prev + 1) % roles.length)
                }
            }
        }, isDeleting ? 50 : 100)
        return () => clearTimeout(timeout)
    }, [displayText, isDeleting, roleIndex])

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 relative">
            {/* Simple CSS background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 left-1/4 top-1/4 opacity-20 rounded-full blur-3xl bg-purple-500/50" />
                <div className="absolute w-80 h-80 right-1/4 bottom-1/4 opacity-15 rounded-full blur-3xl bg-indigo-500/50" />
            </div>

            <div className="flex flex-wrap items-center relative z-10">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="flex flex-col items-center lg:items-start">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-4"
                        >
                            <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-flex items-center gap-2">
                                👋 {t('hero.welcome')}
                            </span>
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            {t('hero.greeting')}{' '}
                            <span className="gradient-text">Gautama Shastry</span>
                        </motion.h1>

                        {/* Typewriter role */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-6 h-12"
                        >
                            <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300">
                                {displayText}
                            </span>
                            <span className="inline-block w-1 h-8 bg-purple-500 ml-1 align-middle animate-pulse" />
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-gray-600 dark:text-gray-400 max-w-xl text-lg leading-relaxed mb-8"
                        >
                            {t('hero.description')}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button
                                onClick={() => navigate('/contact')}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-xl hover:scale-105 transition-all"
                            >
                                {t('hero.cta_contact')}
                            </button>
                            <button
                                onClick={() => navigate('/projects')}
                                className="px-8 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-500/10 hover:scale-105 transition-all"
                            >
                                {t('hero.cta_projects')}
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Profile section */}
                <div className="w-full lg:w-1/2 mt-12 lg:mt-0 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative flex justify-center"
                    >
                        {/* Simple rotating ring */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div 
                                className="w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-dashed border-purple-500/30 animate-spin"
                                style={{ animationDuration: '20s' }}
                            />
                        </div>

                        {/* Profile image */}
                        <div className="relative z-10">
                            <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden ring-4 ring-purple-500/50 shadow-2xl shadow-purple-500/20 hover:scale-105 transition-transform">
                                <img 
                                    src={profilePic} 
                                    alt="Gautam" 
                                    className="w-full h-full object-cover" 
                                    width="288" 
                                    height="288" 
                                    loading="eager" 
                                />
                            </div>
                            
                            {/* Availability badge */}
                            <div className="absolute bottom-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full shadow-lg flex items-center gap-2">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                {t('hero.available')}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-500 transition-colors animate-bounce"
            >
                <FaArrowDown />
            </motion.button>
        </div>
    )
}

export default Hero