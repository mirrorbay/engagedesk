/**
 * Mixed Arithmetic Problem Generator
 * Generates multi-step arithmetic problems with specified difficulty level
 * 
 * Mixed arithmetic involves 2-step or 3-step operations combining addition, subtraction, 
 * multiplication, and division with proper order of operations (PEMDAS/BODMAS).
 * 
 * Difficulty assignment:
 * - 2 steps: level 1 and 2 (depending on digits/borrowing/carrying complexity)
 * - 3 steps: level 3, 4, 5 (depending on digits/borrowing/carrying complexity)
 * 
 * Estimated time is now centralized in config.js based on difficulty levels.
 */

const { generateTwoStep } = require('./mixedArithmeticHelpers/twoStep');
const { generateThreeStep } = require('./mixedArithmeticHelpers/threeStep');
const { removeUnnecessaryParentheses } = require('./basicArithmeticHelpers/utils');
const CONFIG = require('./config');

/**
 * Get estimated time for mixed arithmetic based on difficulty level
 * @param {number} difficulty - Difficulty level from 1-5
 * @returns {number} Estimated time in seconds
 */
function getEstimatedTime(difficulty) {
    return CONFIG.AVAILABLE_CONCEPTS.mixedArithmetic.estimatedTimeSeconds[difficulty];
}

/**
 * Main function to generate mixed arithmetic problems with estimated time
 * @param {string} subcategory - The type of problem (mixedArithmetic)
 * @param {number} difficulty - Difficulty level from 1-5
 * @returns {object} Object containing question, answer, and estimatedTimeSeconds
 */
function generateProblem(subcategory, difficulty) {
    // Validate inputs
    if (difficulty < 1 || difficulty > 5) {
        throw new Error('Difficulty must be between 1 and 5');
    }
    
    if (subcategory.toLowerCase() !== 'mixedarithmetic') {
        throw new Error(`Unknown subcategory: ${subcategory}`);
    }
    
    // Generate the problem
    let result;
    if (difficulty <= 2) {
        result = generateTwoStep(difficulty);
    } else {
        result = generateThreeStep(difficulty);
    }
    
    // Remove unnecessary parentheses
    const cleanedQuestion = removeUnnecessaryParentheses(result.question);
    
    return {
        question: cleanedQuestion,
        answer: result.answer,
        estimatedTimeSeconds: getEstimatedTime(difficulty)
    };
}

// Export functions for use by other scripts
module.exports = {
    generateProblem
};
