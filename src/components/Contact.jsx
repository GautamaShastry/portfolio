import { useRef, useState } from 'react'
import { CONTACT, NAV_LINK } from '../constants'
import { motion } from 'framer-motion'
import { FaLocationDot, FaPhone, FaLinkedin, FaInstagram, FaGithub, FaPaperPlane } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import emailjs from '@emailjs/browser'
import { toast } from 'react-toastify'

const contactInfo = [
    { icon: FaLocationDot, label: "Location", value: CONTACT.address },
    { icon: FaPhone, label: "Phone", value: CONTACT.phoneNo },
    { icon: MdEmail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
]

const socialLinks = [
    { icon: FaLinkedin, href: NAV_LINK.linkedin, label: "LinkedIn" },
    { icon: FaGithub, href: NAV_LINK.github, label: "GitHub" },
    { icon: FaInstagram, href: NAV_LINK.instagram, label: "Instagram" },
]

const Contact = () => {
    const formRef = useRef(null)
    const [isSending, setIsSending] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSending) return
        setIsSending(true)
        try {
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            )
            toast.success("Message sent successfully!")
            formRef.current.reset()
        } catch (error) {
            console.error("Failed to send message:", error)
            toast.error("Failed to send message. Please try again!")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <section id='contact' className='py-20'>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Contact
                </span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    Get In Touch
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Have a project in mind or want to collaborate? Feel free to reach out!
                </p>
            </motion.div>
            <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-12'>
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Let's talk about everything!</h3>
                        <p className="text-gray-600 dark:text-gray-400">Don't like forms? Send me an email directly or connect with me on social media.</p>
                    </div>
                    <div className="space-y-4">
                        {contactInfo.map((item, idx) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-4"
                            >
                                <div className="p-3 bg-purple-500/10 rounded-xl">
                                    <item.icon className="text-purple-500 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className="text-gray-900 dark:text-white hover:text-purple-500 transition-colors">{item.value}</a>
                                    ) : (
                                        <p className="text-gray-900 dark:text-white">{item.value}</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Find me on</p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.1, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-3 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:text-purple-500 hover:border-purple-500/50 transition-all shadow-sm"
                                >
                                    <social.icon size={24} />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <form ref={formRef} onSubmit={handleSubmit} className='p-8 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-xl'>
                        <div className="space-y-6">
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Your Name <span className='text-red-500'>*</span></label>
                                <input type="text" name='name' required className='w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all' placeholder="John Doe" />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Your Email <span className='text-red-500'>*</span></label>
                                <input type="email" name='email' required className='w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all' placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Message <span className='text-red-500'>*</span></label>
                                <textarea name="message" rows='5' required className='w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none' placeholder="Your message here..." />
                            </div>
                            <motion.button
                                type='submit'
                                disabled={isSending}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isSending ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'} text-white shadow-lg shadow-purple-500/25`}
                            >
                                {isSending ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                                ) : (
                                    <><FaPaperPlane />Send Message</>
                                )}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    )
}

export default Contact
