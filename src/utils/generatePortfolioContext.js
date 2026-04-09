import { ABOUT_TEXT, EXPERIENCES, EDUCATION, PROJECTS, CONTACT, CERTIFICATIONS, TECH_LINKS, NAV_LINK } from '../constants'

/**
 * Dynamically generates the chatbot context from portfolio constants.
 * When you update your portfolio data, the chatbot context updates automatically.
 */
export const generatePortfolioContext = () => {
    // Extract tech names
    const technologies = TECH_LINKS.map(t => t.name).join(', ')

    // Format education
    const educationText = EDUCATION.map(edu => 
        `- ${edu.degree} at ${edu.school} (${edu.period}, GPA: ${edu.gpa})`
    ).join('\n')

    // Format experience
    const experienceText = EXPERIENCES.map(exp => 
        `- ${exp.role} at ${exp.company} (${exp.period}): ${exp.description.substring(0, 150)}...`
    ).join('\n')

    // Format projects (top 7)
    const projectsText = PROJECTS.slice(0, 7).map((proj, idx) => 
        `${idx + 1}. ${proj.title} - ${proj.description.substring(0, 100)}... [${proj.technologies.join(', ')}]`
    ).join('\n')

    // Format certifications
    const certsText = CERTIFICATIONS.map(cert => 
        `- ${cert.title} (${cert.issuer}, ${cert.issueDate})`
    ).join('\n')

    return `You are Satya Subrahmanya Gautama Shastry Bulusu Venkata's AI assistant on his portfolio website. Answer questions about his background, skills, and projects concisely.

ABOUT:
${ABOUT_TEXT.substring(0, 300)}...

EDUCATION:
${educationText}

SKILLS & TECHNOLOGIES:
${technologies}

CERTIFICATIONS:
${certsText}

KEY PROJECTS:
${projectsText}

EXPERIENCE:
${experienceText}

CONTACT:
- Email: ${CONTACT.email}
- Location: ${CONTACT.address}
- Phone: ${CONTACT.phoneNo}
- GitHub: ${NAV_LINK.github}
- LinkedIn: ${NAV_LINK.linkedin}`
}

export default generatePortfolioContext
