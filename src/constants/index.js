import project1 from "../assets/projects/project_1.jpeg";
import project2 from "../assets/projects/project_2.jpeg";
import project3 from "../assets/projects/project_3.jpeg";
import project4 from "../assets/projects/project_4.jpg";
import project5 from "../assets/projects/project5.png";
import Projects from './../components/Projects';

import React from "react";
import { DiPython } from 'react-icons/di'
import { FaJava, FaNodeJs } from 'react-icons/fa6'
import { FaAws } from 'react-icons/fa'
import { RiReactjsLine } from 'react-icons/ri'
import { SiMongodb, SiPandas, SiSpringboot, SiDocker, SiKubernetes, SiJenkins, SiGithub, SiScikitlearn, SiTensorflow, SiMysql, SiPostgresql, SiHtml5, SiCss3, SiJavascript } from 'react-icons/si'

export const NAV_LINK = {
    instagram: "https://www.instagram.com/",
    github: "https://github.com/GautamaShastry/",
    linkedin: "https://www.linkedin.com/in/satya2603/",
}

export const HERO_CONTENT = `I am a Full-Stack Developer and Machine Learning Enthusiast with a passion for transforming ideas into impactful solutions. Whether it’s designing user-friendly web applications or developing intelligent models, I thrive at the intersection of innovation and technology.`

export const ABOUT_TEXT = `I am a dedicated and versatile Full-Stack Developer with a passion for creating efficient, scalable, and user-friendly web applications. With hands-on experience in React, Node.js, and MongoDB, I have developed dynamic and responsive applications that deliver seamless user experiences. During my tenure as an Associate Software Engineer Intern, I collaborated with cross-functional teams to build intuitive interfaces and enhance application performance. My portfolio includes projects like a full-stack chat application, where I implemented features such as user authentication and API integration`

export const EXPERIENCES = [
    {
        period: "Jan 2023 - June 2023",
        role: "Associate Software Engineer Intern",
        company: "Backflipt",
        description: `Developed visually appealing and responsive user interfaces using React.js, ensuring optimal performance across diverse devices and platforms. Collaborated with cross-functional teams to translate complex requirements into intuitive, user-friendly web applications. Improved application performance and reliability by diagnosing and fixing critical issues, enhancing the overall user experience.`,
        technologies: ["JavaScript", "ReactJS", "SpringBoot", "Java"]
    },
];

export const PROJECTS = [
    {
        title: "Full Stack ChatBook Application",
        image: project1,
        description: `ChatBook is a full-stack web application that enables seamless real-time communication between users. Built using ReactJS, Node.js, Express, and MongoDB, it features secure authentication, an intuitive user interface, and efficient backend architecture for a smooth and engaging chat experience.`,
        technologies: ["MongoDB", "ReactJS", "NodeJS", "ExpressJS", "Socket.io"],
        githubLink: "https://github.com/GautamaShastry/chat-app",
    },
    {
        title: "Portfolio Website",
        image: project2,
        description: `A Personal website designed to showcase my skills, experience, and projects in web development and machine learning. Built using modern web technologies like ReactJS, it features an elegant, responsive design, intuitive navigation, and highlights my technical skills through interactive project demonstrations and concise summaries.`,
        technologies: ["ReactJS", "Tailwind CSS", "JavaScript"],
        githubLink: "https://github.com/GautamaShastry/portfolio",
        link: "https://gautam-portfolio-sable.vercel.app/"
    },
    {
        title: "Image Captioning",
        image: project3,
        description: `Developed a deep learning model that generates descriptive captions for images using the Flickr30k dataset. The model employs a CNN for feature extraction and an LSTM for sequence generation, effectively bridging the gap between visual data and textual representation. Fine-tuned pre-trained CNN models by removing the last two layers and adapting them to the dataset. Achieved a BLEU-1 score of 0.48, demonstrating the model’s ability to produce contextually relevant captions. This project highlights my proficiency in TensorFlow, computer vision, and natural language processing.`,
        technologies: ["Python", "Tensorflow", "CNN", "LSTM", "Keras", "Deep Learning"],
        githubLink: "https://github.com/GautamaShastry/Image-captioning",
    },
    {
        title: "Cross-lingual-Transferability",
        image: project4,
        description: `Analysed how well a model trained in one language, can evaluate another language. Used two models: Bloom-560m model and Multilingual-Cased to fine-tune high resource language like English and performed zero-shot evaluation on low resource languages like Arabic and Swahili. Bloom-560m outperformed Multilingual-Cased model in terms of accuracy and F1 score, whereas Multilingual-Cased model has slightly better transfer efficiency(performance on low resource language / performance on high resource language). Transfer efficiency for Swahili is lower compared to Arabic, indicating room for improvement in handling very low-resource languages.`,
        technologies: ["Python", "NLP", "LLM", "Deep Learning", "Transformers"],
        githubLink: "https://github.com/GautamaShastry/Cross-lingual-Transferability",
    },
    {
        title: "Resume Analyzer",
        image: project5,
        description: `Engineered a full-stack resume-screening platform (React + Axios, Spring Boot/Spring Security, Python spaCy microservice) with JWT-secured routes, PostgreSQL persistence, 87 %-accurate sub-1.5 s inference, orchestrating zero-error cross-service flows that cut recruiter clicks by 70 % and processed 50+ resumes in a 2-week pilot.`,
        technologies: ["Java", "Spring Boot", "ReactJS", "PostgreSQL", "Python", "NLP"],
        githubLink: "https://github.com/GautamaShastry/resume_screener",
        link: "https://resume-screener-chi.vercel.app/login"
    }
];

export const CONTACT = {
    address: "4673 Forestdale Drive, Fairfax, VA 22032",
    phoneNo: "+1 571-653-0056",
    email: "gautamashastry@gmail.com",
};

export const TECH_LINKS = [
    {
        name: 'React.js',
        Icon: RiReactjsLine,
        link: 'https://reactjs.org/',
        duration: 2.5,
        colorClass: 'text-cyan-400',
    },
    {
        name: 'Node.js',
        Icon: FaNodeJs,
        link: 'https://nodejs.org/',
        duration: 3,
        colorClass: 'text-green-500',
    },
    {
        name: 'MongoDB',
        Icon: SiMongodb,
        link: 'https://www.mongodb.com/',
        duration: 5,
        colorClass: 'text-green-600',
    },
    {
        name: 'Pandas',
        Icon: SiPandas,
        link: 'https://pandas.pydata.org/',
        duration: 2,
        colorClass: 'text-blue-500',
    },
    {
        name: 'Java',
        Icon: FaJava,
        link: 'https://www.oracle.com/java/',
        duration: 6,
        colorClass: 'text-red-500',
    },
    {
        name: 'Spring Boot',
        Icon: SiSpringboot,
        link: 'https://spring.io/projects/spring-boot',
        duration: 3.5,
        colorClass: 'text-green-700',
    },
    {
        name: 'Python',
        Icon: DiPython,
        link: 'https://www.python.org/',
        duration: 4,
        colorClass: 'text-yellow-500',
    },
    {
        name: 'Docker',
        Icon: SiDocker,
        link: 'https://www.docker.com/',
        duration: 2,
        colorClass: 'text-blue-400',
    },
    {
        name: 'AWS',
        Icon: FaAws,
        link: 'https://aws.amazon.com/',
        duration: 3,
        colorClass: 'text-orange-500',
    },
    {
        name: 'Kubernetes',
        Icon: SiKubernetes,
        link: 'https://kubernetes.io/',
        duration: 2.5,
        colorClass: 'text-blue-600',
    },
    {
        name: 'Jenkins',
        Icon: SiJenkins,
        link: 'https://www.jenkins.io/',
        duration: 1.5,
        colorClass: 'text-red-700',
    },
    {
        name: 'GitHub',
        Icon: SiGithub,
        link: 'https://www.github.com/',
        duration: 1,
        colorClass: 'text-gray-700',
    },
    {
        name: 'Scikit-learn',
        Icon: SiScikitlearn,
        link: 'https://scikit-learn.org/',
        duration: 2,
        colorClass: 'text-green-500',
    },
    {
        name: 'TensorFlow',
        Icon: SiTensorflow,
        link: 'https://www.tensorflow.org/',
        duration: 3,
        colorClass: 'text-blue-600',
    },
    {
        name: 'MySQL',
        Icon: SiMysql,
        link: 'https://www.mysql.com/',
        duration: 2,
        colorClass: 'text-blue-700',
    },
    {
        name: 'PostgreSQL',
        Icon: SiPostgresql,
        link: 'https://www.postgresql.org/',
        duration: 2.5,
        colorClass: 'text-blue-800',
    },
    {
        name: 'HTML5',
        Icon: SiHtml5,
        link: 'http://w3schools.com/html/',
        duration: 1,
        colorClass: 'text-orange-500',
    },
    {
        name: 'CSS3',
        Icon: SiCss3,
        link: 'https://www.w3schools.com/css/',
        duration: 1,
        colorClass: 'text-blue-500',
    },
    {
        name: 'JavaScript',
        Icon: SiJavascript,
        link: 'https://www.javascript.com/',
        duration: 2,
        colorClass: 'text-yellow-500',
    },
]