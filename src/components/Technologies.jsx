import React from 'react'
import Tippy from '@tippyjs/react';
import { motion } from 'framer-motion'
import { TECH_LINKS } from '../constants'

const iconVariants = (duration) => ({
    initial: { y: -10 },
    animate: {
        y: [10, -10],
        transition: {
            duration: duration,
            ease: "linear",
            repeatType: "reverse",
            repeat: Infinity,
        },
    },
    hover: {
        y: 0,
        transition: {
            duration: 0.1,
        },
    },
});

const Technologies = () => {
    return (
        <div id='tech' className='border-b border-neutral-800 pb-24'>
            <motion.h1 whileInView={{ opacity: 1,  y: 0 }} initial={{ opacity: 0, y: -100 }} transition={{ duration: 1.5 }} className='my-20 text-center text-4xl'>Technologies</motion.h1>
            <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -100 }} transition={{ duration: 1.5 }} className="flex flex-wrap items-center justify-center gap-8">
                {TECH_LINKS.map(({name, Icon, link, duration, colorClass}) => (
                    <Tippy 
                        key={name} 
                        content={name} 
                        placement="auto" 
                        offset={[0, 8]}
                        className="bg-neutral-900 text-white rounded-lg p-2 z-50 shadow-lg border border-purple-500"
                        delay={[100, 0]}
                        duration={[100, 100]}
                        animation="shift-away"
                    >
                        <motion.div
                            key={name}
                            variants={iconVariants(duration)}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            className="rounded-2xl border-4 border-neutral-800 p-4 cursor-pointer hover:border-purple-500"
                            data-tooltip-id={name}
                            title={name}
                            onClick={() => window.open(link, '_blank')}
                        >
                            <Icon className={`text-7xl ${colorClass}`} />
                        </motion.div>
                    </Tippy>
                ))}
            </motion.div>
        </div>
    )
}

export default Technologies