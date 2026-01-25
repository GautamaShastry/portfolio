import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { CERTIFICATIONS } from '../constants'
import { FaAward, FaExternalLinkAlt, FaBookOpen, FaMedal, FaCertificate } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const Certification = () => {
    const { t } = useTranslation()
    const containerRef = useRef(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
    
    // Staggered card animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            }
        }
    }
    
    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 100, 
            rotateX: -30,
            scale: 0.8,
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            }
        }
    }
    
    return (
        <section id='certification' className='py-20 relative overflow-hidden' ref={containerRef}>
            {/* Animated certificate/medal background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-purple-500/5"
                        style={{
                            left: `${5 + i * 10}%`,
                            top: `${10 + (i % 5) * 18}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            rotate: [0, 15, -15, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 5 + i,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                    >
                        {i % 2 === 0 ? <FaMedal size={40 + i * 3} /> : <FaCertificate size={40 + i * 3} />}
                    </motion.div>
                ))}
            </div>
            
            {/* Glowing orbs */}
            <motion.div
                className="absolute top-20 right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1.3, 1, 1.3],
                    opacity: [0.3, 0.2, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative z-10"
            >
                <motion.span 
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-flex items-center gap-2"
                    whileHover={{ scale: 1.1 }}
                    animate={{
                        boxShadow: [
                            "0 0 0 0 rgba(168, 85, 247, 0)",
                            "0 0 0 10px rgba(168, 85, 247, 0.1)",
                            "0 0 0 0 rgba(168, 85, 247, 0)",
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        🏆
                    </motion.span>
                    {t('certifications.title')}
                </motion.span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    {t('certifications.subtitle')}
                </h2>
            </motion.div>
            
            <motion.div 
                className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                style={{ scale }}
            >
                {CERTIFICATIONS.map((cert, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        onHoverStart={() => setHoveredIndex(index)}
                        onHoverEnd={() => setHoveredIndex(null)}
                        className="relative"
                        style={{ 
                            perspective: "1000px",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <motion.div
                            className="relative p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden h-full transition-shadow duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/30"
                        >
                            {/* Animated gradient border */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    background: "linear-gradient(45deg, rgba(168, 85, 247, 0.5), rgba(99, 102, 241, 0.5), rgba(236, 72, 153, 0.5), rgba(168, 85, 247, 0.5))",
                                    backgroundSize: "400% 400%",
                                    padding: "2px",
                                    opacity: hoveredIndex === index ? 1 : 0,
                                    transition: "opacity 0.3s",
                                }}
                                animate={{
                                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            
                            {/* Glowing background effect */}
                            <motion.div 
                                className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                                style={{
                                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)",
                                }}
                                animate={{
                                    scale: hoveredIndex === index ? [1, 1.5, 1] : 1,
                                    opacity: hoveredIndex === index ? [0.3, 0.6, 0.3] : 0.2,
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            
                            {/* Shine sweep effect */}
                            <AnimatePresence>
                                {hoveredIndex === index && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                        initial={{ x: "-100%", opacity: 0 }}
                                        animate={{ x: "200%", opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                    />
                                )}
                            </AnimatePresence>
                            
                            <div className="relative z-10">
                                <div className="flex items-start gap-4 mb-4">
                                    {/* Animated award icon */}
                                    <motion.div 
                                        className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white shadow-lg shadow-purple-500/30"
                                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                        animate={hoveredIndex === index ? {
                                            boxShadow: [
                                                "0 10px 30px rgba(168, 85, 247, 0.3)",
                                                "0 15px 40px rgba(168, 85, 247, 0.5)",
                                                "0 10px 30px rgba(168, 85, 247, 0.3)",
                                            ]
                                        } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <FaAward size={24} />
                                    </motion.div>
                                    <div className="flex-1">
                                        <motion.h3 
                                            className='font-bold text-gray-900 dark:text-white'
                                            animate={{ color: hoveredIndex === index ? "#a855f7" : "" }}
                                        >
                                            {cert.title}
                                        </motion.h3>
                                        <p className='text-sm text-purple-500 font-medium'>{cert.issuer}</p>
                                    </div>
                                </div>
                                
                                <motion.div 
                                    className="mb-4 flex items-center gap-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                >
                                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded-full">
                                        📅 Issued: {cert.issueDate}
                                    </span>
                                    {cert.expiryDate && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-neutral-700 rounded-full">
                                            ⏰ Expires: {cert.expiryDate}
                                        </span>
                                    )}
                                </motion.div>
                                
                                {cert.description && (
                                    <motion.p 
                                        className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3'
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 + 0.4 }}
                                    >
                                        {cert.description}
                                    </motion.p>
                                )}
                                
                                {/* Animated buttons */}
                                <div className='flex gap-3'>
                                    <motion.a
                                        href={cert.URL}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='relative inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium overflow-hidden group'
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <motion.span
                                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                                            initial={{ x: "100%" }}
                                            whileHover={{ x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                        <FaExternalLinkAlt size={12} className="relative z-10" />
                                        <span className="relative z-10">{t('certifications.view')}</span>
                                    </motion.a>
                                    <motion.a
                                        href={cert.prepareURL}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='relative inline-flex items-center gap-2 px-4 py-2 border border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-medium overflow-hidden'
                                        whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.1)" }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <motion.span
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <FaBookOpen size={12} />
                                        </motion.span>
                                        {t('certifications.prepare')}
                                    </motion.a>
                                </div>
                            </div>
                            
                            {/* Corner ribbon effect */}
                            <motion.div
                                className="absolute -top-1 -right-1 w-20 h-20 overflow-hidden"
                                initial={{ scale: 0, rotate: 45 }}
                                whileInView={{ scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                            >
                                <div className="absolute top-3 -right-6 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs py-1 text-center transform rotate-45 shadow-lg">
                                    ✓ Verified
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}

export default Certification
