import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import { FaCalendarDays, FaArrowLeft } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchPostBySlug, clearCurrentPost, selectPostsState } from '../store/slices/postsSlice'
import SEO from '../components/SEO'
import site from '../../site.config.js'

const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const BlogPost = () => {
    const { slug } = useParams()
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { current: post, isLoading, error } = useAppSelector(selectPostsState)

    useEffect(() => {
        dispatch(fetchPostBySlug(slug))
        return () => dispatch(clearCurrentPost())
    }, [dispatch, slug])

    return (
        <div className="pt-8 max-w-3xl mx-auto pb-20">
            <SEO
                title={post ? `${post.title} | ${site.name}` : `Blog | ${site.name}`}
                description={post?.excerpt || `A post from ${site.name}'s blog.`}
                path={`/blog/${slug}`}
            />

            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline mb-8">
                <FaArrowLeft size={12} /> {t('blog.back')}
            </Link>

            {isLoading && (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
            )}

            {!isLoading && error && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-20">{t('blog.not_found')}</p>
            )}

            {!isLoading && post && (
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <FaCalendarDays />
                        <span>{formatDate(post.published_at)}</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
                    {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-purple-500">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content_md}</ReactMarkdown>
                    </div>
                </motion.article>
            )}
        </div>
    )
}

export default BlogPost
