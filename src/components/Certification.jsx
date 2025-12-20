import { motion } from 'framer-motion'
import { CERTIFICATIONS } from '../constants'
import { FaAward, FaExternalLinkAlt, FaBookOpen } from 'react-icons/fa'

const Certification = () => {
    return (
        <section id='certification' className='py-20'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Achievements
                </span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    Certifications
                </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {CERTIFICATIONS.map((cert, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.15)" }}
                        className="relative p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-2xl" />
                        <div className="relative">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
                                    <FaAward size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className='font-bold text-gray-900 dark:text-white'>{cert.title}</h3>
                                    <p className='text-sm text-purple-500'>{cert.issuer}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Issued: {cert.issueDate}
                                    {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                                </span>
                            </div>
                            {cert.description && (
                                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3'>
                                    {cert.description}
                                </p>
                            )}
                            <div className='flex gap-3'>
                                <motion.a
                                    href={cert.URL}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors'
                                >
                                    <FaExternalLinkAlt size={12} />
                                    View Certificate
                                </motion.a>
                                <motion.a
                                    href={cert.prepareURL}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='inline-flex items-center gap-2 px-4 py-2 border border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl text-sm font-medium hover:bg-purple-500/10 transition-colors'
                                >
                                    <FaBookOpen size={12} />
                                    Prepare
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Certification
