import { useRef, useMemo, useCallback } from 'react'
import aboutPic from "../assets/projects/image_1.webp"
import resume from "../assets/projects/Satya_SDE_Amazon.pdf"
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { FaDownload, FaCode, FaServer, FaBrain, FaStar } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

const About = () => {
    const { t } = useTranslation()
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    
    const y = useTransform(scrollYProgress, [0, 1], [100, -100])
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 10])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
    
    const stats = useMemo(() => [
        { icon: FaCode, labelKey: "about.stat_frontend", value: "React, JS", color: "from-blue-500 to-cyan-500" },
        { icon: FaServer, labelKey: "about.stat_backend", value: "Node, Java", color: "from-green-500 to-emerald-500" },
        { icon: FaBrain, labelKey: "about.stat_ai", value: "LLM, RAG", color: "from-purple-500 to-pink-500" },
    ], [])

    const softSkills = useMemo(() => [
        t('about.skill_problem'),
        t('about.skill_team'),
        t('about.skill_agile'),
        t('about.skill_clean')
    ], [t])

    // Staggered text reveal animation - memoized
    const textReveal = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.02,
            }
        }
    }), [])

    const letterReveal = useMemo(() => ({
        hidden: { opacity: 0, y: 50, rotateX: -90 },
        visible: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }), [])

    return (
        <section id='about' className='py-20 relative overflow-hidden' ref={containerRef}>
            {/* Animated background gradient orbs */}
            <motion.div 
                className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                style={{ y, rotate }}
            />
            <motion.div 
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
                style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
            />
            
            {/* Floating stars decoration */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute text-purple-500/30"
                    style={{
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 3) * 25}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        delay: i * 0.5,
                    }}
                >
                    <FaStar size={12 + i * 2} />
                </motion.div>
            ))}

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative z-10"
            >
                <motion.span 
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-block"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                >
                    {t('about.title')}
                </motion.span>
                <motion.h2 
                    className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'
                    variants={textReveal}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {t('about.subtitle').split('').map((char, i) => (
                        <motion.span key={i} variants={letterReveal} className="inline-block">
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                    ))}
                </motion.h2>
            </motion.div>
            <div className='flex flex-wrap items-center gap-12 relative z-10 pl-8 lg:pl-16'>
                <motion.div
                    initial={{ opacity: 0, x: -100, rotateY: -30 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className='w-full lg:w-5/12 pl-8'
                    style={{ perspective: "1000px" }}
                >
                    <div className="relative group ml-8">
                        {/* Animated gradient border */}
                        <motion.div 
                            className="absolute -inset-1 rounded-2xl opacity-75 blur-sm"
                            style={{
                                background: "linear-gradient(45deg, #a855f7, #6366f1, #ec4899, #a855f7)",
                                backgroundSize: "400% 400%",
                            }}
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* 3D tilt effect on image */}
                        <motion.div 
                            className="relative"
                            whileHover={{ 
                                rotateY: 5, 
                                rotateX: -5,
                                scale: 1.02,
                            }}
                            transition={{ duration: 0.3 }}
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <img 
                                src={aboutPic} 
                                alt="about" 
                                className='rounded-2xl w-full max-w-md mx-auto shadow-2xl relative z-10'
                                width="400"
                                height="400"
                                loading="lazy" 
                            />
                            
                            {/* Reflection effect */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ transform: "translateZ(20px)" }}
                            />
                        </motion.div>
                        
                        {/* Orbiting stat cards - adjusted positions */}
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.labelKey}
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ 
                                    delay: 0.5 + idx * 0.2, 
                                    type: "spring",
                                    stiffness: 200,
                                }}
                                whileHover={{ 
                                    scale: 1.15, 
                                    rotate: 5,
                                    boxShadow: "0 20px 40px rgba(168, 85, 247, 0.3)",
                                }}
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                className={`absolute ${
                                    idx === 0 ? "-top-6 right-0 lg:-right-6" : idx === 1 ? "top-1/2 left-0 lg:-left-4" : "-bottom-6 right-8"
                                } px-4 py-3 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-700 backdrop-blur-sm z-20`}
                                style={{
                                    animationDelay: `${idx * 0.3}s`,
                                }}
                            >
                                <motion.div
                                    className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                                >
                                    <stat.icon className="text-white text-lg" />
                                </motion.div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{t(stat.labelKey)}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className='w-full lg:w-6/12'
                >
                    {/* Animated heading with gradient */}
                    <motion.h3 
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-4 relative inline-block"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="relative z-10">{t('about.passionate')}</span>
                        <motion.span
                            className="absolute bottom-0 left-0 h-3 bg-purple-500/20 -z-0"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />
                    </motion.h3>
                    
                    {/* Text with word-by-word reveal */}
                    <motion.p 
                        className='text-gray-600 dark:text-gray-400 leading-relaxed mb-6'
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.02 }
                            }
                        }}
                    >
                        {t('about.description').split(' ').map((word, i) => (
                            <motion.span
                                key={i}
                                className="inline-block mr-1"
                                variants={{
                                    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                                    visible: { opacity: 1, y: 0, filter: "blur(0px)" }
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.p>
                    
                    {/* Animated skill pills with stagger */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {softSkills.map((skill, idx) => (
                            <motion.span 
                                key={skill} 
                                className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm cursor-default relative overflow-hidden group"
                                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * idx, type: "spring" }}
                                whileHover={{ 
                                    scale: 1.1, 
                                    backgroundColor: "rgba(168, 85, 247, 0.2)",
                                    color: "#a855f7",
                                }}
                            >
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "100%" }}
                                    transition={{ duration: 0.5 }}
                                />
                                <span className="relative z-10">{skill}</span>
                            </motion.span>
                        ))}
                    </div>
                    
                    {/* Animated download button with particles */}
                    <motion.a
                        href={resume}
                        download="satya_resume.pdf"
                        className='relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 overflow-hidden group'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {/* Animated background */}
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                            style={{ backgroundSize: "200% 100%" }}
                            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        {/* Sparkle particles */}
                        {[...Array(5)].map((_, i) => (
                            <motion.span
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                                style={{
                                    left: `${20 + i * 15}%`,
                                    top: "50%",
                                }}
                                animate={{
                                    y: [-10, -30],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                        
                        <motion.span
                            className="relative z-10"
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                            <FaDownload />
                        </motion.span>
                        <span className="relative z-10">{t('about.download_cv')}</span>
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}

export default About
