import VoiceAgentSection from '../components/VoiceAgentSection'
import SEO from '../components/SEO'

const VoiceAgent = () => {
    return (
        <div className="pt-8">
            <SEO
                title="Voice Agent | Satya Bulusu"
                description="Ask Satya Bulusu's voice agent a question out loud and hear it answer, grounded in his real portfolio, projects, and writing."
                path="/voice-agent"
            />
            <VoiceAgentSection />
        </div>
    )
}

export default VoiceAgent
