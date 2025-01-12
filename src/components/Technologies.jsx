import React from 'react'
import { DiPython } from 'react-icons/di'
import { FaJava, FaNodeJs } from 'react-icons/fa6'
import { RiReactjsLine } from 'react-icons/ri'
import { SiMongodb, SiPandas } from 'react-icons/si'

const Technologies = () => {
    return (
        <div className='border-b border-neutral-800 pb-24'>
            <h1 className='my-20 text-center text-4xl'>Technologies</h1>
            <div className="flex flex-wrap items-center justify-center gap-4">
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <RiReactjsLine className='text-7xl text-cyan-400'/>
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <FaNodeJs className='text-7xl text-green-500'/>
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiMongodb className='text-7xl text-green-600'/>
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <SiPandas className='text-7xl text-blue-500'/>
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <FaJava className='text-7xl text-red-500'/>
                </div>
                <div className='rounded-2xl border-4 border-neutral-800 p-4'>
                    <DiPython className='text-7xl text-yellow-500'/>
                </div>
            </div>
        </div>
    )
}

export default Technologies