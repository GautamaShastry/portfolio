import { motion } from 'framer-motion'
import { FaGraduationCap, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'
import { EDUCATION } from '../constants'

const Education = () => {
    return (
        <section id='education' className='py-20'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Education
                </span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    Academic Background
                </h2>
            </motion.div>

            <div className="max-w-5xl mx-auto">
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-indigo-500 to-purple-500 hidden md:block" />

                    {EDUCATION.map((edu, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative mb-12 last:mb-0"
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-8 w-4 h-4 bg-purple-500 rounded-full transform -translate-x-1/2 ring-4 ring-purple-500/20 hidden md:block" />

                            <div className="md:ml-20">
                                <motion.div
                                    whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(168, 85, 247, 0.15)" }}
                                    className="relative overflow-hidden bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-lg"
                                >
                                    {/* Gradient accent */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />

                                    <div className="p-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-purple-500/25">
                                                    <FaGraduationCap size={28} />
                                                </div>
                                                <div>
                                                    <h3 className='font-bold text-xl text-gray-900 dark:text-white'>
                                                        {edu.degree}
                                                    </h3>
                                                    <p className='text-purple-500 font-semibold text-lg'>{edu.school}</p>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <FaMapMarkerAlt className="text-purple-400" />
                                                            {edu.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FaCalendar className="text-purple-400" />
                                                            {edu.period}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {edu.gpa && (
                                                <div className="flex-shrink-0">
                                                    <div className="px-4 py-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20">
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">GPA</p>
                                                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{edu.gpa}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {edu.coursework && (
                                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-700">
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">Relevant Coursework</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {edu.coursework.map((course, idx) => (
                                                        <motion.span
                                                            key={idx}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            whileInView={{ opacity: 1, scale: 1 }}
                                                            viewport={{ once: true }}
                                                            transition={{ delay: 0.1 * idx }}
                                                            className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-default"
                                                        >
                                                            {course}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
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
