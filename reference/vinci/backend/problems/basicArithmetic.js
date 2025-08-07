/**
 * Basic Arithmetic Problem Generator
 * Generates arithmetic problems with specified subcategory and difficulty level
 *
 * This file has been refactored to use helper modules for better organization.
 * Estimated time is now centralized in config.js based on difficulty levels.
 */

const { generateAddition } = require("./basicArithmeticHelpers/addition");
const { generateSubtraction } = require("./basicArithmeticHelpers/subtraction");
const {
  generateMultiplication,
} = require("./basicArithmeticHelpers/multiplication");
const { generateDivision } = require("./basicArithmeticHelpers/division");
const {
  generateFractionAddition,
} = require("./basicArithmeticHelpers/fractionAddition");
const {
  generateFractionSubtraction,
} = require("./basicArithmeticHelpers/fractionSubtraction");
const CONFIG = require("./config");

/**
 * Get estimated time for a concept and difficulty level
 * @param {string} conceptKey - The concept key (addition, subtraction, etc.)
 * @param {number} difficulty - Difficulty level from 1-5
 * @returns {number} Estimated time in seconds
 */
function getEstimatedTime(conceptKey, difficulty) {
  return CONFIG.AVAILABLE_CONCEPTS[conceptKey].estimatedTimeSeconds[difficulty];
}

/**
 * Main function to generate problems with estimated time
 * @param {string} subcategory - The type of problem (addition, subtraction, multiplication, division, fractionaddition, fractionsubtraction)
 * @param {number} difficulty - Difficulty level from 1-5
 * @returns {object} Object containing question, answer, and estimatedTimeSeconds
 */
function generateProblem(subcategory, difficulty) {
  // Validate inputs
  if (difficulty < 1 || difficulty > 5) {
    throw new Error("Difficulty must be between 1 and 5");
  }

  let result;
  let conceptKey;

  switch (subcategory.toLowerCase()) {
    case "addition":
      result = generateAddition(difficulty);
      conceptKey = "addition";
      break;
    case "subtraction":
      result = generateSubtraction(difficulty);
      conceptKey = "subtraction";
      break;
    case "multiplication":
      result = generateMultiplication(difficulty);
      conceptKey = "multiplication";
      break;
    case "division":
      result = generateDivision(difficulty);
      conceptKey = "division";
      break;
    case "fractionaddition":
      result = generateFractionAddition(difficulty);
      conceptKey = "fraction";
      break;
    case "fractionsubtraction":
      result = generateFractionSubtraction(difficulty);
      conceptKey = "fraction";
      break;
    default:
      throw new Error(`Unknown subcategory: ${subcategory}`);
  }

  // Add centralized estimated time
  return {
    question: result.question,
    answer: result.answer,
    estimatedTimeSeconds: getEstimatedTime(conceptKey, difficulty),
  };
}

// Export functions for use by other scripts
module.exports = {
  generateProblem,
};
