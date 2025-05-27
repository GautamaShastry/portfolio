import React from 'react'
import aboutPic from "../assets/projects/gautam-logo.png"
import { ABOUT_TEXT } from '../constants'
import resume from "../assets/projects/Satya_SDE.pdf"
import { motion } from 'framer-motion'

const About = () => {
    return (
        <div id='about' className='border-b border-neutral-900 pb-4'>
            <motion.h1 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -100 }} transition={{ duration: 0.5 }} className='my-20 text-center text-4xl '>
                About Me
            </motion.h1>
            <div className='flex flex-wrap'>
                <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -100 }} transition={{ duration: 1 }} className='w-full lg:w-1/2 lg:p-8'>
                    <div className="flex items-center justify-center">
                        <img src={aboutPic} alt="about" className='rounded-2xl cursor-pointer lg:max-w-sm max-h-[450px] object-cover shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out'/>
                    </div>
                </motion.div>
                <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 100 }} transition={{ duration: 1 }} className='w-full lg:w-1/2'>
                    <div className='flex justify-center lg:justify-start'>
                        <p className='my-2 max-w-xl '>{ABOUT_TEXT}</p>
                    </div>
                    <div className='items-center justify-start flex'>
                        <a href={resume} download="gautam_resume.pdf" className='inline-block border mt-6 px-6 py-3 text-white bg-purple-600 rounded-lg transition-colors duration-300 hover:bg-transparent hover:border-purple-500'>
                            Download CV
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default About