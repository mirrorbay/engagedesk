/**
 * Celebration Manager
 * Handles celebration logic and data generation based on student performance
 */

const CELEBRATION_CONFIG = require('./celebrationManagerHelpers/config');

/**
 * Find celebration level based on score percentage
 * @param {number} scorePercentage - The student's score percentage (0-100)
 * @returns {number|null} - Celebration level index or null if not found
 */
const findCelebrationLevel = (scorePercentage) => {
    for (let i = 0; i < CELEBRATION_CONFIG.LEVELS.length; i++) {
        const level = CELEBRATION_CONFIG.LEVELS[i];
        if (scorePercentage >= level.minScore && scorePercentage <= level.maxScore) {
            return i;
        }
    }
    return null; // Should not happen if levels cover 0-100%
};

/**
 * Get celebration data for a given score percentage
 * @param {number} scorePercentage - The student's score percentage (0-100)
 * @returns {Object|null} - Celebration data object or null if not found
 */
const getCelebrationData = (scorePercentage) => {
    const levelIndex = findCelebrationLevel(scorePercentage);
    
    if (levelIndex === null) {
        return null;
    }

    const levelConfig = CELEBRATION_CONFIG.LEVELS[levelIndex];
    
    return {
        level: levelIndex,
        message: levelConfig.message,
        subMessage: levelConfig.subMessage,
        intensity: levelConfig.intensity,
        scoreRange: {
            min: levelConfig.minScore,
            max: levelConfig.maxScore
        }
    };
};

/**
 * Get celebration statistics for analysis
 * @param {number} scorePercentage - The student's score percentage (0-100)
 * @returns {Object} - Celebration statistics
 */
const getCelebrationStats = (scorePercentage) => {
    const celebrationData = getCelebrationData(scorePercentage);
    
    // Find next celebration level
    let nextCelebrationAt = null;
    if (celebrationData && celebrationData.level < CELEBRATION_CONFIG.LEVELS.length - 1) {
        nextCelebrationAt = CELEBRATION_CONFIG.LEVELS[celebrationData.level + 1].minScore;
    }
    
    return {
        hasCelebration: celebrationData !== null,
        level: celebrationData ? celebrationData.level : null,
        scorePercentage,
        nextCelebrationAt
    };
};

module.exports = {
    findCelebrationLevel,
    getCelebrationData,
    getCelebrationStats
};
