import React from 'react'
import { HERO_CONTENT } from '../constants'
import profilePic from "../assets/projects/gautam_profile.png"
import { delay, motion } from "framer-motion"

const container = (delay) => ({
    hidden: {x: -100, opacity: 0},
    visible: {
        x: 0,
        opacity: 1,
        transition: {duration: 0.5, delay: delay}
    },
});

const Hero = () => {
    return (
        <div className='border-b border-neutral-900 pb-4 lg:mb-35 mx-10'>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col items-center lg:items-start">
                        <motion.h1 variants={container(0)} initial="hidden" animate="visible"  className='pb-16 text-6xl font-thin tracking-tight lg:mt-16 lg:text-6xl'>Gautama Shastry Bulusu</motion.h1>
                        <motion.span variants={container(0.5)} initial="hidden" animate="visible" whileHover={{ scale: 1.2 }} whileTap={{ scale: 1.1 }} drag="x"  className='bg-gradient-to-r from-pink-300 via-slate-500 to-purple-500 bg-clip-text text-3xl tracking-tight text-transparent'>
                            Full Stack Developer
                        </motion.span>
                        <motion.p variants={container(1)} initial="hidden" animate="visible" className='my-2 max-w-xl py-6 font-light tracking-tighter'>{HERO_CONTENT}</motion.p>
                    </div>
                </div>
                <div className='w-full lg:w-1/2 lg:p-8'>
                    <div className="flex justify-center">
                        <motion.img initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} src={profilePic} alt="Gautam" className='rounded-lg cursor-pointer lg:max-w-sm max-h-[450px] object-cover shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero