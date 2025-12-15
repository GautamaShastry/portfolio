import { EXPERIENCES } from '../constants'
import { motion } from 'framer-motion'
import { FaBriefcase } from 'react-icons/fa6'

const Experience = () => {
    return (
        <section id='work' className='py-20'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Career
                </span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    Work Experience
                </h2>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-500 transform md:-translate-x-1/2" />

                {EXPERIENCES.map((experience, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                            index % 2 === 0 ? 'md:flex-row-reverse' : ''
                        }`}
                    >
                        {/* Timeline dot */}
                        <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 ring-4 ring-purple-500/20" />

                        {/* Date */}
                        <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-left md:pl-12' : 'md:text-right md:pr-12'}`}>
                            <span className="text-sm text-purple-500 font-medium">
                                {experience.period}
                            </span>
                        </div>

                        {/* Content */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-8 md:pl-0`}
                        >
                            <div className="p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <FaBriefcase className="text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className='font-bold text-gray-900 dark:text-white'>
                                            {experience.role}
                                        </h3>
                                        <p className='text-sm text-purple-500'>
                                            {experience.company}
                                        </p>
                                    </div>
                                </div>
                                
                                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4'>
                                    {experience.description}
                                </p>
                                
                                <div className='flex flex-wrap gap-2'>
                                    {experience.technologies.map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className='px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-medium'
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Experience
