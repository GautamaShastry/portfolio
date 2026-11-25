import Hero from '../components/Hero'
import About from '../components/About'
import Technologies from '../components/Technologies'
import SEO from '../components/SEO'
import site from '../../site.config.js'

const Home = () => {
    return (
        <>
            <SEO
                title={site.title}
                description={site.description}
                path="/"
            />
            <Hero />
            <About />
            <Technologies />
        </>
    )
}

export default Home
