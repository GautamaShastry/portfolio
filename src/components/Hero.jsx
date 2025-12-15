import { HERO_CONTENT } from '../constants'
import profilePic from "../assets/projects/gautam_profile.png"
import { motion } from "framer-motion"
import { FaArrowDown } from "react-icons/fa6"

const Hero = () => {
    const scrollToAbout = () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className='min-h-screen flex items-center justify-center pt-20 pb-10'>
            <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-1/2 px-4">
                    <div className="flex flex-col items-center lg:items-start">
                        {/* Greeting */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-4"
                        >
                            <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                                👋 Welcome to my portfolio
                            </span>
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4'
                        >
                            Hi, I'm{" "}
                            <span className="gradient-text">Gautama Shastry</span>
                        </motion.h1>

                        {/* Role */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mb-6"
                        >
                            <span className='text-xl md:text-2xl lg:text-3xl font-semibold text-gray-600 dark:text-gray-300'>
                                Full Stack Developer
                            </span>
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="inline-block w-1 h-8 bg-purple-500 ml-2 align-middle"
                            />
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className='text-gray-600 dark:text-gray-400 max-w-xl text-lg leading-relaxed mb-8'
                        >
                            {HERO_CONTENT}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
                            >
                                Get in Touch
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                                className="px-8 py-3 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-500/10 transition-colors"
                            >
                                View Projects
                            </motion.button>
                        </motion.div>
                    </div>
                </div>

                {/* Profile Image */}
                <div className='w-full lg:w-1/2 mt-12 lg:mt-0 px-4'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative flex justify-center"
                    >
                        {/* Decorative elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-dashed border-purple-500/30" />
                        </motion.div>
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-dashed border-indigo-500/20" />
                        </motion.div>

                        {/* Image */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative z-10"
                        >
                            <div className="w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden ring-4 ring-purple-500/50 shadow-2xl shadow-purple-500/20">
                                <img
                                    src={profilePic}
                                    alt="Gautam"
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            {/* Status badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring" }}
                                className="absolute bottom-4 right-4 px-3 py-1 bg-green-500 text-white text-sm rounded-full shadow-lg flex items-center gap-2"
                            >
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                Available
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.button
                    onClick={scrollToAbout}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-3 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-purple-500/20 hover:text-purple-500 transition-colors"
                >
                    <FaArrowDown />
                </motion.button>
            </motion.div>
        </div>
    )
}

export default Hero
