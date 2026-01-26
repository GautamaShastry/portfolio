// Using optimized web images for better performance
const project1 = "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=400&q=75&auto=format"; // chat app
const project2 = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=75&auto=format"; // portfolio
const project3 = "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&q=75&auto=format"; // AI/ML
const project4 = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&q=75&auto=format"; // NLP
const project5 = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=75&auto=format"; // resume
const project6 = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=75&auto=format"; // server/cloud
const project7 = "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=75&auto=format"; // task management
const agent = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=75&auto=format"; // AI agent

import { DiPython } from "react-icons/di";
import { FaJava, FaNodeJs } from "react-icons/fa6";
import { FaAws } from "react-icons/fa";
import { RiReactjsLine } from "react-icons/ri";
import {
    SiMongodb, SiPandas, SiSpringboot, SiDocker, SiKubernetes, SiJenkins,
    SiGithub, SiAnsible, SiTensorflow, SiMysql, SiPostgresql, SiHtml5,
    SiCss3, SiJavascript, SiC, SiGit, SiRancher, SiLangchain, SiFastapi
} from "react-icons/si";

export const NAV_LINK = {
    instagram: "https://www.instagram.com/gautam_718/",
    github: "https://github.com/GautamaShastry/",
    linkedin: "https://www.linkedin.com/in/satya2603/",
};

export const HERO_CONTENT = `I am a Full-Stack Developer and Machine Learning Enthusiast with a passion for transforming ideas into impactful solutions. Whether it's designing user-friendly web applications or developing intelligent models, I thrive at the intersection of innovation and technology.`;

export const ABOUT_TEXT = `I'm Satya, a Software Engineer who genuinely loves turning complex problems into elegant, working solutions. Fresh out of my Master's at George Mason University, I bring a unique blend of full-stack development and AI engineering that lets me build end-to-end products from scratch. What sets me apart? I don't just write code that works—I build systems designed for real-world chaos: fault-tolerant microservices, cloud-native architectures, and AI agents that actually deliver business value. From optimizing API latency at Backflipt to architecting multi-agent LangGraph pipelines, I've consistently shipped production-ready code that teams can rely on. I thrive in collaborative environments where I can own problems end-to-end, debug the tricky stuff others avoid, and mentor teammates along the way.`;

export const EXPERIENCES = [
    {
        period: "Jan 2023 - Dec 2023",
        role: "Associate Software Engineer",
        company: "Backflipt",
        description: `Owned delivery of React/Redux customer workflows (forms, tables, filters) and collaborated cross-functionally in Agile sprints. Designed cloud-native Spring WebFlux microservices with validation and consistent error mapping; optimized AWS DocumentDB queries, trimming p95 API latency by ~35ms. Fixed async race conditions and dispatch loops, reducing redundant traffic. Built CI-ready API regression automation with Newman, reducing pre-release verification from ~15 min manual to ~6 min automated.`,
        technologies: ["React", "Redux", "Spring WebFlux", "AWS DocumentDB", "Newman", "CI/CD"],
    },
];

export const EDUCATION = [
    {
        degree: "Master of Science in Computer Science",
        school: "George Mason University",
        location: "Fairfax, VA",
        period: "Jan 2024 - Dec 2025",
        gpa: "3.87/4.0",
        coursework: ["Machine Learning", "Deep Learning", "Advanced NLP", "DevOps", "Data Mining", "Artificial Intelligence", "Systems Programming", "Mathematical Foundations of CS", "Cryptography", "Analysis of Algorithms"],
    },
    {
        degree: "Bachelor of Technology in Computer Science",
        school: "Andhra University",
        location: "Visakhapatnam, India",
        period: "Aug 2019 - May 2023",
        gpa: "3.3/4.0",
        coursework: ["Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Web Development", "Artificial Intelligence", "Machine Learning", "Embedded Systems", "Cloud Computing", "Object oriented programming", "Data mining", "Computer Networks"],
    },
];

export const PROJECTS = [
    {
        title: "AutoE2E Testing Framework",
        image: agent,
        description: `Infrastructure-as-code orchestration using Ansible playbooks with community.docker collection to orchestrate containerized multi-service stacks (FastAPI, PostgreSQL, Redis). Built a CLI-based E2E testing framework reducing manual QA setup time by 80%. Features YAML-driven configuration with parallel test execution via pytest-xdist and CI-ready automation with GitHub Actions.`,
        technologies: ["Python", "Ansible", "Docker Compose", "pytest-xdist", "GitHub Actions", "YAML"],
        githubLink: "https://github.com/GautamaShastry/autoe2e",
    },
    {
        title: "Support Sage - AI Customer Support Agent",
        image: agent,
        description: `AI-powered customer support agent using LangGraph and RAG that automates order management, policy lookups, and ticket escalation with business rule enforcement.`,
        technologies: ["Python", "LangGraph", "FastAPI", "React", "RAG", "Agentic AI"],
        githubLink: "https://github.com/GautamaShastry/support-sage",
    },
    {
        title: "TRUST Agents - Multi-Agent Fact-Checking System",
        image: agent,
        description: `Architected a scalable multi-agent fact-checking pipeline using 4 specialized LLM agents (Claim Extractor, Evidence Retrieval, Verifier, Logic Aggregator) with Delphi consensus verification, enhancing interpretability by 30%. Achieved 65.2% accuracy on LIAR dataset.`,
        technologies: ["Python", "GPT-4", "LangGraph", "RAG", "AI Agents", "BERT"],
        githubLink: "https://github.com/GautamaShastry/news_agent",
    },
    {
        title: "Full Stack ChatBook Application",
        image: project1,
        description: `ChatBook is a full-stack web application that enables seamless real-time communication between users. Built using ReactJS, Node.js, Express, and MongoDB, it features secure authentication, an intuitive user interface, and efficient backend architecture.`,
        technologies: ["MongoDB", "ReactJS", "NodeJS", "ExpressJS", "Socket.io"],
        githubLink: "https://github.com/GautamaShastry/chat-app",
    },
    {
        title: "Portfolio Website",
        image: project2,
        description: `A Personal website designed to showcase my skills, experience, and projects in web development and machine learning. Built using modern web technologies like ReactJS with elegant, responsive design.`,
        technologies: ["ReactJS", "Tailwind CSS", "JavaScript"],
        githubLink: "https://github.com/GautamaShastry/portfolio",
        link: "https://gautamportfolio.com/",
    },
    {
        title: "Image Captioning",
        image: project3,
        description: `Developed a deep learning model that generates descriptive captions for images using the Flickr30k dataset. The model employs a CNN for feature extraction and an LSTM for sequence generation. Achieved a BLEU-1 score of 0.48.`,
        technologies: ["Python", "Tensorflow", "CNN", "LSTM", "Keras", "Deep Learning"],
        githubLink: "https://github.com/GautamaShastry/Image-captioning",
    },
    {
        title: "Cross-lingual-Transferability",
        image: project4,
        description: `Analysed how well a model trained in one language can evaluate another language. Used Bloom-560m and Multilingual-Cased models to fine-tune on English and performed zero-shot evaluation on Arabic and Swahili.`,
        technologies: ["Python", "NLP", "LLM", "Deep Learning", "Transformers"],
        githubLink: "https://github.com/GautamaShastry/Cross-lingual-Transferability",
    },
    {
        title: "Resume Analyzer - Multi-Agent AI System",
        image: project5,
        description: `Architected a 9-agent LangGraph pipeline with parallel DAG execution, processing 200+ sequential analyses with 0% error rate. Implemented hybrid scoring (semantic similarity + NER skill extraction), Redis caching layer, and Resilience4j circuit breakers. Load-tested at 100 concurrent users with 100% success rate. Features include company intel scraping, interview prep generation, resume coaching, and automated PDF/HTML reports.`,
        technologies: ["Java", "Spring Boot", "Flask", "LangGraph", "PostgreSQL", "Redis", "React", "Resilience4j"],
        githubLink: "https://github.com/GautamaShastry/resume_screener",
        link: "https://resume-screener-chi.vercel.app/login",
    },
    {
        title: "Student Survey Application",
        image: project6,
        description: `Designed a Spring Boot REST API with CRUD endpoints, deployed on Kubernetes with 3 replicas on EC2 nodes managed by Rancher. Created a Git-triggered Jenkins pipeline for zero-downtime releases.`,
        technologies: ["Spring Boot", "MySQL", "Docker", "Kubernetes", "Rancher", "Jenkins", "AWS"],
        githubLink: "https://github.com/GautamaShastry/SWE645_assign3",
    },
    {
        title: "Taskify-Task Management Application",
        image: project7,
        description: `Developed a full-stack task-management app with React.js, Node.js, and MongoDB. Integrated JWT authentication with bcrypt-hashed passwords. Implemented 20+ real-time filtering, sorting, and search features.`,
        technologies: ["ReactJS", "NodeJS", "ExpressJS", "MongoDB", "JWT", "Bcrypt", "Docker"],
        githubLink: "https://github.com/GautamaShastry/task-manager",
    },
];

export const CONTACT = {
    address: "Fairfax, VA 22032",
    phoneNo: "+1 571-653-0056",
    email: "gautamashastry@gmail.com",
};

export const TECH_LINKS = [
    { name: "LangChain", Icon: SiLangchain, link: "https://langchain.com/", duration: 1, colorClass: "text-emerald-500" },
    { name: "FastAPI", Icon: SiFastapi, link: "https://fastapi.tiangolo.com/", duration: 1, colorClass: "text-teal-500" },
    { name: "React.js", Icon: RiReactjsLine, link: "https://reactjs.org/", duration: 2, colorClass: "text-cyan-400" },
    { name: "Node.js", Icon: FaNodeJs, link: "https://nodejs.org/", duration: 2, colorClass: "text-green-500" },
    { name: "MongoDB", Icon: SiMongodb, link: "https://www.mongodb.com/", duration: 2, colorClass: "text-green-600" },
    { name: "Pandas", Icon: SiPandas, link: "https://pandas.pydata.org/", duration: 2, colorClass: "text-blue-500" },
    { name: "Java", Icon: FaJava, link: "https://www.oracle.com/java/", duration: 4, colorClass: "text-red-500" },
    { name: "Spring Boot", Icon: SiSpringboot, link: "https://spring.io/projects/spring-boot", duration: 2, colorClass: "text-green-700" },
    { name: "Python", Icon: DiPython, link: "https://www.python.org/", duration: 4, colorClass: "text-yellow-500" },
    { name: "C", Icon: SiC, link: "https://en.wikipedia.org/wiki/C_(programming_language)", duration: 3, colorClass: "text-blue-800" },
    { name: "Docker", Icon: SiDocker, link: "https://www.docker.com/", duration: 1.5, colorClass: "text-blue-400" },
    { name: "AWS", Icon: FaAws, link: "https://aws.amazon.com/", duration: 2, colorClass: "text-orange-500" },
    { name: "Kubernetes", Icon: SiKubernetes, link: "https://kubernetes.io/", duration: 1, colorClass: "text-blue-600" },
    { name: "Jenkins", Icon: SiJenkins, link: "https://www.jenkins.io/", duration: 1, colorClass: "text-red-700" },
    { name: "Rancher", Icon: SiRancher, link: "https://rancher.com/", duration: 0.5, colorClass: "text-blue-700" },
    { name: "Git", Icon: SiGit, link: "https://git-scm.com/", duration: 4, colorClass: "text-red-600" },
    { name: "GitHub", Icon: SiGithub, link: "https://www.github.com/", duration: 4, colorClass: "text-gray-700" },
    { name: "Ansible", Icon: SiAnsible, link: "https://www.ansible.com/", duration: 1, colorClass: "text-red-500" },
    { name: "TensorFlow", Icon: SiTensorflow, link: "https://www.tensorflow.org/", duration: 2, colorClass: "text-orange-600" },
    { name: "MySQL", Icon: SiMysql, link: "https://www.mysql.com/", duration: 3, colorClass: "text-blue-700" },
    { name: "PostgreSQL", Icon: SiPostgresql, link: "https://www.postgresql.org/", duration: 1.5, colorClass: "text-blue-800" },
    { name: "HTML5", Icon: SiHtml5, link: "https://w3schools.com/html/", duration: 4, colorClass: "text-orange-500" },
    { name: "CSS3", Icon: SiCss3, link: "https://www.w3schools.com/css/", duration: 4, colorClass: "text-blue-500" },
    { name: "JavaScript", Icon: SiJavascript, link: "https://www.javascript.com/", duration: 3, colorClass: "text-yellow-500" },
];

export const CERTIFICATIONS = [
    {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "July 2025",
        expiryDate: "July 2028",
        URL: "https://www.credly.com/badges/22bb5f28-bedf-4478-9ead-179bee16ceff/linked_in?t=sz292g",
        prepareURL: "https://www.udemy.com/course/aws-certified-cloud-practitioner-new/",
        description: "Validates foundational AWS cloud knowledge including core services, architectural best practices, billing and pricing models, and the shared responsibility security framework.",
    },
    {
        title: "AWS Certified AI Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "Dec 2025",
        expiryDate: "Dec 2028",
        URL: "https://www.credly.com/badges/28ca89bb-9127-4e84-b7d6-6de3d17ece89/public_url",
        prepareURL: "https://www.udemy.com/course/aws-ai-practitioner-certified/",
        description: "Validates foundational knowledge of AI/ML concepts on AWS including generative AI, machine learning pipelines, responsible AI practices, and AWS AI services like Amazon Bedrock and SageMaker.",
    },
    {
        title: "Deep Learning.ai Specialization",
        issuer: "Coursera",
        issueDate: "September 2023",
        URL: "https://www.coursera.org/account/accomplishments/specialization/4E4PZL7XCSC8",
        prepareURL: "https://www.coursera.org/specializations/deep-learning",
        description: "Completed the Deep Learning Specialization by DeepLearning.AI on Coursera, mastering neural networks, deep learning techniques, and practical applications using TensorFlow and Keras.",
    },
];
