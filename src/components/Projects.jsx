import { PROJECTS } from '../constants'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

const Projects = () => {
    return (
        <section id='projects' className='py-20'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Portfolio
                </span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    Featured Projects
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    A showcase of my work, side projects, and experiments
                </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
                {PROJECTS.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group relative bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img src={project.image} alt={project.title} className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3 bg-white/90 dark:bg-neutral-900/90 rounded-full text-gray-900 dark:text-white hover:bg-purple-500 hover:text-white transition-colors"
                                >
                                    <FaGithub size={20} />
                                </motion.a>
                                {project.link && (
                                    <motion.a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 bg-white/90 dark:bg-neutral-900/90 rounded-full text-gray-900 dark:text-white hover:bg-purple-500 hover:text-white transition-colors"
                                    >
                                        <FaExternalLinkAlt size={18} />
                                    </motion.a>
                                )}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors'>
                                {project.title}
                            </h3>
                            <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3'>
                                {project.description}
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {project.technologies.slice(0, 4).map((tech, idx) => (
                                    <span key={idx} className='px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium'>
                                        {tech}
                                    </span>
                                ))}
                                {project.technologies.length > 4 && (
                                    <span className='px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-xs font-medium'>
                                        +{project.technologies.length - 4}
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Projects
