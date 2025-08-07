/**
 * Problem Registry - Central registry for all available concepts and their generators
 * This file maps concept names to their corresponding problem generators
 */

const { generateProblem: generateBasicArithmetic } = require('./basicArithmetic');
const { generateProblem: generateMixedArithmetic } = require('./mixedArithmetic');
const CONFIG = require('./config');

/**
 * Get all available concepts for the frontend
 * @returns {Array} Array of concept objects with id and displayName
 */
function getAvailableConcepts() {
    return Object.keys(CONFIG.AVAILABLE_CONCEPTS).map(key => ({
        id: key,
        displayName: CONFIG.AVAILABLE_CONCEPTS[key].displayName,
        category: CONFIG.AVAILABLE_CONCEPTS[key].category
    }));
}

/**
 * Generate a problem for a specific concept and difficulty
 * @param {string} conceptId - The concept identifier
 * @param {number} difficulty - Difficulty level (1-5)
 * @returns {object} Generated problem with question, answer, and estimatedTimeSeconds
 */
function generateProblemForConcept(conceptId, difficulty) {
    const concept = CONFIG.AVAILABLE_CONCEPTS[conceptId];
    if (!concept) {
        throw new Error(`Unknown concept: ${conceptId}`);
    }
    
    // For concepts with multiple subcategories, randomly select one
    const subcategories = concept.subcategories;
    const selectedSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
    
    // Use the appropriate generator based on category
    if (concept.category === 'basic') {
        return generateBasicArithmetic(selectedSubcategory, difficulty);
    } else if (concept.category === 'mixed') {
        return generateMixedArithmetic(selectedSubcategory, difficulty);
    } else {
        throw new Error(`Unknown category: ${concept.category}`);
    }
}

/**
 * Get concept details by ID
 * @param {string} conceptId - The concept identifier
 * @returns {object} Concept details
 */
function getConceptDetails(conceptId) {
    return CONFIG.AVAILABLE_CONCEPTS[conceptId];
}

module.exports = {
    getAvailableConcepts,
    generateProblemForConcept,
    getConceptDetails
};
