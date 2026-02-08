import { useRef, useState, useCallback, useMemo, memo } from 'react'
import { CONTACT, NAV_LINK } from '../constants'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaLocationDot, FaPhone, FaLinkedin, FaInstagram, FaGithub, FaCalendarDays, FaEnvelope, FaRocket } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import emailjs from '@emailjs/browser'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

const socialLinks = [
    { icon: FaLinkedin, href: NAV_LINK.linkedin, label: "LinkedIn", color: "#0077b5" },
    { icon: FaGithub, href: NAV_LINK.github, label: "GitHub", color: "#333" },
    { icon: FaInstagram, href: NAV_LINK.instagram, label: "Instagram", color: "#e4405f" },
]

const CALENDLY_URL = "https://calendly.com/gautamashastry"

// Memoized floating envelope animation component
const FloatingEnvelope = memo(({ delay, index }) => (
    <motion.div
        className="absolute text-purple-500/10 pointer-events-none"
        style={{
            left: `${10 + (index * 12) % 80}%`,
            top: `${10 + (index * 15) % 80}%`,
        }}
        animate={{
            y: [0, -50, 0],
            x: [0, 20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration: 6 + index,
            repeat: Infinity,
            delay,
        }}
    >
        <FaEnvelope size={20 + index * 3} />
    </motion.div>
))

FloatingEnvelope.displayName = 'FloatingEnvelope'

// Memoized contact info item component
const ContactInfoItem = memo(({ item, idx, t }) => (
    <motion.div
        initial={{ opacity: 0, x: -50, rotateY: -30 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.15, type: "spring" }}
        whileHover={{ x: 10, scale: 1.02, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.15)" }}
        className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-700 cursor-pointer group"
    >
        <motion.div 
            className={`p-3 bg-gradient-to-r ${item.color} rounded-xl text-white shadow-lg`}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
        >
            <item.icon className="text-xl" />
        </motion.div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t(item.labelKey)}</p>
            {item.href ? (
                <a href={item.href} className="text-gray-900 dark:text-white hover:text-purple-500 transition-colors font-medium">
                    {item.value}
                </a>
            ) : (
                <p className="text-gray-900 dark:text-white font-medium">{item.value}</p>
            )}
        </div>
        <motion.div className="ml-auto opacity-0 group-hover:opacity-100 text-purple-500" initial={{ x: -10 }} whileHover={{ x: 0 }}>
            →
        </motion.div>
    </motion.div>
))

ContactInfoItem.displayName = 'ContactInfoItem'

// Memoized social link component
const SocialLink = memo(({ social, idx }) => (
    <motion.a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 30, rotate: -180 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 + 0.5, type: "spring" }}
        whileHover={{ scale: 1.2, y: -8, rotate: 360, boxShadow: `0 15px 30px ${social.color}40` }}
        whileTap={{ scale: 0.9 }}
        className="p-4 bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 text-gray-600 dark:text-gray-400 hover:text-white transition-all shadow-lg"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = social.color}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
    >
        <social.icon size={24} />
    </motion.a>
))

SocialLink.displayName = 'SocialLink'

const Contact = () => {
    const formRef = useRef(null)
    const containerRef = useRef(null)
    const [isSending, setIsSending] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const { t } = useTranslation()
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })
    
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

    const contactInfo = useMemo(() => [
        { icon: FaLocationDot, labelKey: "contact.location", value: CONTACT.address, color: "from-red-500 to-orange-500" },
        { icon: FaPhone, labelKey: "contact.phone", value: CONTACT.phoneNo, color: "from-green-500 to-emerald-500" },
        { icon: MdEmail, labelKey: "contact.email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, color: "from-blue-500 to-cyan-500" },
    ], [])

    const handleSubmit = useCallback(async (e) => {
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
    }, [isSending])

    const inputVariants = useMemo(() => ({
        idle: { scale: 1, boxShadow: "0 0 0 0 rgba(168, 85, 247, 0)" },
        focused: { 
            scale: 1.02, 
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.3)",
            transition: { duration: 0.3 }
        }
    }), [])

    const handleFocus = useCallback((field) => setFocusedField(field), [])
    const handleBlur = useCallback(() => setFocusedField(null), [])

    // Memoize envelope array to prevent recreation
    const envelopes = useMemo(() => [...Array(8)].map((_, i) => (
        <FloatingEnvelope key={i} delay={i * 0.5} index={i} />
    )), [])

    return (
        <section id='contact' className='py-20 relative overflow-hidden' ref={containerRef}>
            {/* Animated background blobs */}
            <motion.div
                className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
                style={{ y: backgroundY }}
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
                transition={{ duration: 20, repeat: Infinity, delay: 2 }}
            />
            
            {/* Floating envelopes */}
            {envelopes}

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16 relative z-10"
            >
                <motion.span 
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-flex items-center gap-2"
                    whileHover={{ scale: 1.1 }}
                    animate={{
                        boxShadow: [
                            "0 0 0 0 rgba(168, 85, 247, 0)",
                            "0 0 0 15px rgba(168, 85, 247, 0.1)",
                            "0 0 0 0 rgba(168, 85, 247, 0)",
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}>
                        ✉️
                    </motion.span>
                    {t('contact.title')}
                </motion.span>
                <h2 className='mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
                    {t('contact.subtitle')}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t('contact.description')}
                </p>
            </motion.div>

            <div className='max-w-6xl mx-auto grid md:grid-cols-2 gap-12 relative z-10'>
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="space-y-8"
                >
                    <div>
                        <motion.h3 
                            className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            {t('contact.talk')}
                        </motion.h3>
                        <motion.p 
                            className="text-gray-600 dark:text-gray-400"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            {t('contact.form_hint')}
                        </motion.p>
                    </div>

                    {/* Contact details */}
                    <div className="space-y-4">
                        {contactInfo.map((item, idx) => (
                            <ContactInfoItem key={item.labelKey} item={item} idx={idx} t={t} />
                        ))}
                    </div>

                    {/* Calendly Button */}
                    <motion.a
                        href={CALENDLY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 overflow-hidden group"
                    >
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                            style={{ backgroundSize: "200% 100%" }}
                            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                        {[...Array(5)].map((_, i) => (
                            <motion.span
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{ left: `${20 + i * 15}%`, top: "50%" }}
                                animate={{ y: [-5, -20, -5], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                        <motion.span className="relative z-10" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <FaCalendarDays size={20} />
                        </motion.span>
                        <span className="relative z-10">{t('contact.schedule')}</span>
                    </motion.a>

                    {/* Social links */}
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('contact.find_me')}</p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => (
                                <SocialLink key={social.label} social={social} idx={idx} />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, x: 100, rotateY: 20 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    style={{ perspective: "1000px" }}
                >
                    <motion.form 
                        ref={formRef} 
                        onSubmit={handleSubmit} 
                        className='relative p-8 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-xl overflow-hidden'
                        whileHover={{ boxShadow: "0 30px 60px rgba(168, 85, 247, 0.15)" }}
                    >
                        <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                                background: "linear-gradient(45deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3), rgba(168, 85, 247, 0.3))",
                                backgroundSize: "400% 400%",
                                padding: "2px",
                                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                maskComposite: "exclude",
                            }}
                            animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                            transition={{ duration: 5, repeat: Infinity }}
                        />
                        
                        <div className="space-y-6 relative z-10">
                            <motion.div variants={inputVariants} animate={focusedField === 'name' ? 'focused' : 'idle'}>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    {t('contact.name')} <span className='text-red-500'>*</span>
                                </label>
                                <motion.input 
                                    type="text" 
                                    name='name' 
                                    required 
                                    onFocus={() => handleFocus('name')}
                                    onBlur={handleBlur}
                                    className='w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all' 
                                    placeholder="John Doe"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </motion.div>
                            
                            <motion.div variants={inputVariants} animate={focusedField === 'email' ? 'focused' : 'idle'}>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    {t('contact.email')} <span className='text-red-500'>*</span>
                                </label>
                                <motion.input 
                                    type="email" 
                                    name='email' 
                                    required 
                                    onFocus={() => handleFocus('email')}
                                    onBlur={handleBlur}
                                    className='w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all' 
                                    placeholder="john@example.com"
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </motion.div>
                            
                            <motion.div variants={inputVariants} animate={focusedField === 'message' ? 'focused' : 'idle'}>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    {t('contact.message')} <span className='text-red-500'>*</span>
                                </label>
                                <motion.textarea 
                                    name="message" 
                                    rows='5' 
                                    required 
                                    onFocus={() => handleFocus('message')}
                                    onBlur={handleBlur}
                                    className='w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none' 
                                    placeholder="Your message here..."
                                    whileFocus={{ scale: 1.01 }}
                                />
                            </motion.div>
                            
                            <motion.button
                                type='submit'
                                disabled={isSending}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 overflow-hidden ${
                                    isSending ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                                } text-white shadow-lg shadow-purple-500/25`}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                                    style={{ backgroundSize: "200% 100%" }}
                                    animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                {isSending ? (
                                    <>
                                        <motion.div 
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full relative z-10"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <span className="relative z-10">{t('contact.sending')}</span>
                                    </>
                                ) : (
                                    <>
                                        <motion.span
                                            className="relative z-10"
                                            animate={{ y: [0, -3, 0], rotate: [0, -10, 10, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <FaRocket />
                                        </motion.span>
                                        <span className="relative z-10">{t('contact.send')}</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.form>
                </motion.div>
            </div>
        </section>
    )
}

export default Contact