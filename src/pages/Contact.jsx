import ContactSection from '../components/Contact'
import SEO from '../components/SEO'
import site from '../../site.config.js'

const Contact = () => {
    return (
        <div className="pt-8">
            <SEO
                title={`Contact | ${site.name}`}
                description={`Get in touch with ${site.name} about opportunities, collaborations, or questions about ${site.pronouns.possessive} work.`}
                path="/contact"
            />
            <ContactSection />
        </div>
    )
}

export default Contact
