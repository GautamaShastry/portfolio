import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaPlus, FaPen, FaTrash, FaRightFromBracket, FaChartColumn } from 'react-icons/fa6'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllPostsAdmin, deletePost, selectPostsState } from '../../store/slices/postsSlice'
import { logout } from '../../store/slices/adminAuthSlice'
import SEO from '../../components/SEO'
import site from '../../../site.config.js'

const AdminDashboard = () => {
    const dispatch = useAppDispatch()
    const { adminPosts, isLoading } = useAppSelector(selectPostsState)

    useEffect(() => {
        dispatch(fetchAllPostsAdmin())
    }, [dispatch])

    const handleDelete = (post) => {
        if (window.confirm(`Delete "${post.title}"? This can't be undone.`)) {
            dispatch(deletePost(post.id))
        }
    }

    return (
        <div className="pt-8 max-w-4xl mx-auto pb-20">
            <SEO title={`Admin | ${site.name}`} description="Blog admin dashboard" path="/admin" />

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
                <div className="flex gap-3">
                    <Link
                        to="/admin/insights"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-200 text-sm font-medium hover:text-purple-500"
                    >
                        <FaChartColumn size={12} /> Insights
                    </Link>
                    <Link
                        to="/admin/posts/new"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 text-sm font-medium"
                    >
                        <FaPlus size={12} /> New post
                    </Link>
                    <button
                        onClick={() => dispatch(logout())}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 text-sm font-medium"
                    >
                        <FaRightFromBracket size={12} /> Log out
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
            )}

            {!isLoading && adminPosts.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">No posts yet - create your first one.</p>
            )}

            <div className="space-y-3">
                {adminPosts.map((post) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-white dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-700"
                    >
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{post.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                /{post.slug} · {post.published ? 'Published' : 'Draft'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                to={`/admin/posts/${post.id}/edit`}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:text-purple-500"
                            >
                                <FaPen size={14} />
                            </Link>
                            <button
                                onClick={() => handleDelete(post)}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 hover:text-red-500"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default AdminDashboard
