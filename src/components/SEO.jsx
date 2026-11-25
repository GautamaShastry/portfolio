import { Helmet } from 'react-helmet-async'
import site from '../../site.config.js'

const SITE_URL = site.siteUrl

const SEO = ({ title, description, path = '/' }) => {
    const url = `${SITE_URL}${path}`

    return (
        <Helmet>
            {/* site.config.js: one tab title for every page, or each page's own title */}
            <title>{site.pageTitles ? title : site.title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    )
}

export default SEO
