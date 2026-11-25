import VoiceAgentSection from '../components/VoiceAgentSection'
import SEO from '../components/SEO'
import site from '../../site.config.js'

const VoiceAgent = () => {
    return (
        <div className="pt-8">
            <SEO
                title={`Voice Agent | ${site.name}`}
                description={`Ask ${site.firstName}'s voice agent a question out loud and hear the answer, grounded in ${site.pronouns.possessive} real portfolio and projects.`}
                path="/voice-agent"
            />
            <VoiceAgentSection />
        </div>
    )
}

export default VoiceAgent
