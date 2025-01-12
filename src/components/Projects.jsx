import React from 'react'
import { PROJECTS } from '../constants'
import { Link } from "react-router-dom";

const Projects = () => {
    return (
        <div id='projects' className='border-b border-neutral-900'>
            <h1 className='my-20 text-center text-4xl'>
                Projects
            </h1>
            <div>
                {PROJECTS.map((project, index) => (
                    <div key={index} className='mb-12 flex flex-wrap lg:justify-center'>
                        <div className='w-full lg:w-1/4'>
                            <Link to={project.githubLink}>
                                <img src={project.image} alt={project.title} width={150} height={150} className='mb-6 rounded hover:scale-110 transition-transform duration-300 ease-in-out' />
                            </Link>
                        </div>
                        <div className='w-full max-w-xl lg:w-3/4'>
                            <h6 className='mb-2 font-semibold'>{project.title}</h6>
                            <p className='mb-4 text-neutral-400'>{project.description}</p>
                            {project.technologies.map((tech, index) => (
                                <span key={index} className='mr-2 rounded bg-neutral-900 px-2 py-1 text-sm font-medium text-purple-500'>{tech}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Projects