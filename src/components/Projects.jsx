import { useState, useRef, memo, useMemo, useCallback } from 'react'
import { PROJECTS } from '../constants'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaExpand } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

const categories = [
    { id: 'all', label: 'filter_all' },
    { id: 'ai', label: 'filter_ai' },
    { id: 'fullstack', label: 'filter_fullstack' },
    { id: 'devops', label: 'filter_devops' },
]

// Tag projects with categories
const taggedProjects = PROJECTS.map(project => {
    const techs = project.technologies.map(t => t.toLowerCase())
    let category = 'fullstack'
    
    if (techs.some(t => ['langgraph', 'rag', 'gpt-4', 'ai agents', 'bert', 'tensorflow', 'cnn', 'lstm', 'nlp', 'llm', 'deep learning', 'agentic ai'].includes(t))) {
        category = 'ai'
    } else if (techs.some(t => ['kubernetes', 'docker', 'jenkins', 'ansible', 'rancher', 'github actions'].includes(t))) {
        category = 'devops'
    }
    
    return { ...project, category }
})

// 3D Card component with tilt effect - memoized
const ProjectCard = memo(({ project, index }) => {
    const cardRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)
    
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    
    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 })
    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 })
    
    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set(e.clientX - centerX)
        y.set(e.clientY - centerY)
    }
    
    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
        setIsHovered(false)
    }

    return (
        <motion.div
            ref={cardRef}
            layout
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 15 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ 
                rotateX, 
                rotateY,
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="group relative bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden shadow-lg cursor-pointer"
        >
            {/* Animated gradient border */}
            <motion.div
                className="absolute inset-0 rounded-2xl z-0"
                style={{
                    background: "linear-gradient(45deg, #a855f7, #6366f1, #ec4899, #a855f7)",
                    backgroundSize: "400% 400%",
                    padding: "2px",
                }}
                animate={{
                    backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            />
            
            <div className="relative bg-white dark:bg-neutral-800/50 rounded-2xl m-[2px] overflow-hidden">
                {/* Category Badge with glow */}
                <motion.div 
                    className="absolute top-4 left-4 z-20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                    <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        project.category === 'ai' 
                            ? 'bg-purple-500/90 text-white shadow-lg shadow-purple-500/30' 
                            : project.category === 'devops'
                            ? 'bg-blue-500/90 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-green-500/90 text-white shadow-lg shadow-green-500/30'
                    }`}>
                        {project.category.toUpperCase()}
                    </span>
                </motion.div>

                {/* Image with parallax effect */}
                <div className="relative h-48 overflow-hidden">
                    <motion.img 
                        src={project.image} 
                        alt={project.title} 
                        className='w-full h-full object-cover'
                        width="400"
                        height="192"
                        loading="lazy"
                        style={{
                            scale: isHovered ? 1.1 : 1,
                            transition: "scale 0.5s ease-out",
                        }}
                    />
                    
                    {/* Overlay with animated gradient */}
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    
                    {/* Floating action buttons */}
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-white/90 dark:bg-neutral-900/90 rounded-full text-gray-900 dark:text-white shadow-xl"
                            whileHover={{ scale: 1.2, rotate: 360, backgroundColor: "#a855f7", color: "#fff" }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            style={{ transform: "translateZ(50px)" }}
                        >
                            <FaGithub size={20} />
                        </motion.a>
                        {project.link && (
                            <motion.a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-4 bg-white/90 dark:bg-neutral-900/90 rounded-full text-gray-900 dark:text-white shadow-xl"
                                whileHover={{ scale: 1.2, rotate: -360, backgroundColor: "#6366f1", color: "#fff" }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                style={{ transform: "translateZ(50px)" }}
                            >
                                <FaExternalLinkAlt size={18} />
                            </motion.a>
                        )}
                    </motion.div>
                    
                    {/* Scan line effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent h-20"
                        animate={{ y: isHovered ? ["-100%", "500%"] : "-100%" }}
                        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
                    />
                </div>

                {/* Content with 3D depth */}
                <div className="p-6 relative" style={{ transform: "translateZ(30px)" }}>
                    <motion.h3 
                        className='text-xl font-bold text-gray-900 dark:text-white mb-2'
                        animate={{ color: isHovered ? "#a855f7" : "" }}
                        transition={{ duration: 0.3 }}
                    >
                        {project.title}
                    </motion.h3>
                    <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3'>
                        {project.description}
                    </p>
                    
                    {/* Animated tech stack */}
                    <div className='flex flex-wrap gap-2'>
                        {project.technologies.slice(0, 4).map((tech, idx) => (
                            <motion.span 
                                key={idx} 
                                className='px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium'
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + idx * 0.05 }}
                                whileHover={{ 
                                    scale: 1.1, 
                                    backgroundColor: "rgba(168, 85, 247, 0.2)",
                                    color: "#a855f7",
                                }}
                            >
                                {tech}
                            </motion.span>
                        ))}
                        {project.technologies.length > 4 && (
                            <motion.span 
                                className='px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-xs font-medium'
                                whileHover={{ scale: 1.1 }}
                            >
                                +{project.technologies.length - 4}
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
})

ProjectCard.displayName = 'ProjectCard'

const Projects = () => {
    const [activeFilter, setActiveFilter] = useState('all')
    const { t } = useTranslation()

    const filteredProjects = useMemo(() => 
        activeFilter === 'all' 
            ? taggedProjects 
            : taggedProjects.filter(p => p.category === activeFilter),
        [activeFilter]
    )

    const handleFilterChange = useCallback((filterId) => {
        setActiveFilter(filterId)
    }, [])

    return (
        <section id='projects' className='py-20 relative overflow-hidden'>
            {/* Animated background mesh */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20 pointer-events-none">
                <svg className="w-full h-full">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-purple-500/30" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
            
            {/* Floating orbs */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, ${['rgba(168, 85, 247, 0.15)', 'rgba(99, 102, 241, 0.15)', 'rgba(236, 72, 153, 0.15)'][i]}, transparent)`,
                        left: `${20 + i * 30}%`,
                        top: `${10 + i * 25}%`,
                    }}
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 relative z-10"
            >
                <motion.span 
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-block"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                >
                    {t('projects.title')}
                </motion.span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    {t('projects.subtitle')}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t('projects.description')}
                </p>
            </motion.div>

            {/* Animated Filter Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-3 mb-12 relative z-10"
            >
                {categories.map((cat, idx) => (
                    <motion.button
                        key={cat.id}
                        onClick={() => handleFilterChange(cat.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all overflow-hidden ${
                            activeFilter === cat.id
                                ? 'text-white shadow-lg shadow-purple-500/25'
                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        {activeFilter === cat.id && (
                            <motion.div
                                layoutId="activeFilter"
                                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{t(`projects.${cat.label}`)}</span>
                    </motion.button>
                ))}
            </motion.div>

            {/* Projects Grid with staggered animation */}
            <motion.div 
                layout 
                className="grid md:grid-cols-2 gap-8 relative z-10"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard key={project.title} project={project} index={index} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    )
}

export default Projects
