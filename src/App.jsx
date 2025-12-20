import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Technologies from './components/Technologies'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Certification from './components/Certification'
import Chatbot from './components/Chatbot'
import { useTheme } from './context/ThemeContext'

const App = () => {
    const { isDark } = useTheme()

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:opacity-0 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-neutral-950 opacity-0 dark:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                </div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className='relative'>
                <Navbar />
                <main className='container mx-auto px-4 md:px-8 pt-20'>
                    <Hero />
                    <About />
                    <Technologies />
                    <Certification />
                    <Experience />
                    <Projects />
                    <Contact />
                </main>
                <Footer />
                <Chatbot />
            </div>
        </div>
    )
}

export default App
