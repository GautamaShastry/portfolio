import { motion } from 'framer-motion'
import { FaTrophy, FaRocket, FaHeart, FaCode, FaCoffee, FaGamepad, FaMusic, FaBook, FaGlobe } from 'react-icons/fa'

const SecretPage = () => {

    const blogs = [
        {
            title: "From 500ms to 30ms: Engineering Real-Time YOLOv8 on CPU",
            date: "Published",
            excerpt: "Deep dive into optimizing YOLOv8 inference on CPU, achieving 16x speedup through batching, threading, and smart preprocessing techniques.",
            tags: ["Performance", "YOLOv8", "Python"],
            readTime: "8 min",
            link: "https://medium.com/@gautamashastry/from-500ms-to-30ms-engineering-real-time-yolov8-on-cpu-eb2b21573438"
        }
    ]

    const funFacts = [
        { icon: FaCoffee, text: "Coffee + debugging is my favorite combo — I do some of my best problem-solving with a coffee in hand." },
        { icon: FaGamepad, text: "Strategy gamer at heart — Games have sharpened how I think about systems, trade-offs, and long-term planning." },
        { icon: FaMusic, text: "I code best to lo-fi and instrumental playlists — Music helps me stay focused during deep work and long build sessions." },
        { icon: FaCode, text: "I care a lot about naming things well — Clear variable names and clean code make systems easier to scale and maintain." },
        { icon: FaBook, text: "Currently reading: Designing Data-Intensive Applications — I enjoy learning how real-world distributed systems are designed." },
        { icon: FaGlobe, text: "Currently learning ArcGIS — I am interested in how geospatial tools turn raw location data into meaningful insights and decisions." },
        { icon: FaRocket, text: "Space and engineering enthusiast — I follow rocket launches and love the scale, precision, and ambition behind them." },
    ]

    return (
        <div className="min-h-screen pt-24 pb-12">
            {/* Confetti Effect */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-500 rounded-full"
                        initial={{ 
                            x: Math.random() * window.innerWidth, 
                            y: -20,
                            rotate: 0 
                        }}
                        animate={{ 
                            y: window.innerHeight + 20,
                            rotate: 360,
                            opacity: [1, 0]
                        }}
                        transition={{ 
                            duration: 3 + Math.random() * 2,
                            delay: Math.random() * 2,
                            repeat: Infinity
                        }}
                    />
                ))}
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                {/* Achievement Badge */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-lg">
                        <FaTrophy size={24} />
                        <span className="font-bold text-lg">Achievement Unlocked!</span>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-gray-600 dark:text-gray-400"
                    >
                        You cracked the code! Welcome to the secret page 🎉
                    </motion.p>
                </motion.div>

                {/* Message to Recruiters */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16 p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-200 dark:border-purple-800"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FaRocket className="text-purple-600 text-3xl" />
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            You Just Hired the Right Engineer
                        </h2>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                            If you're reading this, you found the easter egg. That means you value curiosity, attention to detail, and engineers who go the extra mile. Good news—you're looking at one.
                        </p>
                        
                        <p>
                            I'm <strong>Satya (Gautam)</strong>, and I don't just write code—I build systems that scale, ship features that matter, and solve problems that keep teams up at night.
                        </p>

                        <div className="my-6 p-4 bg-white dark:bg-neutral-800/50 rounded-xl border-l-4 border-purple-500">
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">Here's what you're getting:</p>
                            <ul className="space-y-2 text-sm">
                                <li>✅ <strong>Backend depth:</strong> Spring Boot microservices, FastAPI, distributed systems, and APIs that don't break at 3 AM</li>
                                <li>✅ <strong>AI/ML execution:</strong> Built production RAG pipelines, multi-agent systems, and LLM workflows—not just demos</li>
                                <li>✅ <strong>Cloud-native mindset:</strong> Kubernetes, Docker, AWS, CI/CD—I deploy to prod, not just localhost</li>
                                <li>✅ <strong>Performance obsession:</strong> Reduced API latency by 35ms, achieved 30x GPU speedup, cut QA setup by 80%</li>
                                <li>✅ <strong>Ownership mentality:</strong> I don't wait for tickets—I find problems, propose solutions, and ship them</li>
                            </ul>
                        </div>

                        <p>
                            <strong className="text-purple-600 dark:text-purple-400">What I've shipped recently:</strong>
                        </p>
                        <ul className="list-none space-y-2 ml-4">
                            <li>🚀 <strong>Sentinel AI:</strong> Real-time video inference pipeline with gRPC, Kafka, GPU batching—24.3 FPS at 1080p</li>
                            <li>🤖 <strong>HireReady:</strong> 9-agent LangGraph system with circuit breakers, Redis caching, 100-concurrent load tests</li>
                            <li>⚙️ <strong>SurveyOps:</strong> Kubernetes deployment with rolling updates, health checks, and {'<'}5min CI/CD</li>
                            <li>🔧 <strong>AutoE2E:</strong> Ansible-based testing framework that cut manual QA setup by 80%</li>
                        </ul>

                        <p>
                            I'm not the engineer who needs hand-holding. I'm the one who:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Reads the docs before asking questions</li>
                            <li>Writes tests because future-me will thank present-me</li>
                            <li>Adds observability because "it works on my machine" isn't good enough</li>
                            <li>Reviews PRs like I'm the one on-call when it breaks</li>
                            <li>Mentors juniors because great teams compound knowledge</li>
                        </ul>

                        <div className="my-6 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl">
                            <p className="font-semibold text-gray-900 dark:text-white mb-2">What I'm looking for:</p>
                            <ul className="space-y-1 text-sm">
                                <li>🎯 <strong>High-impact work:</strong> Distributed systems, AI infrastructure, or products where reliability matters</li>
                                <li>🧠 <strong>Smart teammates:</strong> Engineers who challenge me, teach me, and push me to level up</li>
                                <li>📈 <strong>Growth trajectory:</strong> A place where I can go from IC to tech lead to architect</li>
                                <li>🏡 <strong>Remote-friendly:</strong> Based in Fairfax, VA—open to hybrid or remote roles</li>
                                <li>💡 <strong>Engineering culture:</strong> Where "move fast and break things" includes "then fix them properly"</li>
                            </ul>
                        </div>

                        <p>
                            <strong className="text-purple-600 dark:text-purple-400">Why you should hire me:</strong>
                        </p>
                        <p>
                            Because I'm not just another resume. I'm the engineer who:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Ships features that users love and systems that ops teams trust</li>
                            <li>Debugs production issues at 2 AM without complaining (okay, maybe a little)</li>
                            <li>Writes documentation because I know I'll forget how this works in 6 months</li>
                            <li>Asks "why are we building this?" before asking "how do we build this?"</li>
                            <li>Treats code reviews as learning opportunities, not ego battles</li>
                        </ul>

                        <p className="pt-4 border-t border-purple-200 dark:border-purple-800 text-lg">
                            I'm not looking for "just a job." I'm looking for a team where I can build systems that matter, 
                            solve problems that are hard, and work with people who make me better every day.
                        </p>

                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            Let's build something great. I'm ready when you are. 🚀
                        </p>

                        <div className="flex gap-4 pt-6">
                            <a
                                href="mailto:gautamashastry@gmail.com"
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg"
                            >
                                📧 Email Me
                            </a>
                            <a
                                href="https://calendly.com/gautamashastry"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                            >
                                📅 Schedule a Call
                            </a>
                            <a
                                href="https://www.linkedin.com/in/satya2603/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                                💼 LinkedIn
                            </a>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-500 italic pt-4">
                            P.S. - If you made it this far, you're the kind of recruiter/hiring manager I want to work with. 
                            Let's skip the "tell me about yourself" and talk about the hard problems you're solving.
                        </p>
                    </div>
                </motion.section>

                {/* Blog Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <FaBook className="text-purple-600" />
                        Latest Blog Post
                    </h2>
                    
                    <div className="grid gap-6">
                        {blogs.map((blog, idx) => (
                            <motion.a
                                key={idx}
                                href={blog.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + idx * 0.1 }}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(168, 85, 247, 0.2)" }}
                                className="block p-6 bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                                        {blog.title}
                                    </h3>
                                    <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                        {blog.readTime}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {blog.excerpt}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {blog.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                                        {blog.date}
                                    </span>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </motion.section>

                {/* Fun Facts */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <FaHeart className="text-red-500" />
                        Fun Facts About Me
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {funFacts.map((fact, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + idx * 0.1 }}
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                            >
                                <div className="flex items-start gap-3">
                                    <fact.icon className="text-purple-600 text-2xl flex-shrink-0 mt-1" />
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {fact.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Warning */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                >
                    <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                        ⚠️ Remember: Once you leave this page, you can't come back without playing the game again!
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SecretPage
