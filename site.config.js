// Who this portfolio belongs to. Using this project as a template? Change the values here,
// then replace the content in src/constants/index.js and public/resume.pdf (see README).
//
// Read by: index.html (title, meta tags, structured data), robots.txt and sitemap.xml (generated
// at build time), the SEO component, the chat/voice UI text, and scripts/reindex.mjs.
// The backend (chatbot-backend/) uses the same facts via environment variables: OWNER_NAME,
// OWNER_FIRST_NAME, OWNER_PRONOUNS and SITE_URL (see chatbot-backend/.env.example).
export default {
    // Display name, and the short name used in UI text ("Satya's AI assistant")
    name: 'Satya Bulusu',
    firstName: 'Satya',
    // Optional: the first name in other scripts, by site language
    localizedFirstName: { hi: 'सत्या', te: 'సత్య' },
    // Full legal name for search engines' structured data (can be the same as `name`)
    legalName: 'Satya Subrahmanya Gautama Shastry Bulusu Venkata',
    // How the chatbot refers to you: subject / object / possessive
    pronouns: { subject: 'he', object: 'him', possessive: 'his' },
    jobTitle: 'Software Engineer',

    siteUrl: 'https://gautamportfolio.com',
    // Browser-tab title. With pageTitles: true, pages use their own titles ("Projects | <name>").
    title: 'Satya',
    pageTitles: true,
    description:
        'Portfolio of Satya Bulusu, a software engineer building cloud-native services, distributed systems, and AI-powered applications with React, Spring, and AWS.',
    themeColor: '#7c3aed',
    logo: '/g_letter.png', // in public/; also the social-share image

    email: 'gautamashastry@gmail.com',
    calendlyUrl: 'https://calendly.com/gautamashastry',
    socials: {
        linkedin: 'https://www.linkedin.com/in/satya2603/',
        github: 'https://github.com/GautamaShastry/',
    },

    // Your resume: shown as a download and indexed for the chatbot (public/ path)
    resume: { file: 'resume.pdf', downloadName: 'satya.pdf' },

    // Pages listed in the generated sitemap.xml, and paths search engines should skip
    sitemapRoutes: ['/', '/projects', '/experience', '/blog', '/voice-agent', '/contact'],
    robotsDisallow: ['/secret', '/admin'],
}
