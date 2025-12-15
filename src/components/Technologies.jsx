import { motion } from 'framer-motion'
import { TECH_LINKS } from '../constants'

const Technologies = () => {
    return (
        <section id='tech' className='py-20'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    My Skills
                </span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    Technologies I Work With
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    A collection of tools and technologies I use to bring ideas to life
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6"
            >
                {TECH_LINKS.map(({ name, Icon, link, colorClass }, index) => (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ 
                            scale: 1.1, 
                            y: -5,
                            boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(link, '_blank')}
                        className="group relative p-4 md:p-6 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 cursor-pointer transition-colors hover:border-purple-500/50"
                    >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:to-indigo-500/10 transition-all" />
                        
                        <div className="relative flex flex-col items-center">
                            <Icon className={`text-4xl md:text-5xl ${colorClass} transition-transform group-hover:scale-110`} />
                            <span className="mt-2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {name}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    )
}

export default Technologies
