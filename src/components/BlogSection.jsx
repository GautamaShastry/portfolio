import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCalendarDays, FaArrowRight } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchPublishedPosts, selectPostsState } from '../store/slices/postsSlice'

const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const BlogSection = () => {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { published, isLoading } = useAppSelector(selectPostsState)

    useEffect(() => {
        dispatch(fetchPublishedPosts())
    }, [dispatch])

    return (
        <section className="py-20 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 relative z-10"
            >
                <span className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium inline-block">
                    {t('blog.title')}
                </span>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    {t('blog.subtitle')}
                </h2>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    {t('blog.description')}
                </p>
            </motion.div>

            {isLoading && (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
            )}

            {!isLoading && published.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">{t('blog.empty')}</p>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {published.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.08 }}
                        whileHover={{ y: -6 }}
                        className="group bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-lg overflow-hidden flex flex-col"
                    >
                        <Link to={`/blog/${post.slug}`} className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                <FaCalendarDays />
                                <span>{formatDate(post.published_at)}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                                {post.title}
                            </h3>
                            {post.excerpt && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{post.excerpt}</p>
                            )}
                            <div className="mt-auto flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium">
                                {t('blog.read_more')}
                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
                            </div>
                            {post.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {post.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md text-xs font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default BlogSection
