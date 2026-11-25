import BlogSection from '../components/BlogSection'
import SEO from '../components/SEO'

const Blog = () => {
    return (
        <div className="pt-8">
            <SEO
                title="Blog | Satya Bulusu"
                description="Notes on software engineering, AI agents, and what I'm building - from Satya Bulusu."
                path="/blog"
            />
            <BlogSection />
        </div>
    )
}

export default Blog
