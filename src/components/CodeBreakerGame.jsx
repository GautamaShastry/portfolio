import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaLock, FaCheck, FaExclamation } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectGameState, closeGame, submitGuess, resetGame } from '../store/slices/gameSlice'

const CodeBreakerGame = () => {
    const dispatch = useAppDispatch()
    const { isOpen, hasWon, attempts, maxAttempts } = useAppSelector(selectGameState)
    const [currentGuess, setCurrentGuess] = useState(['', '', '', ''])
    const [focusedIndex, setFocusedIndex] = useState(0)

    useEffect(() => {
        if (hasWon) {
            setTimeout(() => {
                // Open secret page in new window
                window.open('/secret', '_blank')
                // Reset game and close
                dispatch(closeGame())
                dispatch(resetGame())
            }, 2000)
        }
    }, [hasWon, dispatch])

    const handleNumberClick = (num) => {
        if (currentGuess[focusedIndex] === '') {
            const newGuess = [...currentGuess]
            newGuess[focusedIndex] = num
            setCurrentGuess(newGuess)
            if (focusedIndex < 3) {
                setFocusedIndex(focusedIndex + 1)
            }
        }
    }

    const handleBackspace = () => {
        if (currentGuess[focusedIndex] !== '') {
            const newGuess = [...currentGuess]
            newGuess[focusedIndex] = ''
            setCurrentGuess(newGuess)
        } else if (focusedIndex > 0) {
            setFocusedIndex(focusedIndex - 1)
            const newGuess = [...currentGuess]
            newGuess[focusedIndex - 1] = ''
            setCurrentGuess(newGuess)
        }
    }

    const handleSubmit = () => {
        if (currentGuess.every(n => n !== '')) {
            dispatch(submitGuess(currentGuess.map(Number)))
            setCurrentGuess(['', '', '', ''])
            setFocusedIndex(0)
        }
    }

    const attemptsLeft = maxAttempts - attempts.length
    const isGameOver = attemptsLeft === 0 && !hasWon

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => dispatch(closeGame())}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                        <button
                            onClick={() => dispatch(closeGame())}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <FaTimes />
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <FaLock size={24} />
                            <h2 className="text-2xl font-bold">Code Breaker</h2>
                        </div>
                        <p className="text-white/80 text-sm">Crack the 4-digit code to unlock the secret page!</p>
                    </div>

                    {/* Game Content */}
                    <div className="p-6">
                        {/* Attempts Left */}
                        <div className="mb-4 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Attempts left: <span className="font-bold text-purple-600">{attemptsLeft}</span>
                            </p>
                        </div>

                        {/* Current Guess */}
                        <div className="flex justify-center gap-3 mb-6">
                            {currentGuess.map((digit, idx) => (
                                <motion.div
                                    key={idx}
                                    onClick={() => setFocusedIndex(idx)}
                                    whileHover={{ scale: 1.05 }}
                                    className={`w-16 h-20 flex items-center justify-center text-3xl font-bold rounded-xl border-2 cursor-pointer transition-all ${
                                        focusedIndex === idx
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800'
                                    }`}
                                >
                                    {digit || '?'}
                                </motion.div>
                            ))}
                        </div>

                        {/* Number Pad */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <motion.button
                                    key={num}
                                    onClick={() => handleNumberClick(num)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl font-bold text-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                >
                                    {num}
                                </motion.button>
                            ))}
                            <motion.button
                                onClick={handleBackspace}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl font-bold text-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                                ←
                            </motion.button>
                            <motion.button
                                onClick={() => handleNumberClick(0)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-4 bg-gray-100 dark:bg-neutral-800 rounded-xl font-bold text-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                            >
                                0
                            </motion.button>
                            <motion.button
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={currentGuess.some(n => n === '')}
                                className="p-4 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ✓
                            </motion.button>
                        </div>

                        {/* Previous Attempts */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {attempts.map((attempt, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                                >
                                    {attempt.guess.map((digit, i) => {
                                        const feedback = attempt.feedback[i]
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className={`w-12 h-12 flex items-center justify-center rounded-lg font-bold text-lg ${
                                                    feedback === 'correct'
                                                        ? 'bg-green-500 text-white ring-2 ring-green-600'
                                                        : feedback === 'wrong-position'
                                                        ? 'bg-yellow-500 text-white ring-2 ring-yellow-600'
                                                        : 'bg-gray-300 dark:bg-neutral-600 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {digit}
                                                {feedback === 'correct' && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-1 -right-1"
                                                    >
                                                        <FaCheck className="text-white bg-green-600 rounded-full p-0.5" size={14} />
                                                    </motion.span>
                                                )}
                                                {feedback === 'wrong-position' && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-1 -right-1"
                                                    >
                                                        <FaExclamation className="text-white bg-yellow-600 rounded-full p-0.5" size={14} />
                                                    </motion.span>
                                                )}
                                            </motion.div>
                                        )
                                    })}
                                </motion.div>
                            ))}
                        </div>

                        {/* Win/Lose Message */}
                        <AnimatePresence>
                            {hasWon && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-center"
                                >
                                    <p className="text-green-800 dark:text-green-300 font-bold text-lg">
                                        🎉 Code Cracked! Opening secret page...
                                    </p>
                                </motion.div>
                            )}
                            {isGameOver && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 rounded-xl text-center"
                                >
                                    <p className="text-red-800 dark:text-red-300 font-bold">
                                        Game Over! Try again?
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Legend */}
                        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs">
                            <p className="font-bold mb-2 text-gray-700 dark:text-gray-300">How to play:</p>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                                        <FaCheck className="text-white" size={10} />
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400">Green = Correct digit in correct position</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
                                        <FaExclamation className="text-white" size={10} />
                                    </div>
                                    <span className="text-gray-600 dark:text-gray-400">Yellow = Correct digit in wrong position</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-300 dark:bg-neutral-600 rounded"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Gray = Incorrect digit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default CodeBreakerGame
