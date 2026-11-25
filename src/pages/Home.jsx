import Hero from '../components/Hero'
import About from '../components/About'
import Technologies from '../components/Technologies'
import SEO from '../components/SEO'

const Home = () => {
    return (
        <>
            <SEO
                title="Satya"
                description="Portfolio of Satya Bulusu, a software engineer building cloud-native services, distributed systems, and AI-powered applications with React, Spring, and AWS."
                path="/"
            />
            <Hero />
            <About />
            <Technologies />
        </>
    )
}

export default Home
