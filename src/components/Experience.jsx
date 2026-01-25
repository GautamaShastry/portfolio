import { useRef, useState } from 'react'
import { EXPERIENCES } from '../constants'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FaBriefcase, FaChevronDown } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'

const Experience = () => {
    const { t } = useTranslation()
    const containerRef = useRef(null)
    const [expandedIndex, setExpandedIndex] = useState(null)
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    
    // Animated timeline progress
    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
    
    return (
        <section id='work' className='py-20 relative overflow-hidden' ref={containerRef}>
            {/* Animated background particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative z-10"
            >
                <motion.span 
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-block"
                    whileHover={{ scale: 1.1 }}
                >
                    {t('experience.title')}
                </motion.span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    {t('experience.subtitle')}
                </h2>
            </motion.div>
            
            <div className="relative max-w-4xl mx-auto">
                {/* Animated timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 dark:bg-neutral-700 transform md:-translate-x-1/2 overflow-hidden">
                    <motion.div 
                        className="w-full bg-gradient-to-b from-purple-500 via-indigo-500 to-pink-500"
                        style={{ height: lineHeight }}
                    />
                </div>
                
                {EXPERIENCES.map((experience, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ 
                            duration: 0.8, 
                            delay: index * 0.2,
                            type: "spring",
                            stiffness: 100,
                        }}
                        className={`relative flex flex-col md:flex-row gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Animated timeline dot */}
                        <motion.div 
                            className="absolute left-0 md:left-1/2 w-5 h-5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transform -translate-x-1/2 z-10"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                            whileHover={{ scale: 1.5 }}
                        >
                            <motion.div
                                className="absolute inset-0 rounded-full bg-purple-500"
                                animate={{ 
                                    scale: [1, 2, 1],
                                    opacity: [0.5, 0, 0.5],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </motion.div>
                        
                        {/* Date badge */}
                        <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                            <motion.span 
                                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full text-sm text-purple-500 font-medium"
                                whileHover={{ scale: 1.05, boxShadow: "0 5px 20px rgba(168, 85, 247, 0.2)" }}
                            >
                                {experience.period}
                            </motion.span>
                        </div>
                        
                        {/* Experience card with 3D effect */}
                        <motion.div 
                            className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-8 md:pl-0`}
                            style={{ perspective: "1000px" }}
                        >
                            <motion.div 
                                className="relative p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-lg overflow-hidden cursor-pointer"
                                whileHover={{ 
                                    rotateY: index % 2 === 0 ? -5 : 5,
                                    rotateX: 5,
                                    scale: 1.02,
                                    boxShadow: "0 30px 60px rgba(168, 85, 247, 0.2)",
                                }}
                                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                {/* Animated gradient border */}
                                <motion.div
                                    className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                                    style={{
                                        background: "linear-gradient(45deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3))",
                                        backgroundSize: "200% 200%",
                                        padding: "2px",
                                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                        maskComposite: "exclude",
                                    }}
                                    animate={{
                                        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                
                                {/* Shine effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <motion.div 
                                            className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <FaBriefcase />
                                        </motion.div>
                                        <div className="flex-1">
                                            <h3 className='font-bold text-gray-900 dark:text-white'>{experience.role}</h3>
                                            <p className='text-sm text-purple-500 font-medium'>{experience.company}</p>
                                        </div>
                                        <motion.div
                                            animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                                            className="text-gray-400"
                                        >
                                            <FaChevronDown />
                                        </motion.div>
                                    </div>
                                    
                                    <AnimatePresence>
                                        <motion.p 
                                            className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'
                                            initial={{ height: "3rem", overflow: "hidden" }}
                                            animate={{ 
                                                height: expandedIndex === index ? "auto" : "3rem",
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {experience.description}
                                        </motion.p>
                                    </AnimatePresence>
                                    
                                    {/* Animated tech tags */}
                                    <div className='flex flex-wrap gap-2'>
                                        {experience.technologies.map((tech, idx) => (
                                            <motion.span 
                                                key={idx} 
                                                className='px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-medium'
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 * idx }}
                                                whileHover={{ 
                                                    scale: 1.1, 
                                                    backgroundColor: "rgba(168, 85, 247, 0.3)",
                                                }}
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Experience
