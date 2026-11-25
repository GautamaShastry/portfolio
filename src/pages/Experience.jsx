import ExperienceSection from '../components/Experience'
import Education from '../components/Education'
import Certification from '../components/Certification'
import SEO from '../components/SEO'

const Experience = () => {
    return (
        <div className="pt-8">
            <SEO
                title="Experience & Education | Satya Bulusu"
                description="Work experience, education, and certifications of Satya Bulusu, a software engineer with a Master's from George Mason University and industry experience in full-stack and cloud engineering."
                path="/experience"
            />
            <Education />
            <ExperienceSection />
            <Certification />
        </div>
    )
}

export default Experience
