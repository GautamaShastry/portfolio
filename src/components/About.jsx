import React from 'react'
import aboutPic from "../assets/projects/gautam-logo.png"
import { ABOUT_TEXT } from '../constants'
import resume from "../assets/projects/resume.pdf"

const About = () => {
    return (
        <div id='about' className='border-b border-neutral-900 pb-4'>
            <h1 className='my-20 text-center text-4xl text-purple-300'>
                About
                <span className='text-neutral-500'> Me</span>
            </h1>
            <div className='flex flex-wrap'>
                <div className='w-full lg:w-1/2 lg:p-8'>
                    <div className="flex items-center justify-center">
                        <img src={aboutPic} alt="about" className='rounded-2xl cursor-pointer lg:max-w-sm max-h-[450px] object-cover shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300 ease-in-out'/>
                    </div>
                </div>
                <div className='w-full lg:w-1/2'>
                    <div className='flex justify-center lg:justify-start'>
                        <p className='my-2 max-w-xl '>{ABOUT_TEXT}</p>
                    </div>
                    <div className='items-center justify-start flex'>
                        <a href={resume} download="gautam_resume.pdf" className='inline-block mt-6 px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors duration-300'>
                            Download CV
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About