/**
 * Concept Service
 * Single source of truth for all concept operations
 */

const CONFIG = require("./config");

/**
 * Get concepts with optional grade filtering
 * @param {string} gradeLevel - Optional grade level for filtering
 * @returns {Array} Array of concepts
 */
function getConcepts(gradeLevel = null) {
  const allConcepts = Object.entries(CONFIG.AVAILABLE_CONCEPTS).map(
    ([conceptId, concept]) => ({
      id: conceptId,
      displayName: concept.displayName,
      category: concept.category,
      subcategories: concept.subcategories,
      gradeAppropriate: concept.gradeAppropriate,
    })
  );

  if (!gradeLevel) {
    return allConcepts;
  }

  return allConcepts.filter((concept) =>
    concept.gradeAppropriate.includes(gradeLevel)
  );
}

/**
 * Get concept display name by ID
 * @param {string} conceptId - The concept ID
 * @returns {string} Display name or the concept ID if not found
 */
function getConceptDisplayName(conceptId) {
  const concept = CONFIG.AVAILABLE_CONCEPTS[conceptId];
  return concept ? concept.displayName : conceptId;
}

/**
 * Check if a concept is appropriate for a specific grade level
 * @param {string} conceptId - The concept ID to check
 * @param {string} gradeLevel - Student's grade level
 * @returns {boolean} True if concept is appropriate for the grade
 */
function isConceptAppropriateForGrade(conceptId, gradeLevel) {
  if (!gradeLevel) {
    return true;
  }

  const concept = CONFIG.AVAILABLE_CONCEPTS[conceptId];
  if (!concept) {
    return false;
  }

  return concept.gradeAppropriate.includes(gradeLevel);
}

module.exports = {
  getConcepts,
  getConceptDisplayName,
  isConceptAppropriateForGrade,
};
