#!/usr/bin/env node
// Rebuilds the RAG index in Supabase (content_chunks): the portfolio constants file
// (about/education/experience/projects/certs/tech), each project's live GitHub README, and
// every published blog post (admin.py also re-embeds a post the moment it's saved).
// Embeddings come from Amazon Bedrock (Cohere Embed Multilingual v3) using your AWS credentials:
// AWS_PROFILE / `aws configure` locally, the CodeBuild service role in CI.
// Run via `npm run reindex`; also wired into buildspec.yml as a non-fatal CI step so a
// flaky Bedrock/Supabase call never blocks the site deploy.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { extractText, getDocumentProxy } from 'unpdf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

// --- minimal .env loader for local runs (CI sets real env vars directly) ---
function loadDotEnv(file) {
    if (!fs.existsSync(file)) return
    for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)\s*$/)
        if (!match) continue
        const key = match[1]
        let value = match[2] || ''
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (!(key in process.env)) process.env[key] = value
    }
}
loadDotEnv(path.join(rootDir, '.env'))

const BEDROCK_REGION = process.env.BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1'
// Must produce 1024-dim vectors: vector(1024) in supabase/schema.sql, same model as bedrock_client.py
const EMBED_MODEL = process.env.BEDROCK_EMBED_MODEL || 'cohere.embed-multilingual-v3'
// The resume the chatbot answers from (keep in sync with the download link in src/components/About.jsx)
const RESUME_PDF = path.join(rootDir, 'src/assets/projects/Satya_Bulusu-Walmart.pdf')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY - skipping reindex.')
    process.exit(0)
}

const { ABOUT_TEXT, HERO_CONTENT, EDUCATION, EXPERIENCES, PROJECTS, CERTIFICATIONS, TECH_LINKS, CONTACT } =
    await import(pathToFileURL(path.join(rootDir, 'src/constants/index.js')).href)

// --- chunking (mirrors chatbot-backend/chunking.py) ---
function chunkText(text, maxChars = 700, overlap = 100) {
    text = (text || '').trim()
    if (!text) return []
    if (text.length <= maxChars) return [text]

    const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    const chunks = []
    let current = ''

    for (const para of paragraphs) {
        const candidate = current ? `${current}\n\n${para}` : para
        if (candidate.length <= maxChars) {
            current = candidate
            continue
        }
        if (current) chunks.push(current)
        if (para.length <= maxChars) {
            current = para
        } else {
            let start = 0
            while (start < para.length) {
                const end = start + maxChars
                chunks.push(para.slice(start, end))
                start = end - overlap
            }
            current = ''
        }
    }
    if (current) chunks.push(current)
    return chunks
}

function buildDocuments() {
    const docs = []

    docs.push({ sourceId: 'about', title: 'About', content: `${HERO_CONTENT}\n\n${ABOUT_TEXT}` })

    EDUCATION.forEach((edu, i) => {
        docs.push({
            sourceId: `education-${i}`,
            title: `Education: ${edu.degree}`,
            content: `${edu.degree} at ${edu.school}, ${edu.location} (${edu.period}). GPA: ${edu.gpa}. Coursework: ${edu.coursework.join(', ')}.`,
        })
    })

    EXPERIENCES.forEach((exp, i) => {
        docs.push({
            sourceId: `experience-${i}`,
            title: `Experience: ${exp.role} at ${exp.company}`,
            content: `${exp.role} at ${exp.company} (${exp.period}). ${exp.description} Technologies: ${exp.technologies.join(', ')}.`,
        })
    })

    PROJECTS.forEach((proj, i) => {
        docs.push({
            sourceId: `project-${i}`,
            title: `Project: ${proj.title}`,
            url: proj.link || proj.githubLink,
            content: `${proj.title}. ${proj.description} Technologies: ${proj.technologies.join(', ')}. GitHub: ${proj.githubLink}${proj.link ? `. Live: ${proj.link}` : ''}.`,
        })
    })

    CERTIFICATIONS.forEach((cert, i) => {
        docs.push({
            sourceId: `certification-${i}`,
            title: `Certification: ${cert.title}`,
            content: `${cert.title}, issued by ${cert.issuer} (${cert.issueDate}${cert.expiryDate ? `, expires ${cert.expiryDate}` : ''}). ${cert.description}`,
        })
    })

    docs.push({
        sourceId: 'skills',
        title: 'Skills & Technologies',
        content: `Technologies and tools: ${TECH_LINKS.map((t) => t.name).join(', ')}.`,
    })

    docs.push({
        sourceId: 'contact',
        title: 'Contact',
        // Phone number deliberately left out: the chatbot shares only the email address.
        content: `Contact: email ${CONTACT.email}, location ${CONTACT.address}.`,
    })

    return docs
}

// Resume text for the chatbot, minus phone numbers and email addresses (the bot gives out
// only the site's contact email, which is in the Contact entry).
async function loadResumeText() {
    const pdf = await getDocumentProxy(new Uint8Array(fs.readFileSync(RESUME_PDF)))
    const { text } = await extractText(pdf, { mergePages: true })
    const phone = /\+?\d?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/
    const email = /[\w.+-]+@[\w-]+\.[\w.]+/
    return text
        .split('\n')
        .filter((line) => !phone.test(line) && !email.test(line))
        .join('\n')
        .trim()
}

async function fetchReadme(githubLink) {
    const match = githubLink?.match(/github\.com\/([^/]+)\/([^/]+)\/?$/)
    if (!match) return null
    const [, owner, repo] = match
    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
            headers: {
                Accept: 'application/vnd.github.raw+json',
                'User-Agent': 'portfolio-reindex-script',
                // Optional: without a token GitHub allows 60 requests/hour per IP, which shared
                // CI IPs (CodeBuild) often exhaust. A token raises it to 5,000.
                ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
            },
        })
        if (!res.ok) {
            console.warn(`  README fetch failed for ${owner}/${repo}: ${res.status}`)
            return null
        }
        return await res.text()
    } catch (err) {
        console.warn(`  README fetch error for ${owner}/${repo}:`, err.message)
        return null
    }
}

const bedrock = new BedrockRuntimeClient({ region: BEDROCK_REGION })

// Cohere takes up to 96 texts per call; documents are embedded as "search_document"
// (questions are embedded as "search_query" at chat time in bedrock_client.py).
async function embedAll(texts, batchSize = 96) {
    const results = []
    for (let i = 0; i < texts.length; i += batchSize) {
        const response = await bedrock.send(new InvokeModelCommand({
            modelId: EMBED_MODEL,
            contentType: 'application/json',
            accept: 'application/json',
            // Cohere rejects texts over 2048 characters; only the whole-resume row is that long,
            // and it's never searched (it's always in the prompt), so truncating is harmless.
            body: JSON.stringify({ texts: texts.slice(i, i + batchSize).map((t) => t.slice(0, 2048)), input_type: 'search_document', truncate: 'END' }),
        }))
        results.push(...JSON.parse(new TextDecoder().decode(response.body)).embeddings)
    }
    return results
}

async function fetchPublishedPosts() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?published=eq.true&select=id,slug,title,content_md`, {
        headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
    })
    if (!res.ok) throw new Error(`Supabase blog_posts read failed: ${res.status} ${await res.text()}`)
    return res.json()
}

async function supabaseRequest(method, pathAndQuery, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, {
        method,
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
        },
        body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
        throw new Error(`Supabase ${method} ${pathAndQuery} failed: ${res.status} ${await res.text()}`)
    }
}

async function main() {
    console.log('Building documents from portfolio constants...')
    const documents = buildDocuments()

    console.log('Fetching GitHub READMEs...')
    // Stable per-repo ids, so a README whose fetch fails keeps its previous chunks
    const readmeId = (link) => `readme:${(link || '').replace(/\/+$/, '').split('/').slice(-2).join('/')}`
    const currentReadmeIds = PROJECTS.filter((p) => p.githubLink).map((p) => readmeId(p.githubLink))
    const fetchedReadmeIds = []
    for (const proj of PROJECTS) {
        const readme = await fetchReadme(proj.githubLink)
        if (readme) {
            fetchedReadmeIds.push(readmeId(proj.githubLink))
            documents.push({
                sourceId: readmeId(proj.githubLink),
                title: `${proj.title} README`,
                url: proj.githubLink,
                content: readme,
                sourceType: 'readme',
            })
            console.log(`  fetched README for ${proj.title}`)
        }
    }

    console.log('Reading resume PDF...')
    documents.push({
        sourceId: 'resume',
        title: 'Resume',
        content: await loadResumeText(),
        sourceType: 'resume',
        // Kept whole: the backend puts it into every prompt rather than searching it
        wholeDocument: true,
    })

    console.log('Fetching published blog posts...')
    for (const post of await fetchPublishedPosts()) {
        documents.push({
            sourceId: post.id,
            title: post.title,
            url: `/blog/${post.slug}`,
            content: post.content_md,
            sourceType: 'blog',
        })
    }

    const rows = []
    for (const doc of documents) {
        const sourceType = doc.sourceType || 'constants'
        const chunks = doc.wholeDocument ? [doc.content] : chunkText(doc.content)
        chunks.forEach((chunk) => {
            rows.push({
                source_type: sourceType,
                source_id: doc.sourceId,
                title: doc.title,
                content: chunk,
                url: doc.url || null,
            })
        })
    }
    console.log(`Prepared ${rows.length} chunks from ${documents.length} documents.`)

    console.log(`Embedding ${rows.length} chunks with ${EMBED_MODEL}...`)
    const embeddings = await embedAll(rows.map((r) => r.content))
    rows.forEach((row, i) => {
        row.embedding = embeddings[i]
    })

    console.log('Refreshing content_chunks...')
    const inList = (ids) => `(${ids.map((id) => `"${id}"`).join(',')})`
    await supabaseRequest('DELETE', 'content_chunks?source_type=in.(constants,resume,blog)')
    // READMEs: replace only the ones fetched just now; keep the rest (fetch failed, e.g. GitHub
    // rate limit) as they were; drop those of projects that no longer exist.
    if (fetchedReadmeIds.length) {
        await supabaseRequest('DELETE', `content_chunks?source_type=eq.readme&source_id=in.${inList(fetchedReadmeIds)}`)
    }
    await supabaseRequest('DELETE', `content_chunks?source_type=eq.readme&source_id=not.in.${inList(currentReadmeIds)}`)
    const failed = currentReadmeIds.length - fetchedReadmeIds.length
    if (failed) console.warn(`  ${failed} README fetch(es) failed; kept their previously indexed chunks.`)

    const INSERT_BATCH = 100
    for (let i = 0; i < rows.length; i += INSERT_BATCH) {
        await supabaseRequest('POST', 'content_chunks', rows.slice(i, i + INSERT_BATCH))
    }

    console.log(`Reindex complete: ${rows.length} chunks upserted.`)
}

main().catch((err) => {
    console.error('Reindex failed:', err)
    process.exit(1)
})
