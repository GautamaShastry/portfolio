import React, { useRef, useState } from 'react'
import { CONTACT, NAV_LINK } from '../constants'
import { motion } from 'framer-motion'
import { CiLocationOn } from 'react-icons/ci'
import { FaInstagram, FaPhone } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { FaLinkedin } from 'react-icons/fa'
import emailjs from '@emailjs/browser'
import { toast } from 'react-toastify'

const Contact = () => {
    const formRef = useRef(null);
    const [isSending, setIsSending] = useState(false); // default loading state

    /* Send email via emailjs */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isSending) return; // prevent multiple submissions
        setIsSending(true);

        try {
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );
            // alert("Message sent successfully!");
            toast.success("Message sent successfully!");
            formRef.current.reset();
        } catch (error) {
            console.error("Failed to send message:", error);
            // alert("Failed to send message. Please try again later.");
            toast.error("Failed to send message. Please try again!");
        } finally {
            setIsSending(false); // re-enable on success or failure
        }
    }
    return (
        <div id='contact' className='border-b border-neutral-900 pb-20 mb-5'>
            <motion.h1 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -100 }} transition={{ duration: 0.5 }} className='my-12 text-center text-4xl'>
                Get in Touch
            </motion.h1>
            <div className='mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:gap-20'>
                <div className='flex-1 text-center md:text-left'>
                    <motion.p whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -100}} transition={{ duration: 1 }} className='my-4 flex items-center justify-center gap-2 md:justify-start'><CiLocationOn />{CONTACT.address}</motion.p>
                    <motion.p whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 100}} transition={{ duration: 1 }} className='my-4 flex items-center justify-center gap-2 md:justify-start'><FaPhone />{CONTACT.phoneNo}</motion.p>
                    <a href={`mailto:${CONTACT.email}`} className='my-4 flex items-center justify-center gap-2 md:justify-start underline transition-colors hover:text-purple-700'><MdEmail />{CONTACT.email}</a>
                    <div className='mt-6 flex justify-center gap-6 md:justify-start'>
                        <a href={NAV_LINK.linkedin} target='_blank' rel="noopener noreferrer" className='transition-colors hover:text-purple-700'><FaLinkedin size={28} /></a>
                        <a href={NAV_LINK.instagram} target='_blank' rel="noopener noreferrer" className='transition-colors hover:text-purple-700'><FaInstagram size={28} /></a>
                    </div>
                </div>
                <div className='flex-1 bg-transparent hover:border-purple-700 hover:border-2 rounded-md'>
                    <form ref={formRef} onSubmit={handleSubmit} className='space-y-4 rounded-lg bg-neutral-800/60 p-6 backdrop-blur'>
                        <div>
                            <label className='mb-2 block text-sm'>Your Name <span className='text-red-700'>*</span></label>
                            <input type="text" name='name' required className='w-full rounded bg-neutral-900 p-2 outline-none focus:ring-2 focus:ring-purple-700' />
                        </div>
                        <div>
                            <label className='mb-2 block text-sm'>Your Email <span className='text-red-700'>*</span></label>
                            <input type="text" name='email' required className='w-full rounded bg-neutral-900 p-2 outline-none focus:ring-2 focus:ring-purple-700' />
                        </div>
                        <div>
                            <label className='mb-2 block text-sm'>Your Message <span className='text-red-700'>*</span></label>
                            <textarea name="message" rows='7' required className='w-full rounded bg-neutral-900 p-2 outline-none focus:ring-2 focus:ring-purple-700' />
                        </div>
                        <button type='submit' disabled={isSending} className={`w-full py-2 font-semibold rounded transition-colors ${isSending ? 'bg-purple-700 cursor-not-allowed' : 'bg-purple-700 hover:bg-transparent border-2 border-purple-700'}`}>{isSending ? 'Loading...' : 'Submit'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact