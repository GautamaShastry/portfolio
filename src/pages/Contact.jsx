import ContactSection from '../components/Contact'
import SEO from '../components/SEO'

const Contact = () => {
    return (
        <div className="pt-8">
            <SEO
                title="Contact | Satya Bulusu"
                description="Get in touch with Satya Bulusu for software engineering opportunities, collaborations, or questions about his projects and experience."
                path="/contact"
            />
            <ContactSection />
        </div>
    )
}

export default Contact
