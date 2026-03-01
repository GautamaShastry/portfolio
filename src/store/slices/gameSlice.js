import { createSlice } from '@reduxjs/toolkit'

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        isOpen: false,
        hasWon: false,
        secretCode: null,
        attempts: [],
        maxAttempts: 10
    },
    reducers: {
        openGame: (state) => {
            state.isOpen = true
            // Generate random 4-digit code
            state.secretCode = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10))
            state.attempts = []
            state.hasWon = false
        },
        closeGame: (state) => {
            state.isOpen = false
        },
        submitGuess: (state, action) => {
            const guess = action.payload
            const result = {
                guess,
                feedback: [] // Array of 'correct', 'wrong-position', or 'incorrect' for each digit
            }
            
            // Create feedback for each position
            const secretCopy = [...state.secretCode]
            const guessCopy = [...guess]
            
            // First pass: mark correct positions
            for (let i = 0; i < 4; i++) {
                if (guessCopy[i] === secretCopy[i]) {
                    result.feedback[i] = 'correct'
                    secretCopy[i] = null
                    guessCopy[i] = null
                }
            }
            
            // Second pass: mark wrong positions
            for (let i = 0; i < 4; i++) {
                if (guessCopy[i] !== null) {
                    const index = secretCopy.indexOf(guessCopy[i])
                    if (index !== -1) {
                        result.feedback[i] = 'wrong-position'
                        secretCopy[index] = null
                    } else {
                        result.feedback[i] = 'incorrect'
                    }
                }
            }
            
            state.attempts.push(result)
            
            // Check if all positions are correct
            if (result.feedback.every(f => f === 'correct')) {
                state.hasWon = true
            }
        },
        resetGame: (state) => {
            state.isOpen = false
            state.hasWon = false
            state.secretCode = null
            state.attempts = []
        }
    }
})

export const { openGame, closeGame, submitGuess, resetGame } = gameSlice.actions
export const selectGameState = (state) => state.game
export default gameSlice.reducer
