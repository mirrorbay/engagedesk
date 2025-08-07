/**
 * Progressive Time Management
 * Handles time allocation and adjustment based on student performance
 */

const CONFIG = require("./config");
const { calculatePageTime } = require("./utils");

/**
 * Get grade-specific time adjustment ratio
 * @param {string} gradeLevel - Student's grade level (e.g., "3rd Grade")
 * @returns {number} Time adjustment ratio for the grade
 */
function getGradeTimeAdjustmentRatio(gradeLevel) {
  if (!gradeLevel) {
    throw new Error("Grade level is required for time management");
  }

  const ratio = CONFIG.GRADE_TIME_ADJUSTMENT_RATIOS[gradeLevel];
  if (ratio === undefined) {
    throw new Error(`Unsupported grade level: ${gradeLevel}`);
  }

  return ratio;
}

/**
 * Apply grade-specific time adjustment to estimated time
 * @param {number} baseTimeSeconds - Base estimated time in seconds
 * @param {string} gradeLevel - Student's grade level
 * @returns {number} Adjusted time in seconds
 */
function applyGradeTimeAdjustment(baseTimeSeconds, gradeLevel) {
  const ratio = getGradeTimeAdjustmentRatio(gradeLevel);
  return Math.round(baseTimeSeconds * ratio);
}

/**
 * Calculate time adjustment multiplier based on actual time performance and grade level
 * @param {Object} previousPage - The previous page object with presented_at, submitted_at, and problems
 * @param {string} gradeLevel - Student's grade level
 * @returns {number} Time adjustment multiplier
 */
function calculateTimeAdjustmentMultiplier(previousPage, gradeLevel) {
  if (
    !previousPage ||
    !previousPage.problems ||
    previousPage.problems.length === 0
  ) {
    return 1.0; // Default multiplier
  }

  if (!gradeLevel) {
    throw new Error("Grade level is required for time adjustment");
  }

  // Calculate actual time spent on the page (presented_at to submitted_at)
  const actualTimeSeconds = calculatePageTime(previousPage);

  // Calculate total estimated time for answered problems (bottom-up)
  let totalEstimatedTimeForAnswered = 0;
  previousPage.problems.forEach((problem) => {
    if (problem.input_answer && problem.input_answer.length > 0) {
      totalEstimatedTimeForAnswered += problem.estimatedTimeSeconds || 0;
    }
  });

  if (totalEstimatedTimeForAnswered === 0 || actualTimeSeconds === 0) {
    return 1.0; // Default if no estimated time or no actual time
  }

  // Calculate time ratio: actual time / estimated time
  const timeRatio = actualTimeSeconds / totalEstimatedTimeForAnswered;

  // Use unified time rules for all grades
  const timeRules = CONFIG.TIME_RULES;

  for (const rule of timeRules) {
    if (timeRatio < rule.threshold) {
      return rule.multiplier;
    }
  }

  // This should never happen if rules are properly configured with Infinity threshold
  throw new Error("No matching time rule found - rules configuration error");
}

/**
 * Calculate target time for a page based on session parameters and performance
 * @param {number} totalStudyTimeSeconds - Total study time for the session
 * @param {number} totalPages - Total number of pages in the session
 * @param {number} pageNumber - Current page number
 * @param {string} gradeLevel - Student's grade level
 * @param {Object} previousPage - Previous page object (null for page 1)
 * @returns {number} Target time in seconds for the page
 */
function calculatePageTargetTime(
  totalStudyTimeSeconds,
  totalPages,
  pageNumber,
  gradeLevel,
  previousPage = null
) {
  // Base time per page (equal distribution)
  const baseTimePerPage = totalStudyTimeSeconds / totalPages;

  // For page 1, use base time
  if (pageNumber === 1 || !previousPage) {
    const result = Math.floor(
      baseTimePerPage * CONFIG.PROBLEM_GENERATION.TARGET_TIME_BUFFER
    );
    return result;
  }

  if (!gradeLevel) {
    throw new Error("Grade level is required for time calculation");
  }

  // For subsequent pages, adjust based on previous time performance
  const timeMultiplier = calculateTimeAdjustmentMultiplier(
    previousPage,
    gradeLevel
  );

  // Calculate actual time spent and estimated time for debug logging
  const actualTimeSeconds = calculatePageTime(previousPage);
  let totalEstimatedTimeForAnswered = 0;
  previousPage.problems.forEach((problem) => {
    if (problem.input_answer && problem.input_answer.length > 0) {
      totalEstimatedTimeForAnswered += problem.estimatedTimeSeconds || 0;
    }
  });

  // Log time adjustment (only once per page)
  if (totalEstimatedTimeForAnswered > 0 && actualTimeSeconds > 0) {
    const timeRatio = actualTimeSeconds / totalEstimatedTimeForAnswered;
    const gradeRatio = getGradeTimeAdjustmentRatio(gradeLevel);
    console.log(
      `\x1b[36m[debug]\x1b[0m Time adjustment: grade \x1b[35m${gradeLevel}\x1b[0m (ratio ${gradeRatio}x) spent \x1b[33m${(
        timeRatio * 100
      ).toFixed(
        0
      )}%\x1b[0m of estimated (${actualTimeSeconds}s/${totalEstimatedTimeForAnswered}s) -> multiplier \x1b[35m${timeMultiplier}x\x1b[0m`
    );
  }

  const adjustedTime = baseTimePerPage * timeMultiplier;
  console.log(
    `\x1b[36m[debug]\x1b[0m Page target adjustment: ${Math.floor(
      baseTimePerPage * CONFIG.PROBLEM_GENERATION.TARGET_TIME_BUFFER
    )}s -> ${Math.floor(
      adjustedTime * CONFIG.PROBLEM_GENERATION.TARGET_TIME_BUFFER
    )}s (${timeMultiplier}x)`
  );

  // Apply buffer to leave some margin
  const result = Math.floor(
    adjustedTime * CONFIG.PROBLEM_GENERATION.TARGET_TIME_BUFFER
  );
  return result;
}

/**
 * Calculate actual time spent on a page
 * @param {Array} pageProblems - Array of problems from a page
 * @returns {Object} Time metrics including total time, average per problem, etc.
 */
function calculateActualPageTime(pageProblems) {
  if (!pageProblems || pageProblems.length === 0) {
    return {
      totalTimeSeconds: 0,
      averageTimePerProblem: 0,
      answeredProblems: 0,
    };
  }

  let totalTimeSeconds = 0;
  let answeredProblems = 0;

  // Calculate time based on first and last interaction timestamps
  const firstProblem = pageProblems[0];
  const lastAnsweredProblem = pageProblems
    .filter((p) => p.input_answer && p.input_answer.length > 0)
    .sort((a, b) => {
      const aTime = a.input_answer[a.input_answer.length - 1].timestamp;
      const bTime = b.input_answer[b.input_answer.length - 1].timestamp;
      return new Date(bTime) - new Date(aTime);
    })[0];

  if (
    firstProblem.presented_at &&
    lastAnsweredProblem &&
    lastAnsweredProblem.input_answer.length > 0
  ) {
    const startTime = new Date(firstProblem.presented_at);
    const endTime = new Date(
      lastAnsweredProblem.input_answer[
        lastAnsweredProblem.input_answer.length - 1
      ].timestamp
    );
    totalTimeSeconds = Math.max(0, (endTime - startTime) / 1000);
  }

  // Count answered problems
  answeredProblems = pageProblems.filter(
    (p) => p.input_answer && p.input_answer.length > 0
  ).length;

  const averageTimePerProblem =
    answeredProblems > 0 ? totalTimeSeconds / answeredProblems : 0;

  return {
    totalTimeSeconds,
    averageTimePerProblem,
    answeredProblems,
  };
}

/**
 * Determine if student is significantly over or under target time
 * @param {number} actualTime - Actual time spent
 * @param {number} targetTime - Target time for the page
 * @returns {Object} Time performance analysis
 */
function analyzeTimePerformance(actualTime, targetTime) {
  const ratio = targetTime > 0 ? actualTime / targetTime : 1;

  return {
    ratio,
    isOverTime: ratio > 1.2, // More than 20% over target
    isUnderTime: ratio < 0.8, // More than 20% under target
    isOnTarget: ratio >= 0.8 && ratio <= 1.2,
    percentageOfTarget: Math.round(ratio * 100),
  };
}

module.exports = {
  getGradeTimeAdjustmentRatio,
  applyGradeTimeAdjustment,
  calculateTimeAdjustmentMultiplier,
  calculatePageTargetTime,
  calculateActualPageTime,
  analyzeTimePerformance,
};
