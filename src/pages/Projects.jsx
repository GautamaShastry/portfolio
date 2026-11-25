import ProjectsSection from '../components/Projects'
import SEO from '../components/SEO'
import site from '../../site.config.js'

const Projects = () => {
    return (
        <div className="pt-8">
            <SEO
                title={`Projects | ${site.name}`}
                description={`Explore projects by ${site.name}: full-stack web apps, AI agents, RAG pipelines, and cloud-native services.`}
                path="/projects"
            />
            <ProjectsSection />
        </div>
    )
}

export default Projects
