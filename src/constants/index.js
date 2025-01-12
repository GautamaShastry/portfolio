import project1 from "../assets/projects/project_1.jpeg";
import project2 from "../assets/projects/project_2.jpeg";
import project3 from "../assets/projects/project_3.jpeg";

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
    },
    {
        title: "Image Captioning",
        image: project3,
        description: `Developed a deep learning model that generates descriptive captions for images using the Flickr30k dataset. The model employs a CNN for feature extraction and an LSTM for sequence generation, effectively bridging the gap between visual data and textual representation. Fine-tuned pre-trained CNN models by removing the last two layers and adapting them to the dataset. Achieved a BLEU-1 score of 0.48, demonstrating the model’s ability to produce contextually relevant captions. This project highlights my proficiency in TensorFlow, computer vision, and natural language processing.`,
        technologies: ["Python", "Tensorflow", "CNN", "LSTM", "Keras", "Deep Learning"],
        githubLink: "https://github.com/GautamaShastry/Image-captioning",
    },
];

export const CONTACT = {
    address: "4673 Forestdale Drive, Fairfax, VA 22032",
    phoneNo: "+1 571-653-0056",
    email: "gautamashastry@gmail.com",
};