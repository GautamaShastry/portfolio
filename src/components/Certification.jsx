import React from 'react'
import { motion } from 'framer-motion'
import { CERTIFICATIONS } from '../constants'
import { FaArrowRight } from 'react-icons/fa6'

const Certification = () => {
    return (
        <div id='certification' className='border-b border-neutral-900 pb-4'>
            <motion.h1 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -100 }} transition={{ duration: 0.5 }} className='my-20 text-center text-4xl'>
                Certifications  
            </motion.h1>
            <div>
                {CERTIFICATIONS.map((certification, index) => (
                    <div key={index} className='mb-8 flex flex-wrap lg:justify-center'>
                        <motion.div className="w-full lg:w-1/4" whileInView={{opacity: 1, x: 0}} initial={{opacity: 0, x: -100}} transition={{duration: 1}}>
                            <p className='mb-2 text-sm text-neutral-400'>{certification.issueDate} - {certification.expiryDate}</p>
                        </motion.div>
                        <motion.div className="w-full max-w-xl lg:w-3/4" whileInView={{opacity: 1, x: 0}} initial={{opacity: 0, x: 100}} transition={{duration: 1}}>
                            <h6 className='mb-2 font-semibold'>
                                {certification.title} - {" "}
                                <span className='text-sm text-purple-100'>
                                    {certification.issuer}
                                </span>
                            </h6>
                            {certification.description && <p className='mb-4 text-neutral-400'>{certification.description}</p>}
                            <div className='flex gap-4'>
                                <a href={certification.URL} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 rounded border border-purple-700 px-3 py-1 text-sm font-medium text-purple-700 hover:bg-purple-700 hover:text-white transition-colors'>View <FaArrowRight size={12} /></a>
                                <a href={certification.prepareURL} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-2 rounded border border-purple-700 px-3 py-1 text-sm font-medium text-purple-700 hover:bg-purple-700 hover:text-white transition-colors'>Prepare <FaArrowRight size={12} /></a>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Certification