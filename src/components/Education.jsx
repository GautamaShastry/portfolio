import { useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { FaGraduationCap, FaCalendar, FaMapMarkerAlt, FaBook, FaTrophy } from 'react-icons/fa'
import { EDUCATION } from '../constants'
import { useTranslation } from 'react-i18next'

const Education = () => {
    const { t } = useTranslation()
    const containerRef = useRef(null)
    const [hoveredIndex, setHoveredIndex] = useState(null)
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    
    const backgroundRotate = useTransform(scrollYProgress, [0, 1], [0, 360])
    
    return (
        <section id='education' className='py-20 relative overflow-hidden' ref={containerRef}>
            {/* Animated floating books background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-purple-500/10"
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${15 + (i % 4) * 20}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 6 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                    >
                        <FaBook size={30 + i * 5} />
                    </motion.div>
                ))}
            </div>
            
            {/* Rotating gradient background */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
                style={{ rotate: backgroundRotate }}
            >
                <div className="w-full h-full rounded-full blur-3xl" 
                    style={{ background: "conic-gradient(from 0deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))" }}
                />
            </motion.div>

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
                >
                    <motion.span
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        🎓
                    </motion.span>
                    {t('education.title')}
                </motion.span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    {t('education.subtitle')}
                </h2>
            </motion.div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="relative">
                    {/* Animated timeline line with gradient */}
                    <motion.div 
                        className="absolute left-8 top-0 bottom-0 w-1 hidden md:block overflow-hidden rounded-full"
                        initial={{ height: 0 }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                        <motion.div
                            className="w-full h-full bg-gradient-to-b from-purple-500 via-indigo-500 to-pink-500"
                            animate={{
                                backgroundPosition: ["0% 0%", "0% 100%"],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{ backgroundSize: "100% 200%" }}
                        />
                    </motion.div>

                    {EDUCATION.map((edu, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -100, rotateY: -30 }}
                            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ 
                                duration: 0.8, 
                                delay: index * 0.3,
                                type: "spring",
                                stiffness: 100,
                            }}
                            className="relative mb-12 last:mb-0"
                            onHoverStart={() => setHoveredIndex(index)}
                            onHoverEnd={() => setHoveredIndex(null)}
                        >
                            {/* Animated timeline dot with pulse */}
                            <motion.div 
                                className="absolute left-8 w-4 h-4 transform -translate-x-1/2 hidden md:flex items-center justify-center z-10"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.3 + 0.5, type: "spring" }}
                            >
                                <motion.div
                                    className="w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                    animate={{
                                        boxShadow: hoveredIndex === index 
                                            ? ["0 0 0 0 rgba(168, 85, 247, 0.4)", "0 0 0 20px rgba(168, 85, 247, 0)", "0 0 0 0 rgba(168, 85, 247, 0.4)"]
                                            : "0 0 0 0 rgba(168, 85, 247, 0)",
                                    }}
                                    transition={{ duration: 1.5, repeat: hoveredIndex === index ? Infinity : 0 }}
                                />
                                {/* Orbiting particle */}
                                <motion.div
                                    className="absolute w-2 h-2 bg-pink-500 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    style={{ transformOrigin: "12px 0px" }}
                                />
                            </motion.div>

                            <div className="md:ml-20">
                                <motion.div
                                    className="relative overflow-hidden bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-lg"
                                    whileHover={{ 
                                        y: -10, 
                                        rotateX: 2,
                                        rotateY: -2,
                                        boxShadow: "0 30px 60px rgba(168, 85, 247, 0.2)",
                                    }}
                                    style={{ 
                                        transformStyle: "preserve-3d",
                                        perspective: "1000px",
                                    }}
                                >
                                    {/* Animated top gradient bar */}
                                    <motion.div 
                                        className="absolute top-0 left-0 right-0 h-1 overflow-hidden"
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.3 + 0.3, duration: 0.8 }}
                                    >
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"
                                            animate={{
                                                backgroundPosition: ["0% 0%", "100% 0%"],
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            style={{ backgroundSize: "200% 100%" }}
                                        />
                                    </motion.div>

                                    {/* Shine effect on hover */}
                                    <AnimatePresence>
                                        {hoveredIndex === index && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                                initial={{ x: "-100%" }}
                                                animate={{ x: "200%" }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.8 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    <div className="p-6 relative">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                {/* Animated icon */}
                                                <motion.div 
                                                    className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-500/25"
                                                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <FaGraduationCap size={28} />
                                                </motion.div>
                                                <div>
                                                    <motion.h3 
                                                        className='font-bold text-xl text-gray-900 dark:text-white'
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: index * 0.3 + 0.2 }}
                                                    >
                                                        {edu.degree}
                                                    </motion.h3>
                                                    <motion.p 
                                                        className='text-purple-500 font-semibold text-lg'
                                                        initial={{ opacity: 0, y: 10 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: index * 0.3 + 0.3 }}
                                                    >
                                                        {edu.school}
                                                    </motion.p>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <motion.span 
                                                            className="flex items-center gap-1"
                                                            whileHover={{ scale: 1.05, color: "#a855f7" }}
                                                        >
                                                            <FaMapMarkerAlt className="text-purple-400" />
                                                            {edu.location}
                                                        </motion.span>
                                                        <motion.span 
                                                            className="flex items-center gap-1"
                                                            whileHover={{ scale: 1.05, color: "#a855f7" }}
                                                        >
                                                            <FaCalendar className="text-purple-400" />
                                                            {edu.period}
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </div>

                                            {edu.gpa && (
                                                <motion.div 
                                                    className="flex-shrink-0"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    whileInView={{ scale: 1, rotate: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.3 + 0.5, type: "spring" }}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                >
                                                    <div className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20 relative overflow-hidden">
                                                        <motion.div
                                                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent"
                                                            animate={{ x: ["-100%", "100%"] }}
                                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                                        />
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1 relative z-10">
                                                            <FaTrophy className="text-yellow-500" />
                                                            {t('education.gpa')}
                                                        </p>
                                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 relative z-10">{edu.gpa}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {edu.coursework && (
                                            <motion.div 
                                                className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-700"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.3 + 0.4 }}
                                            >
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium flex items-center gap-2">
                                                    <FaBook className="text-purple-400" />
                                                    {t('education.coursework')}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {edu.coursework.map((course, idx) => (
                                                        <motion.span
                                                            key={idx}
                                                            className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium cursor-default relative overflow-hidden group"
                                                            initial={{ opacity: 0, scale: 0, rotate: -10 }}
                                                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: index * 0.1 + idx * 0.05, type: "spring" }}
                                                            whileHover={{ 
                                                                scale: 1.1, 
                                                                backgroundColor: "rgba(168, 85, 247, 0.2)",
                                                                color: "#a855f7",
                                                            }}
                                                        >
                                                            <motion.span
                                                                className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0"
                                                                initial={{ x: "-100%" }}
                                                                whileHover={{ x: "100%" }}
                                                                transition={{ duration: 0.5 }}
                                                            />
                                                            <span className="relative z-10">{course}</span>
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Education
