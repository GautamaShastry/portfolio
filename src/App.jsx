import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import { useTheme } from './context/ThemeContext'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const Experience = lazy(() => import('./pages/Experience'))
const Contact = lazy(() => import('./pages/Contact'))
const Chatbot = lazy(() => import('./components/Chatbot'))

// Loading spinner
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
)

const App = () => {
    const { isDark } = useTheme()

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
            <AnimatedBackground />
            
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/90 via-white/80 to-purple-50/90 dark:from-neutral-950/95 dark:via-neutral-950/90 dark:to-neutral-900/95 transition-opacity duration-300" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className='relative'>
                <Navbar />
                <main className='container mx-auto px-4 md:px-8 pt-20 min-h-[calc(100vh-200px)]'>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/experience" element={<Experience />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
                <Suspense fallback={null}>
                    <Chatbot />
                </Suspense>
            </div>
        </div>
    )
}

export default App
