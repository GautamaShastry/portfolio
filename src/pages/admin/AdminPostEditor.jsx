import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchAllPostsAdmin, createPost, updatePost, selectPostsState } from '../../store/slices/postsSlice'
import SEO from '../../components/SEO'

const slugify = (title) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const emptyPost = { title: '', slug: '', excerpt: '', content_md: '', tags: '', published: false }

const AdminPostEditor = () => {
    const { id } = useParams()
    const isEditing = Boolean(id)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { adminPosts, isSaving } = useAppSelector(selectPostsState)
    const [form, setForm] = useState(emptyPost)
    const [slugTouched, setSlugTouched] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

    useEffect(() => {
        if (isEditing && adminPosts.length === 0) {
            dispatch(fetchAllPostsAdmin())
        }
    }, [dispatch, isEditing, adminPosts.length])

    useEffect(() => {
        if (!isEditing) return
        const existing = adminPosts.find((p) => p.id === id)
        if (existing) {
            setForm({
                title: existing.title,
                slug: existing.slug,
                excerpt: existing.excerpt || '',
                content_md: existing.content_md,
                tags: (existing.tags || []).join(', '),
                published: existing.published
            })
            setSlugTouched(true)
        }
    }, [isEditing, id, adminPosts])

    const handleTitleChange = (title) => {
        setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            title: form.title,
            slug: form.slug || slugify(form.title),
            excerpt: form.excerpt,
            content_md: form.content_md,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            published: form.published
        }
        try {
            if (isEditing) {
                await dispatch(updatePost({ id, ...payload })).unwrap()
                toast.success('Post updated')
            } else {
                await dispatch(createPost(payload)).unwrap()
                toast.success('Post created')
            }
            navigate('/admin')
        } catch (err) {
            toast.error(err || 'Failed to save post')
        }
    }

    const previewNode = useMemo(
        () => <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content_md || '*Nothing to preview yet*'}</ReactMarkdown>,
        [form.content_md]
    )

    return (
        <div className="pt-8 max-w-3xl mx-auto pb-20">
            <SEO title="Admin | Satya Bulusu" description="Blog post editor" path="/admin/posts" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {isEditing ? 'Edit post' : 'New post'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                    <input
                        required
                        value={form.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Slug</label>
                    <input
                        required
                        value={form.slug}
                        onChange={(e) => { setSlugTouched(true); setForm((f) => ({ ...f, slug: e.target.value })) }}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Excerpt</label>
                    <textarea
                        rows={2}
                        value={form.excerpt}
                        onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (comma separated)</label>
                    <input
                        value={form.tags}
                        onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                        placeholder="AI, RAG, engineering"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                        <button
                            type="button"
                            onClick={() => setShowPreview((v) => !v)}
                            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                        >
                            {showPreview ? 'Edit' : 'Preview'}
                        </button>
                    </div>
                    {showPreview ? (
                        <div className="prose prose-neutral dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl min-h-[300px]">
                            {previewNode}
                        </div>
                    ) : (
                        <textarea
                            required
                            rows={16}
                            value={form.content_md}
                            onChange={(e) => setForm((f) => ({ ...f, content_md: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                        />
                    )}
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                        className="rounded"
                    />
                    Published (visible on /blog and answerable by the chatbot/voice agent immediately)
                </label>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : isEditing ? 'Save changes' : 'Create post'}
                </button>
            </form>
        </div>
    )
}

export default AdminPostEditor
