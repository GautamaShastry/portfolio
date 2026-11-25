import ExperienceSection from '../components/Experience'
import Education from '../components/Education'
import Certification from '../components/Certification'
import SEO from '../components/SEO'
import site from '../../site.config.js'

const Experience = () => {
    return (
        <div className="pt-8">
            <SEO
                title={`Experience & Education | ${site.name}`}
                description={`Work experience, education, and certifications of ${site.name}.`}
                path="/experience"
            />
            <Education />
            <ExperienceSection />
            <Certification />
        </div>
    )
}

export default Experience
