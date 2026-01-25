import { useState, useEffect } from 'react'
import profilePic from '../assets/projects/gautam_profile.png'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FaArrowDown, FaCode, FaRocket, FaBrain, FaDatabase, FaCloud } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const roles = [
    'Full Stack Developer',
    'AI Engineer',
    'Cloud Architect',
    'Problem Solver',
]

const floatingIcons = [
    { Icon: FaCode, delay: 0, x: -140, y: -100 },
    { Icon: FaRocket, delay: 0.5, x: 140, y: -80 },
    { Icon: FaBrain, delay: 1, x: -120, y: 100 },
    { Icon: FaDatabase, delay: 1.5, x: 130, y: 90 },
    { Icon: FaCloud, delay: 2, x: 0, y: -130 },
]

// Magnetic effect hook
const useMagnetic = () => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 150, damping: 15 })
    const springY = useSpring(y, { stiffness: 150, damping: 15 })
    
    const handleMouse = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set((e.clientX - centerX) * 0.3)
        y.set((e.clientY - centerY) * 0.3)
    }
    
    const reset = () => {
        x.set(0)
        y.set(0)
    }
    
    return { springX, springY, handleMouse, reset }
}

const Hero = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [roleIndex, setRoleIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const magnetic = useMagnetic()

    // Track mouse for parallax
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 50,
                y: (e.clientY - window.innerHeight / 2) / 50,
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

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

    const scrollToAbout = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }

    // Text reveal animation
    const letterAnimation = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.03, duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] }
        })
    }

    const name = "Gautama Shastry"

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden relative">
            {/* 3D Morphing blob background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute w-[600px] h-[600px] left-1/4 top-1/4 opacity-30"
                    animate={{
                        borderRadius: [
                            "60% 40% 30% 70%/60% 30% 70% 40%",
                            "30% 60% 70% 40%/50% 60% 30% 60%",
                            "60% 40% 30% 70%/60% 30% 70% 40%",
                        ],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    style={{
                        background: "linear-gradient(45deg, rgba(168, 85, 247, 0.4), rgba(99, 102, 241, 0.4))",
                        filter: "blur(60px)",
                        transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
                    }}
                />
                <motion.div
                    className="absolute w-[400px] h-[400px] right-1/4 bottom-1/4 opacity-20"
                    animate={{
                        borderRadius: [
                            "40% 60% 70% 30%/40% 50% 60% 50%",
                            "70% 30% 50% 50%/30% 30% 70% 70%",
                            "40% 60% 70% 30%/40% 50% 60% 50%",
                        ],
                        rotate: [360, 180, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{
                        background: "linear-gradient(135deg, rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.4))",
                        filter: "blur(50px)",
                        transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
                    }}
                />
                
                {/* Floating geometric shapes */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute ${i % 2 === 0 ? 'w-4 h-4' : 'w-6 h-6'} ${
                            i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-sm rotate-45' : 'rounded-none'
                        }`}
                        style={{
                            left: `${10 + (i * 12)}%`,
                            top: `${15 + ((i * 17) % 70)}%`,
                            background: `linear-gradient(${i * 45}deg, rgba(168, 85, 247, 0.6), rgba(99, 102, 241, 0.6))`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, i % 2 === 0 ? 20 : -20, 0],
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            <div className="flex flex-wrap items-center relative z-10">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="flex flex-col items-center lg:items-start">
                        {/* Animated badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
                            className="mb-4"
                        >
                            <motion.span 
                                className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-flex items-center gap-2"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)" }}
                            >
                                <motion.span
                                    animate={{ rotate: [0, 20, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                >
                                    👋
                                </motion.span>
                                {t('hero.welcome')}
                            </motion.span>
                        </motion.div>

                        {/* Animated name with letter-by-letter reveal */}
                        <motion.h1
                            initial="hidden"
                            animate="visible"
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
                        >
                            {t('hero.greeting')}{' '}
                            <span className="gradient-text inline-flex">
                                {name.split('').map((letter, i) => (
                                    <motion.span
                                        key={i}
                                        custom={i}
                                        variants={letterAnimation}
                                        className={letter === ' ' ? 'mr-2' : ''}
                                        whileHover={{ 
                                            scale: 1.2, 
                                            color: '#a855f7',
                                            transition: { duration: 0.1 } 
                                        }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        </motion.h1>

                        {/* Typewriter role */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mb-6 h-12"
                        >
                            <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300">
                                {displayText}
                            </span>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="inline-block w-1 h-8 bg-purple-500 ml-1 align-middle"
                            />
                        </motion.div>

                        {/* Description with stagger */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-gray-600 dark:text-gray-400 max-w-xl text-lg leading-relaxed mb-8"
                        >
                            {t('hero.description')}
                        </motion.p>

                        {/* Magnetic animated buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="flex flex-wrap gap-4"
                        >
                            <motion.button
                                style={{ x: magnetic.springX, y: magnetic.springY }}
                                onMouseMove={magnetic.handleMouse}
                                onMouseLeave={magnetic.reset}
                                whileHover={{ 
                                    scale: 1.05, 
                                    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/contact')}
                                className="group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 overflow-hidden"
                            >
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"
                                    initial={{ x: "100%" }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                {/* Shimmer effect */}
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                />
                                <span className="relative z-10">{t('hero.cta_contact')}</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/projects')}
                                className="group px-8 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-500/10 transition-colors relative overflow-hidden"
                            >
                                {/* Rotating border effect */}
                                <motion.span
                                    className="absolute inset-0 rounded-xl"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)",
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                                <span className="relative z-10">{t('hero.cta_projects')}</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Profile section with 3D floating icons */}
                <div className="w-full lg:w-1/2 mt-12 lg:mt-0 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1, delay: 0.3, type: "spring" }}
                        className="relative flex justify-center"
                        style={{ perspective: "1000px" }}
                    >
                        {/* Orbiting tech icons with 3D effect */}
                        {floatingIcons.map(({ Icon, delay, x, y }, idx) => (
                            <motion.div
                                key={idx}
                                className="absolute z-20 p-3 bg-white dark:bg-neutral-800 rounded-xl shadow-lg backdrop-blur-sm"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1,
                                    rotateY: [0, 360],
                                }}
                                transition={{
                                    opacity: { delay: 1 + delay, duration: 0.5 },
                                    scale: { delay: 1 + delay, duration: 0.5, type: "spring" },
                                    rotateY: { delay: 1.5 + delay, duration: 8, repeat: Infinity, ease: "linear" }
                                }}
                                style={{ 
                                    left: `calc(50% + ${x}px)`, 
                                    top: `calc(50% + ${y}px)`,
                                    transformStyle: "preserve-3d",
                                }}
                                whileHover={{ scale: 1.3, rotate: 15, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.4)" }}
                            >
                                <Icon className="text-purple-500 text-xl" />
                            </motion.div>
                        ))}

                        {/* DNA Helix rotating rings */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 flex items-center justify-center"
                                animate={{ 
                                    rotateX: i % 2 === 0 ? [0, 360] : [360, 0],
                                    rotateY: [0, 360],
                                }}
                                transition={{
                                    duration: 10 + i * 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <div 
                                    className={`w-${72 + i * 8} h-${72 + i * 8} md:w-${80 + i * 8} md:h-${80 + i * 8} rounded-full border-2 border-dashed`}
                                    style={{
                                        borderColor: `rgba(168, 85, 247, ${0.3 - i * 0.08})`,
                                        width: `${280 + i * 30}px`,
                                        height: `${280 + i * 30}px`,
                                    }}
                                />
                            </motion.div>
                        ))}

                        {/* Glowing pulsing rings */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={`pulse-${i}`}
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                    opacity: [0.6, 0],
                                    scale: [1, 1.8],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: i * 0.8,
                                    ease: "easeOut"
                                }}
                            >
                                <div 
                                    className="rounded-full"
                                    style={{
                                        width: "260px",
                                        height: "260px",
                                        border: "2px solid rgba(168, 85, 247, 0.5)",
                                        boxShadow: "0 0 20px rgba(168, 85, 247, 0.3)",
                                    }}
                                />
                            </motion.div>
                        ))}

                        {/* Profile image with 3D tilt */}
                        <motion.div 
                            className="relative z-10"
                            drag
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.1}
                            whileHover={{ 
                                scale: 1.05,
                                rotateY: 10,
                                rotateX: -5,
                            }}
                            style={{ 
                                transformStyle: "preserve-3d",
                                transform: `rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
                            }}
                        >
                            <motion.div 
                                className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden ring-4 ring-purple-500/50 shadow-2xl shadow-purple-500/20"
                                animate={{
                                    boxShadow: [
                                        "0 0 30px rgba(168, 85, 247, 0.3)",
                                        "0 0 60px rgba(168, 85, 247, 0.5)",
                                        "0 0 30px rgba(168, 85, 247, 0.3)",
                                    ],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <img src={profilePic} alt="Gautam" className="w-full h-full object-cover" />
                            </motion.div>
                            
                            {/* Animated availability badge */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                className="absolute bottom-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full shadow-lg flex items-center gap-2"
                            >
                                <motion.span 
                                    className="w-2 h-2 bg-white rounded-full"
                                    animate={{ 
                                        scale: [1, 1.5, 1], 
                                        opacity: [1, 0.5, 1],
                                        boxShadow: ["0 0 0px white", "0 0 10px white", "0 0 0px white"],
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                                {t('hero.available')}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.button
                    onClick={scrollToAbout}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    whileHover={{ scale: 1.2 }}
                    className="p-3 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-500 transition-colors"
                >
                    <FaArrowDown />
                </motion.button>
            </motion.div>
        </div>
    )
}

export default Hero
