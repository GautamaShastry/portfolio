import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://gautamportfolio.com'

const SEO = ({ title, description, path = '/' }) => {
    const url = `${SITE_URL}${path}`

    return (
        <Helmet>
            <title>Satya</title>
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
