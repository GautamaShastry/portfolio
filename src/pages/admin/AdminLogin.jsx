import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLock } from 'react-icons/fa6'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { login, selectAdminAuthState, selectIsAdminAuthenticated } from '../../store/slices/adminAuthSlice'
import SEO from '../../components/SEO'
import site from '../../../site.config.js'

const AdminLogin = () => {
    const [password, setPassword] = useState('')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { isLoading, error } = useAppSelector(selectAdminAuthState)
    const isAuthenticated = useAppSelector(selectIsAdminAuthenticated)

    useEffect(() => {
        if (isAuthenticated) navigate('/admin', { replace: true })
    }, [isAuthenticated, navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!password || isLoading) return
        dispatch(login(password))
    }

    return (
        <div className="pt-8 min-h-[60vh] flex items-center justify-center">
            <SEO title={`Admin | ${site.name}`} description="Admin login" path="/admin/login" />
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm p-8 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-purple-500/10 rounded-full text-purple-500">
                        <FaLock size={24} />
                    </div>
                </div>
                <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-6">Admin Login</h1>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    autoFocus
                    className="w-full px-4 py-3 mb-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <button
                    type="submit"
                    disabled={isLoading || !password}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>
            </motion.form>
        </div>
    )
}

export default AdminLogin
