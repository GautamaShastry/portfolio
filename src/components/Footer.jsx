import React from 'react'
import { FaHeart, FaEnvelope } from 'react-icons/fa'
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div>
            <footer className="border-b border-neutral-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className='grid gap-6 sm:grid-cols-3 items-center text-center sm:text-left'>
                        <div>
                            <p className='text-sm text-neutral-400'>
                                © {currentYear} Gautam. All rights reserved.
                            </p>
                            <p className='mt-1 text-xs text-neutral-500 flex justify-center sm:justify-start items-center'>
                                Built with <FaHeart className='text-red-500 mx-1' aria-hidden="true" /> using React.js&nbsp;&amp;&nbsp;Tailwind&nbsp;CSS
                            </p>
                        </div>
                        <div className='flex justify-center'>
                            <motion.a 
                                whileHover={{ y: -4 }}
                                href="mailto:gautamashastry@gmail.com" 
                                className="text-neutral-400 hover:text-purple-400 transition-colors"
                                aria-label="Send me an email"
                                >
                                <FaEnvelope size={28} />
                            </motion.a>
                        </div>
                        <div className='text-xs text-neutral-600 sm:text-right'>
                            <p>
                                Designed&nbsp;&amp;&nbsp;developed with passion. <br className="hidden sm:inline" />
                                Always a work-in-progress. Will keep updating with new projects.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer