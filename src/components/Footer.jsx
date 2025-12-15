import { FaHeart } from 'react-icons/fa'
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import { NAV_LINK } from '../constants'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="py-12 border-t border-gray-200 dark:border-neutral-800">
            <div className="max-w-6xl mx-auto px-4">
                <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                    {/* Logo/Name */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={scrollToTop}
                        className="cursor-pointer"
                    >
                        <span className="text-2xl font-bold gradient-text">Gautam</span>
                    </motion.div>

                    {/* Social Links */}
                    <div className='flex items-center gap-4'>
                        {[
                            { Icon: FaLinkedin, href: NAV_LINK.linkedin },
                            { Icon: FaGithub, href: NAV_LINK.github },
                            { Icon: FaInstagram, href: NAV_LINK.instagram },
                        ].map(({ Icon, href }, idx) => (
                            <motion.a
                                key={idx}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2, y: -3 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-500 transition-colors"
                            >
                                <Icon size={20} />
                            </motion.a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className='text-center md:text-right'>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            © {currentYear} Gautam. All rights reserved.
                        </p>
                        <p className='mt-1 text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center md:justify-end gap-1'>
                            Built with <FaHeart className='text-red-500' /> using React & Tailwind
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
