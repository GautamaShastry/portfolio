import aboutPic from "../assets/projects/gautam-logo.png"
import { ABOUT_TEXT } from '../constants'
import resume from "../assets/projects/Satya_Bulusu_Resume.pdf"
import { motion } from 'framer-motion'
import { FaDownload, FaCode, FaServer, FaBrain } from 'react-icons/fa6'

const stats = [
    { icon: FaCode, label: "Frontend", value: "React, Tailwind" },
    { icon: FaServer, label: "Backend", value: "Node, Java" },
    { icon: FaBrain, label: "ML/AI", value: "LLM, RAG" },
]

const About = () => {
    return (
        <section id='about' className='py-20'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    About Me
                </span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    Get to know me better
                </h2>
            </motion.div>

            <div className='flex flex-wrap items-center gap-12'>
                {/* Image Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='w-full lg:w-5/12'
                >
                    <div className="relative">
                        {/* Background decoration */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl opacity-20 blur-xl" />
                        
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                        >
                            <img
                                src={aboutPic}
                                alt="about"
                                className='rounded-2xl w-full max-w-md mx-auto shadow-2xl'
                            />
                        </motion.div>

                        {/* Floating stats cards */}
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
                                whileHover={{ scale: 1.1 }}
                                className={`absolute ${
                                    idx === 0 ? "-top-4 -right-4" :
                                    idx === 1 ? "top-1/2 -left-4" :
                                    "-bottom-4 right-8"
                                } px-4 py-3 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-100 dark:border-neutral-700`}
                            >
                                <stat.icon className="text-purple-500 text-xl mb-1" />
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className='w-full lg:w-6/12'
                >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Passionate about building great software
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-6'>
                        {ABOUT_TEXT}
                    </p>

                    {/* Skills highlight */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {["Problem Solving", "Team Collaboration", "Agile", "Clean Code"].map((skill) => (
                            <span
                                key={skill}
                                className="px-3 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <motion.a
                        href={resume}
                        download="gautam_resume.pdf"
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25'
                    >
                        <FaDownload />
                        Download Resume
                    </motion.a>
                </motion.div>
            </div>
        </section>
    )
}

export default About
