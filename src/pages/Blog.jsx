import BlogSection from '../components/BlogSection'
import SEO from '../components/SEO'
import site from '../../site.config.js'

const Blog = () => {
    return (
        <div className="pt-8">
            <SEO
                title={`Blog | ${site.name}`}
                description={`Notes on software engineering, AI agents, and what I'm building - from ${site.name}.`}
                path="/blog"
            />
            <BlogSection />
        </div>
    )
}

export default Blog
