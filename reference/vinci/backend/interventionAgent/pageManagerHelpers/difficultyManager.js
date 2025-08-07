/**
 * Progressive Difficulty Management
 * Handles difficulty selection based on student performance on previous pages
 */

const CONFIG = require("./config");

/**
 * Calculate performance metrics for a page
 * @param {Array} pageProblems - Array of problems from a completed page
 * @returns {Object} Performance metrics including accuracy, total answered, etc.
 */
function calculatePagePerformance(pageProblems) {
  let correctAnswers = 0;
  let totalAnswered = 0;
  let totalProblems = pageProblems.length;

  pageProblems.forEach((problem, index) => {
    if (problem.input_answer && problem.input_answer.length > 0) {
      totalAnswered++;
      if (problem.score > 0) {
        correctAnswers++;
      }
    }
  });

  const accuracy = totalProblems > 0 ? correctAnswers / totalProblems : 0;
  const completionRate = totalProblems > 0 ? totalAnswered / totalProblems : 0;

  return {
    accuracy,
    correctAnswers,
    totalAnswered,
    totalProblems,
    completionRate,
  };
}

/**
 * Get difficulty configuration based on performance using streamlined rule matching
 * @param {Array} rules - Array of difficulty rules ordered from lowest to highest performance
 * @param {number} accuracy - Performance accuracy (0-1)
 * @returns {Object} Difficulty configuration with levels and distribution
 */
function getDifficultyFromRules(rules, accuracy) {
  for (const rule of rules) {
    if (accuracy < rule.threshold) {
      return {
        name: rule.name,
        levels: rule.levels,
        distribution: rule.distribution,
      };
    }
  }
  // This should never happen if rules are properly configured with Infinity threshold
  throw new Error(
    "No matching difficulty rule found - rules configuration error"
  );
}

/**
 * Determine difficulty configuration for page 2 based on page 1 performance and grade level
 * @param {Object} page1Performance - Performance metrics from page 1
 * @param {string} gradeLevel - Student's grade level
 * @returns {Object} Difficulty configuration with levels and distribution
 */
function getDifficultyForPage2(page1Performance, gradeLevel) {
  const { accuracy } = page1Performance;
  const rules = CONFIG.DIFFICULTY_RULES[gradeLevel].PAGE_2;
  return getDifficultyFromRules(rules, accuracy);
}

/**
 * Determine difficulty configuration for page 3 based on page 2 performance and grade level
 * @param {Object} page2Performance - Performance metrics from page 2
 * @param {string} gradeLevel - Student's grade level
 * @returns {Object} Difficulty configuration with levels and distribution
 */
function getDifficultyForPage3(page2Performance, gradeLevel) {
  const { accuracy } = page2Performance;
  const rules = CONFIG.DIFFICULTY_RULES[gradeLevel].PAGE_3;
  return getDifficultyFromRules(rules, accuracy);
}

/**
 * Get difficulty configuration for any page based on previous page performance and grade level
 * @param {number} pageNumber - The page number to get difficulty for
 * @param {string} gradeLevel - Student's grade level
 * @param {Object} previousPagePerformance - Performance metrics from previous page (null for page 1)
 * @returns {Object} Difficulty configuration with levels and distribution
 */
function getDifficultyForPage(
  pageNumber,
  gradeLevel,
  previousPagePerformance = null
) {
  if (!gradeLevel) {
    throw new Error("Grade level is required for difficulty management");
  }

  // Validate that the grade level exists in our difficulty rules
  if (!CONFIG.DIFFICULTY_RULES[gradeLevel]) {
    throw new Error(`Unsupported grade level: ${gradeLevel}`);
  }

  let result;

  switch (pageNumber) {
    case 1:
      // Page 1 uses grade-appropriate fixed difficulty
      result = {
        levels: CONFIG.DIFFICULTY_RULES[gradeLevel].PAGE_1.levels,
        distribution: CONFIG.DIFFICULTY_RULES[gradeLevel].PAGE_1.distribution,
      };
      console.log(
        `\x1b[36m[debug]\x1b[0m Page ${pageNumber} difficulty: grade \x1b[35m${gradeLevel}\x1b[0m -> levels \x1b[32m[${result.levels.join(
          ","
        )}]\x1b[0m distribution \x1b[32m[${result.distribution
          .map((d) => (d * 100).toFixed(0) + "%")
          .join(",")}]\x1b[0m`
      );
      break;

    case 2:
      if (!previousPagePerformance) {
        throw new Error("Previous page performance required for page 2");
      }
      result = getDifficultyForPage2(previousPagePerformance, gradeLevel);
      console.log(
        `\x1b[36m[debug]\x1b[0m Page ${pageNumber} difficulty: grade \x1b[35m${gradeLevel}\x1b[0m accuracy \x1b[33m${(
          previousPagePerformance.accuracy * 100
        ).toFixed(1)}%\x1b[0m (${
          result.name
        }) -> levels \x1b[32m[${result.levels.join(
          ","
        )}]\x1b[0m distribution \x1b[32m[${result.distribution
          .map((d) => (d * 100).toFixed(0) + "%")
          .join(",")}]\x1b[0m`
      );
      break;

    case 3:
      if (!previousPagePerformance) {
        throw new Error("Previous page performance required for page 3");
      }
      result = getDifficultyForPage3(previousPagePerformance, gradeLevel);
      console.log(
        `\x1b[36m[debug]\x1b[0m Page ${pageNumber} difficulty: grade \x1b[35m${gradeLevel}\x1b[0m accuracy \x1b[33m${(
          previousPagePerformance.accuracy * 100
        ).toFixed(1)}%\x1b[0m (${
          result.name
        }) -> levels \x1b[32m[${result.levels.join(
          ","
        )}]\x1b[0m distribution \x1b[32m[${result.distribution
          .map((d) => (d * 100).toFixed(0) + "%")
          .join(",")}]\x1b[0m`
      );
      break;

    default:
      throw new Error(`Unsupported page number: ${pageNumber}`);
  }
  return result;
}

/**
 * Select a difficulty level based on distribution probabilities
 * @param {Array} levels - Available difficulty levels
 * @param {Array} distribution - Probability distribution for each level
 * @returns {number} Selected difficulty level
 */
function selectDifficultyLevel(levels, distribution) {
  const rand = Math.random();
  let cumulative = 0;

  for (let i = 0; i < levels.length; i++) {
    cumulative += distribution[i];
    if (rand <= cumulative) {
      return levels[i];
    }
  }

  // Fallback to last level if something goes wrong
  return levels[levels.length - 1];
}

module.exports = {
  calculatePagePerformance,
  getDifficultyForPage2,
  getDifficultyForPage3,
  getDifficultyForPage,
  selectDifficultyLevel,
};
