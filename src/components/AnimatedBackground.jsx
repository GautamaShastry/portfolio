import { useAppSelector } from '../store/hooks'
import { selectIsDark } from '../store/slices/themeSlice'

// Simplified static background - no animation loop for better performance
const AnimatedBackground = () => {
    const isDark = useAppSelector(selectIsDark)

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Static gradient orbs with CSS animation */}
            <div 
                className={`absolute w-96 h-96 rounded-full blur-3xl ${isDark ? 'opacity-20' : 'opacity-10'}`}
                style={{
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent)',
                    top: '10%',
                    left: '10%',
                    animation: 'float 20s ease-in-out infinite',
                }}
            />
            <div 
                className={`absolute w-80 h-80 rounded-full blur-3xl ${isDark ? 'opacity-15' : 'opacity-8'}`}
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent)',
                    bottom: '20%',
                    right: '15%',
                    animation: 'float 25s ease-in-out infinite reverse',
                }}
            />
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
            `}</style>
        </div>
    )
}

export default AnimatedBackground
