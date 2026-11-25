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
    SiCss3, SiJavascript, SiC, SiGit, SiRancher, SiLangchain, SiFastapi,
    SiGo, SiApachekafka, SiRedis, SiDjango, SiGrafana, SiPrometheus
} from "react-icons/si";

export const NAV_LINK = {
    instagram: "https://www.instagram.com/gautam_718/",
    github: "https://github.com/GautamaShastry/",
    linkedin: "https://www.linkedin.com/in/gautamb2603/",
};

export const HERO_CONTENT = `Backend and applied AI engineer. I build services that stay fast and predictable under load: Go and gRPC ingestion paths, Kafka pipelines, Spring Boot and FastAPI APIs, and LLM agents with RAG that run on the same backend principles. I care about measurable latency, clean APIs, real observability with Prometheus and Grafana, and CI/CD that makes releases boring.`;

export const ABOUT_TEXT = `I'm Satya, a backend and applied AI engineer based in Los Angeles and open to relocation. I finished my MS in Computer Science at George Mason University in December 2025 with a 3.87 GPA, and from February to October 2026 I worked on the Open edX learning platform at KeelWorks Foundation, where I shipped production code across the Django backend and React frontends, including semantic course search built on pgvector. My projects lean toward systems problems: removing blocking waits from a Go/gRPC video ingestion path, cutting inference latency with OpenVINO, and building retrieval pipelines that hold up at 100K+ chunks. I've also co-authored three arXiv papers, one on multi-agent fact checking, one on zero-shot composed image retrieval, and one on telugu-english hate speech detection. I measure before I optimize, and I keep logs, metrics, and reproducible artifacts ahead of flashy demos.`;

export const EXPERIENCES = [
    {
        period: "Feb 2026 - Oct 2026",
        role: "Software Developer",
        company: "KeelWorks Foundation",
        description: `Implemented semantic course search in the Open edX Django monolith using pgvector embeddings, raising Recall@8 from 71% to 93% on course queries. Contributed learner facing improvements to the discussion experience in the frontend-app-discussions React micro frontend and redesigned learner navigation, improving content discoverability by ~25%. Customized LMS and CMS layers using Django, Mako templates, and frontend updates to support tailored learning workflows. Diagnosed feature configuration issues across development and staging and added container based validation workflows, reducing environment setup and validation time by ~40%.`,
        technologies: ["Python", "Django", "Open edX", "React", "pgvector", "Docker", "JavaScript"],
    },
    {
        period: "2023",
        role: "Software Engineer Intern",
        company: "Backflipt",
        description: `Built Spring WebFlux microservices with request validation and consistent error mapping; optimized DocumentDB queries to reduce p95 API latency by ~35ms. Standardized error contracts and correlation IDs across services and React/Redux workflows, cutting debugging time by 20%. Wrote JUnit and Mockito unit tests for backend components and automated API regression with Postman and Newman, publishing JUnit XML reports with payload and log artifacts for reproducible failures. Reduced pre release verification from ~15 minutes of manual checks to ~6 minutes using automated smoke and regression gates.`,
        technologies: ["Java", "Spring WebFlux", "React", "Redux", "AWS DocumentDB", "JUnit", "Mockito", "Newman"],
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
        gpa: "8.15/10",
        coursework: ["Data Structures", "Algorithms", "Database Systems", "Operating Systems", "Computer Networks", "Cloud Computing", "Object Oriented Programming", "Machine Learning", "Artificial Intelligence", "Data Mining", "Web Development", "Embedded Systems"],
    },
];

export const PUBLICATIONS = [
    {
        title: "TRUST Agents: Multi-Agent Fact-Checking",
        venue: "arXiv:2604.12184",
        link: "https://arxiv.org/abs/2604.12184",
        description: "Four agent LangGraph pipeline for fake news verification. Led a four person team and built the Evidence Retrieval Agent and the system integration.",
    },
    {
        title: "Zero-Shot Composed Image Retrieval",
        venue: "arXiv:2506.06602",
        link: "https://arxiv.org/abs/2506.06602",
        description: "Zero-shot composed image retrieval using BLIP-2 and Q-Former, achieving 2x Recall@10 on FashionIQ.",
    },
    {
        title: "Code-Mixed Telugu-English Hate Speech Detection",
        venue: "arXiv:2502.10632",
        link: "https://arxiv.org/abs/2502.10632",
        description: "Hate speech detection in low-resource languages like Telugu is a growing challenge in NLP. This study investigates transformer-based models, including TeluguHateBERT, HateBERT, DeBERTa, Muril, IndicBERT, Roberta, and Hindi-Abusive-MuRIL, for classifying hate speech in Telugu. We fine-tune these models using Low-Rank Adaptation (LoRA) to optimize efficiency and performance. Additionally, we explore a multilingual approach by translating Telugu text into English using Google Translate to assess its impact on classification accuracy. Our experiments reveal that most models show improved performance after translation, with DeBERTa and Hindi-Abusive-MuRIL achieving higher accuracy and F1 scores compared to training directly on Telugu text. Notably, Hindi-Abusive-MuRIL outperforms all other models in both the original Telugu dataset and the translated dataset, demonstrating its robustness across different linguistic settings. This suggests that translation enables models to leverage richer linguistic features available in English, leading to improved classification performance. The results indicate that multilingual processing can be an effective approach for hate speech detection in low-resource languages. These findings demonstrate that transformer models, when fine-tuned appropriately, can significantly improve hate speech detection in Telugu, paving the way for more robust multilingual NLP applications."
    },
];

export const PROJECTS = [
    {
        title: "Sentinel AI",
        image: agent,
        description: `Real-time video threat detection with a Go/gRPC capture service feeding Kafka and Python YOLOv8 inference workers. Increased ingestion throughput 2.1x (9.7 to 20.7 FPS) by removing blocking Kafka batch writer waits from the capture path. Reduced p95 inference latency by 68% (750 to 240 ms) with OpenVINO CPU inference while holding 75.11% mAP@0.5. Instrumented per stage delays with Prometheus and Grafana to locate bottlenecks before optimizing.`,
        technologies: ["Go", "gRPC", "Protobuf", "Kafka", "Python", "YOLOv8", "OpenVINO", "Prometheus", "Grafana"],
        githubLink: "https://github.com/GautamaShastry/sentinel-ai",
    },
    {
        title: "Support Sage",
        image: agent,
        description: `AI customer support agent built with LangGraph and RAG that handles order management, policy lookups, and ticket escalation under enforced business rules. Retrieval runs over a 113K chunk knowledge base with Redis caching for repeated queries, served through a FastAPI backend and React frontend.`,
        technologies: ["Python", "LangGraph", "RAG", "FastAPI", "Redis", "React"],
        githubLink: "https://github.com/GautamaShastry/support-sage",
    },
    {
        title: "TRUST Agents",
        image: agent,
        description: `Multi-agent fact checking pipeline with four specialized LLM agents (Claim Extractor, Evidence Retrieval, Verifier, Logic Aggregator) and Delphi style consensus verification. Achieved 65.2% accuracy on the LIAR dataset. Published on arXiv (2604.12184).`,
        technologies: ["Python", "LangGraph", "GPT-4", "RAG", "BERT"],
        githubLink: "https://github.com/GautamaShastry/news_agent",
        link: "https://arxiv.org/abs/2604.12184",
    },
    {
        title: "SurveyOps",
        image: project6,
        description: `Deployed a Spring Boot service to a 3 replica Kubernetes cluster on AWS EC2 with rolling updates and liveness/readiness probes, validating fault tolerance and rollback scenarios. Built a Jenkins CI/CD pipeline that publishes versioned Docker images and deploys in under 5 minutes across 6 releases; tuned HikariCP for RDS MySQL and covered the APIs with 10+ Postman regression cases.`,
        technologies: ["Java", "Spring Boot", "Kubernetes", "Jenkins", "Docker", "AWS", "MySQL"],
        githubLink: "https://github.com/GautamaShastry/SWE645_assign3",
    },
    {
        title: "AutoE2E Testing Framework",
        image: project6,
        description: `CLI based end to end testing framework that uses Ansible playbooks with the community.docker collection to bring up containerized FastAPI, PostgreSQL, and Redis stacks. YAML driven configuration, parallel test execution with pytest-xdist, and GitHub Actions integration reduced manual QA setup time by 80%.`,
        technologies: ["Python", "Ansible", "Docker Compose", "pytest-xdist", "GitHub Actions", "YAML"],
        githubLink: "https://github.com/GautamaShastry/autoe2e",
    },
    {
        title: "HireReady",
        image: project5,
        description: `Nine agent LangGraph resume analysis pipeline with an evaluation harness and automated PDF/HTML reports; ran 200 end to end analyses with 0 failed runs and deterministic outputs. Hardened services with Resilience4j bulkheads and fallbacks plus Redis, sustaining 100 concurrent requests with 0 failures under injected 5xx and rate limit faults.`,
        technologies: ["Java", "Spring Boot", "Flask", "LangGraph", "PostgreSQL", "Redis", "React", "Resilience4j"],
        githubLink: "https://github.com/GautamaShastry/resume_screener",
        link: "https://resume-screener-chi.vercel.app/login",
    },
    {
        title: "Cross-lingual Transferability",
        image: project4,
        description: `Studied how well a model fine tuned in one language transfers to others. Fine tuned BLOOM-560m and multilingual cased BERT on English and ran zero-shot evaluation on Arabic and Swahili.`,
        technologies: ["Python", "Transformers", "NLP", "LLM", "Deep Learning"],
        githubLink: "https://github.com/GautamaShastry/Cross-lingual-Transferability",
    },
    {
        title: "Image Captioning",
        image: project3,
        description: `Deep learning model that generates captions for images from the Flickr30k dataset, using a CNN for feature extraction and an LSTM for sequence generation. Achieved a BLEU-1 score of 0.48.`,
        technologies: ["Python", "TensorFlow", "Keras", "CNN", "LSTM"],
        githubLink: "https://github.com/GautamaShastry/Image-captioning",
    },
    {
        title: "ChatBook",
        image: project1,
        description: `Full stack real time chat application with secure authentication, built on React, Node.js, Express, MongoDB, and Socket.io.`,
        technologies: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
        githubLink: "https://github.com/GautamaShastry/chat-app",
    },
    {
        title: "Taskify",
        image: project7,
        description: `Full stack task management app with JWT authentication and bcrypt hashed passwords, plus 20+ real time filtering, sorting, and search features.`,
        technologies: ["React", "Node.js", "Express", "MongoDB", "JWT", "Docker"],
        githubLink: "https://github.com/GautamaShastry/task-manager",
    },
    {
        title: "Portfolio Website",
        image: project2,
        description: `This site. A responsive personal portfolio built with React and Tailwind CSS and hosted on AWS.`,
        technologies: ["React", "Tailwind CSS", "JavaScript", "AWS"],
        githubLink: "https://github.com/GautamaShastry/portfolio",
        link: "https://gautamportfolio.com/",
    },
];

export const CONTACT = {
    address: "Los Angeles, CA (Open to relocation)",
    phoneNo: "+1 571-653-0056",
    email: "gautamashastry@gmail.com",
};

export const TECH_LINKS = [
    { name: "Python", Icon: DiPython, link: "https://www.python.org/", duration: 4, colorClass: "text-yellow-500" },
    { name: "Java", Icon: FaJava, link: "https://www.oracle.com/java/", duration: 4, colorClass: "text-red-500" },
    { name: "Go", Icon: SiGo, link: "https://go.dev/", duration: 2, colorClass: "text-cyan-500" },
    { name: "JavaScript", Icon: SiJavascript, link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", duration: 3, colorClass: "text-yellow-500" },
    { name: "C", Icon: SiC, link: "https://en.wikipedia.org/wiki/C_(programming_language)", duration: 3, colorClass: "text-blue-800" },
    { name: "Spring Boot", Icon: SiSpringboot, link: "https://spring.io/projects/spring-boot", duration: 2, colorClass: "text-green-700" },
    { name: "FastAPI", Icon: SiFastapi, link: "https://fastapi.tiangolo.com/", duration: 1, colorClass: "text-teal-500" },
    { name: "Django", Icon: SiDjango, link: "https://www.djangoproject.com/", duration: 1.5, colorClass: "text-green-800" },
    { name: "LangChain", Icon: SiLangchain, link: "https://langchain.com/", duration: 1, colorClass: "text-emerald-500" },
    { name: "Kafka", Icon: SiApachekafka, link: "https://kafka.apache.org/", duration: 2, colorClass: "text-neutral-300" },
    { name: "Redis", Icon: SiRedis, link: "https://redis.io/", duration: 1.5, colorClass: "text-red-600" },
    { name: "PostgreSQL", Icon: SiPostgresql, link: "https://www.postgresql.org/", duration: 1.5, colorClass: "text-blue-800" },
    { name: "MySQL", Icon: SiMysql, link: "https://www.mysql.com/", duration: 3, colorClass: "text-blue-700" },
    { name: "MongoDB", Icon: SiMongodb, link: "https://www.mongodb.com/", duration: 2, colorClass: "text-green-600" },
    { name: "Docker", Icon: SiDocker, link: "https://www.docker.com/", duration: 1.5, colorClass: "text-blue-400" },
    { name: "Kubernetes", Icon: SiKubernetes, link: "https://kubernetes.io/", duration: 1, colorClass: "text-blue-600" },
    { name: "AWS", Icon: FaAws, link: "https://aws.amazon.com/", duration: 2, colorClass: "text-orange-500" },
    { name: "Jenkins", Icon: SiJenkins, link: "https://www.jenkins.io/", duration: 1, colorClass: "text-red-700" },
    { name: "Ansible", Icon: SiAnsible, link: "https://www.ansible.com/", duration: 1, colorClass: "text-red-500" },
    { name: "Rancher", Icon: SiRancher, link: "https://rancher.com/", duration: 0.5, colorClass: "text-blue-700" },
    { name: "Prometheus", Icon: SiPrometheus, link: "https://prometheus.io/", duration: 1.5, colorClass: "text-orange-600" },
    { name: "Grafana", Icon: SiGrafana, link: "https://grafana.com/", duration: 1.5, colorClass: "text-orange-400" },
    { name: "React.js", Icon: RiReactjsLine, link: "https://react.dev/", duration: 2, colorClass: "text-cyan-400" },
    { name: "Node.js", Icon: FaNodeJs, link: "https://nodejs.org/", duration: 2, colorClass: "text-green-500" },
    { name: "TensorFlow", Icon: SiTensorflow, link: "https://www.tensorflow.org/", duration: 2, colorClass: "text-orange-600" },
    { name: "Pandas", Icon: SiPandas, link: "https://pandas.pydata.org/", duration: 2, colorClass: "text-blue-500" },
    { name: "Git", Icon: SiGit, link: "https://git-scm.com/", duration: 4, colorClass: "text-red-600" },
    { name: "GitHub", Icon: SiGithub, link: "https://www.github.com/", duration: 4, colorClass: "text-gray-700" },
    { name: "HTML5", Icon: SiHtml5, link: "https://developer.mozilla.org/en-US/docs/Web/HTML", duration: 4, colorClass: "text-orange-500" },
    { name: "CSS3", Icon: SiCss3, link: "https://developer.mozilla.org/en-US/docs/Web/CSS", duration: 4, colorClass: "text-blue-500" },
];

export const CERTIFICATIONS = [
    {
        title: "AWS Certified AI Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "Dec 2025",
        expiryDate: "Dec 2028",
        URL: "https://www.credly.com/badges/28ca89bb-9127-4e84-b7d6-6de3d17ece89/public_url",
        prepareURL: "https://www.udemy.com/course/aws-ai-practitioner-certified/",
        description: "Validates foundational knowledge of AI/ML on AWS, including generative AI, machine learning pipelines, responsible AI practices, and services such as Amazon Bedrock and SageMaker.",
    },
    {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "July 2025",
        expiryDate: "July 2028",
        URL: "https://www.credly.com/badges/22bb5f28-bedf-4478-9ead-179bee16ceff/linked_in?t=sz292g",
        prepareURL: "https://www.udemy.com/course/aws-certified-cloud-practitioner-new/",
        description: "Validates foundational AWS knowledge including core services, architectural best practices, billing and pricing models, and the shared responsibility security model.",
    },
    {
        title: "Deep Learning Specialization",
        issuer: "DeepLearning.AI (Coursera)",
        issueDate: "September 2023",
        URL: "https://www.coursera.org/account/accomplishments/specialization/4E4PZL7XCSC8",
        prepareURL: "https://www.coursera.org/specializations/deep-learning",
        description: "Covers neural networks, optimization and regularization, CNNs, and sequence models, with hands-on implementation in TensorFlow and Keras.",
    },
];