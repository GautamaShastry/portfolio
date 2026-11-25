import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import { selectIsDark } from './store/slices/themeSlice'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import CodeBreakerGame from './components/CodeBreakerGame'
import ProtectedRoute from './components/admin/ProtectedRoute'
import CommandPalette from './components/CommandPalette'
import { initAnalytics, trackPageView } from './lib/analytics'

initAnalytics()

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Experience = lazy(() => import('./pages/Experience'))
const Contact = lazy(() => import('./pages/Contact'))
const SecretPage = lazy(() => import('./pages/SecretPage'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const VoiceAgent = lazy(() => import('./pages/VoiceAgent'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminPostEditor = lazy(() => import('./pages/admin/AdminPostEditor'))
const AdminInsights = lazy(() => import('./pages/admin/AdminInsights'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Chatbot = lazy(() => import('./components/Chatbot'))

// Loading spinner
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
)

const App = () => {
    const isDark = useAppSelector(selectIsDark)
    const location = useLocation()
    const isSecretPage = location.pathname === '/secret'

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
    }, [isDark])

    // GA4 page views. GA records the initial page load by itself (Enhanced measurement's page view
    // can't be turned off), so only in-app route changes are sent here - after a short delay so the
    // new page's <title> (react-helmet) is in place. Keep "Page changes based on browser history
    // events" unchecked in GA, or route changes are counted twice.
    const lastTrackedPath = useRef(location.pathname + location.search)
    useEffect(() => {
        const path = location.pathname + location.search
        if (path === lastTrackedPath.current) return
        const timer = setTimeout(() => {
            lastTrackedPath.current = path
            trackPageView()
        }, 300)
        return () => clearTimeout(timer)
    }, [location.pathname, location.search])

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
            <AnimatedBackground />
            
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white/80 to-purple-50/90 dark:from-neutral-950/95 dark:via-neutral-950/90 dark:to-neutral-900/95 transition-opacity duration-300" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className='relative'>
                {!isSecretPage && <Navbar />}
                <main className='container mx-auto px-4 md:px-8 pt-20 min-h-[calc(100vh-200px)]'>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/experience" element={<Experience />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/secret" element={<SecretPage />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />
                            <Route path="/voice-agent" element={<VoiceAgent />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                            <Route path="/admin/insights" element={<ProtectedRoute><AdminInsights /></ProtectedRoute>} />
                            <Route path="/admin/posts/new" element={<ProtectedRoute><AdminPostEditor /></ProtectedRoute>} />
                            <Route path="/admin/posts/:id/edit" element={<ProtectedRoute><AdminPostEditor /></ProtectedRoute>} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </main>
                {!isSecretPage && <Footer />}
                <Suspense fallback={null}>
                    <Chatbot />
                </Suspense>
                <CodeBreakerGame />
                <CommandPalette />
            </div>
        </div>
    )
}

export default App
