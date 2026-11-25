import ProjectsSection from '../components/Projects'
import SEO from '../components/SEO'

const Projects = () => {
    return (
        <div className="pt-8">
            <SEO
                title="Projects | Satya Bulusu"
                description="Explore projects by Satya Bulusu spanning full-stack web apps, AI agents, RAG pipelines, and cloud-native services built with React, Spring Boot, LangChain, and AWS."
                path="/projects"
            />
            <ProjectsSection />
        </div>
    )
}

export default Projects
