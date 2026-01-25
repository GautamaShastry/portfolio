import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { TECH_LINKS } from '../constants'
import { useTranslation } from 'react-i18next'
import SkillsChart from './SkillsChart'

const Technologies = () => {
    const { t } = useTranslation()
    const containerRef = useRef(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    // Wave animation for grid items
    const getWaveDelay = (index, total) => {
        const cols = 6
        const row = Math.floor(index / cols)
        const col = index % cols
        return (row + col) * 0.05
    }

    return (
        <section id='tech' className='py-20 relative overflow-hidden' ref={containerRef}>
            {/* Animated circuit board background */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
                <svg className="w-full h-full">
                    <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <motion.path
                            d="M10 10 L90 10 L90 50 L50 50 L50 90 L10 90 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        <circle cx="10" cy="10" r="3" fill="currentColor" />
                        <circle cx="90" cy="10" r="3" fill="currentColor" />
                        <circle cx="50" cy="50" r="3" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#circuit)" />
                </svg>
            </div>

            {/* Floating gradient orbs */}
            <motion.div
                className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative z-10"
            >
                <motion.span 
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-block"
                    animate={{ 
                        boxShadow: [
                            "0 0 0 0 rgba(168, 85, 247, 0)",
                            "0 0 0 10px rgba(168, 85, 247, 0.1)",
                            "0 0 0 0 rgba(168, 85, 247, 0)",
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {t('skills.title')}
                </motion.span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    {t('skills.subtitle')}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t('skills.description')}
                </p>
            </motion.div>

            {/* Tech Icons Grid with Wave Animation */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6 relative z-10"
            >
                {TECH_LINKS.map(({ name, Icon, link, colorClass }, index) => (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0, scale: 0, rotateY: -180 }}
                        whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                            duration: 0.6, 
                            delay: getWaveDelay(index, TECH_LINKS.length),
                            type: "spring",
                            stiffness: 100,
                        }}
                        whileHover={{ 
                            scale: 1.15, 
                            y: -10, 
                            rotateY: 10,
                            boxShadow: "0 25px 50px rgba(168, 85, 247, 0.3)",
                        }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.open(link, '_blank')}
                        onHoverStart={() => setHoveredIndex(index)}
                        onHoverEnd={() => setHoveredIndex(null)}
                        className="group relative p-4 md:p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 cursor-pointer transition-colors hover:border-purple-500/50 overflow-hidden"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Ripple effect on hover */}
                        <AnimatePresence>
                            {hoveredIndex === index && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 2, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ borderRadius: "50%", transformOrigin: "center" }}
                                />
                            )}
                        </AnimatePresence>
                        
                        {/* Glowing border animation */}
                        <motion.div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                            style={{
                                background: "linear-gradient(45deg, transparent, rgba(168, 85, 247, 0.3), transparent)",
                                backgroundSize: "200% 200%",
                            }}
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        <div className="relative flex flex-col items-center">
                            <motion.div
                                animate={hoveredIndex === index ? {
                                    rotateY: [0, 360],
                                } : {}}
                                transition={{ duration: 0.8 }}
                            >
                                <Icon className={`text-4xl md:text-5xl ${colorClass} transition-transform group-hover:scale-110`} />
                            </motion.div>
                            <motion.span 
                                className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center font-medium"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {name}
                            </motion.span>
                        </div>
                        
                        {/* Particle burst on hover */}
                        <AnimatePresence>
                            {hoveredIndex === index && (
                                <>
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1 h-1 bg-purple-500 rounded-full"
                                            initial={{ 
                                                x: "50%", 
                                                y: "50%", 
                                                scale: 0 
                                            }}
                                            animate={{ 
                                                x: `${50 + Math.cos(i * 60 * Math.PI / 180) * 50}%`,
                                                y: `${50 + Math.sin(i * 60 * Math.PI / 180) * 50}%`,
                                                scale: [0, 1, 0],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{ duration: 0.6, delay: i * 0.05 }}
                                        />
                                    ))}
                                </>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>

            {/* Skills Chart */}
            <SkillsChart />
        </section>
    )
}

export default Technologies
