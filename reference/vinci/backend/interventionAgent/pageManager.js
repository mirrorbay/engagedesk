/**
 * Pagination Controller
 * Handles ALL logic about pagination and problem selection/generation
 * This controller manages progressive pagination based on student performance
 */

const { generateProblemForConcept } = require("../problems/index");
const CONFIG = require("./pageManagerHelpers/config");
const {
  calculatePagePerformance,
  getDifficultyForPage,
  selectDifficultyLevel,
} = require("./pageManagerHelpers/difficultyManager");
const {
  calculatePageTargetTime,
  applyGradeTimeAdjustment,
} = require("./pageManagerHelpers/timeManager");

/**
 * Generate problems for a page based on concepts, difficulty, and time constraints
 * @param {Array} selectedConcepts - Array of concept IDs to generate problems for
 * @param {Object} difficultyConfig - Configuration with levels and distribution
 * @param {number} targetTimeSeconds - Target time for the page
 * @param {string} gradeLevel - Student's grade level for time adjustments
 * @returns {Array} Array of generated problems
 */
function generateProblemsForPage(
  selectedConcepts,
  difficultyConfig,
  targetTimeSeconds,
  gradeLevel
) {
  console.log(
    `[debug] Problem generation start: target=${targetTimeSeconds}s, concepts=${selectedConcepts.join(
      ","
    )}`
  );
  const problems = [];
  const generatedQuestions = new Set(); // Track generated questions to prevent duplicates
  let totalTime = 0;
  let attempts = 0;

  // Separate basic and mixed concepts
  const basicConcepts = selectedConcepts.filter(
    (concept) => concept !== "mixedArithmetic"
  );
  const hasMixed = selectedConcepts.includes("mixedArithmetic");

  // Calculate time allocation per concept
  const timePerConcept = targetTimeSeconds / selectedConcepts.length;

  // Generate basic arithmetic problems first
  for (const concept of basicConcepts) {
    let conceptTime = 0;
    const conceptTimeLimit = timePerConcept;
    let conceptAttempts = 0;
    const maxConceptAttempts =
      CONFIG.PROBLEM_GENERATION.MAX_GENERATION_ATTEMPTS;

    while (
      conceptTime < conceptTimeLimit &&
      totalTime < targetTimeSeconds &&
      conceptAttempts < maxConceptAttempts
    ) {
      attempts++;
      conceptAttempts++;

      // Select difficulty based on distribution
      const selectedDifficulty = selectDifficultyLevel(
        difficultyConfig.levels,
        difficultyConfig.distribution
      );

      const problem = generateProblemForConcept(concept, selectedDifficulty);

      // Check for duplicate questions
      if (generatedQuestions.has(problem.question)) {
        console.log(
          `[debug] Duplicate question detected for ${concept}: "${problem.question}"`
        );
        continue; // Skip this problem and try generating another
      }

      // Apply grade-specific time adjustment to estimated time
      const adjustedEstimatedTime = applyGradeTimeAdjustment(
        problem.estimatedTimeSeconds,
        gradeLevel
      );
      const estimatedTime = adjustedEstimatedTime;

      if (totalTime + estimatedTime <= targetTimeSeconds) {
        problems.push({
          question: problem.question,
          answer: problem.answer,
          subcategory: concept,
          difficulty: selectedDifficulty,
          estimatedTimeSeconds: estimatedTime,
        });

        // Track this question to prevent future duplicates
        generatedQuestions.add(problem.question);

        conceptTime += estimatedTime;
        totalTime += estimatedTime;
      } else {
        break;
      }
    }
  }

  // Generate mixed arithmetic problems
  if (hasMixed) {
    let mixedTime = 0;
    const mixedTimeLimit = timePerConcept;
    let mixedAttempts = 0;
    const maxMixedAttempts = CONFIG.PROBLEM_GENERATION.MAX_GENERATION_ATTEMPTS;

    while (
      mixedTime < mixedTimeLimit &&
      totalTime < targetTimeSeconds &&
      mixedAttempts < maxMixedAttempts
    ) {
      attempts++;
      mixedAttempts++;

      // Select difficulty based on distribution
      const selectedDifficulty = selectDifficultyLevel(
        difficultyConfig.levels,
        difficultyConfig.distribution
      );

      const problem = generateProblemForConcept(
        "mixedArithmetic",
        selectedDifficulty
      );

      // Check for duplicate questions
      if (generatedQuestions.has(problem.question)) {
        console.log(
          `[debug] Duplicate question detected for mixedArithmetic: "${problem.question}"`
        );
        continue; // Skip this problem and try generating another
      }

      // Apply grade-specific time adjustment to estimated time
      const adjustedEstimatedTime = applyGradeTimeAdjustment(
        problem.estimatedTimeSeconds,
        gradeLevel
      );
      const estimatedTime = adjustedEstimatedTime;

      if (totalTime + estimatedTime <= targetTimeSeconds) {
        problems.push({
          question: problem.question,
          answer: problem.answer,
          subcategory: "mixedArithmetic",
          difficulty: selectedDifficulty,
          estimatedTimeSeconds: estimatedTime,
        });

        // Track this question to prevent future duplicates
        generatedQuestions.add(problem.question);

        mixedTime += estimatedTime;
        totalTime += estimatedTime;
      } else {
        break;
      }
    }
  }

  console.log(
    `[debug] Problem generation end: generated=${problems.length} [${problems
      .map((p) => p.estimatedTimeSeconds)
      .join(
        ","
      )}s], totalTime=${totalTime}s, attempts=${attempts}, unique questions=${
      generatedQuestions.size
    }`
  );
  // Ensure minimum number of problems
  if (problems.length < CONFIG.PROBLEM_GENERATION.MIN_PROBLEMS_PER_PAGE) {
    throw new Error(
      `Unable to generate minimum ${CONFIG.PROBLEM_GENERATION.MIN_PROBLEMS_PER_PAGE} problems within time constraints`
    );
  }

  return problems;
}

/**
 * Create the first page of problems for a new session
 * @param {Array} selectedConcepts - Array of concept IDs
 * @param {number} totalStudyTimeSeconds - Total study time for session
 * @param {number} totalPages - Total number of pages in session
 * @param {string} gradeLevel - Student's grade level
 * @returns {Array} Array of problems for page 1
 */
function createFirstPage(
  selectedConcepts,
  totalStudyTimeSeconds,
  totalPages,
  gradeLevel
) {
  if (!gradeLevel) {
    throw new Error("Grade level is required for page creation");
  }

  // Page 1 uses grade-appropriate difficulty configuration
  const difficultyConfig = getDifficultyForPage(1, gradeLevel);

  // Calculate target time for page 1
  const targetTime = calculatePageTargetTime(
    totalStudyTimeSeconds,
    totalPages,
    1,
    gradeLevel
  );
  console.log(
    `[debug] Session allocation: total=${totalStudyTimeSeconds}s, pages=${totalPages}, base=${Math.floor(
      totalStudyTimeSeconds / totalPages
    )}s/page, page1=${targetTime}s`
  );

  // Generate problems
  const problems = generateProblemsForPage(
    selectedConcepts,
    difficultyConfig,
    targetTime,
    gradeLevel
  );

  return problems.map((problem, index) => ({
    sequence_number: index + 1,
    question: problem.question,
    answer: problem.answer,
    subcategory: problem.subcategory,
    difficulty: problem.difficulty,
    estimatedTimeSeconds: problem.estimatedTimeSeconds,
    input_answer: [],
    score: 0,
  }));
}

/**
 * Create a new page based on previous page performance
 * @param {Object} session - The VinciSession document
 * @param {number} pageNumber - The page number to create
 * @param {string} gradeLevel - Student's grade level
 * @returns {Array} Array of problems for the new page
 */
function createNextPage(session, pageNumber, gradeLevel) {
  if (!gradeLevel) {
    throw new Error("Grade level is required for page creation");
  }

  // Get previous page for performance analysis
  const previousPageNumber = pageNumber - 1;
  const previousPage = session.pages.find(
    (p) => p.page_number === previousPageNumber
  );

  if (!previousPage || !previousPage.submitted_at) {
    throw new Error(
      `Previous page ${previousPageNumber} must be submitted before creating page ${pageNumber}`
    );
  }

  // Calculate performance on previous page
  const previousPagePerformance = calculatePagePerformance(
    previousPage.problems
  );

  // Get difficulty configuration based on previous performance and grade level
  const difficultyConfig = getDifficultyForPage(
    pageNumber,
    gradeLevel,
    previousPagePerformance
  );

  // Calculate target time for this page (includes time adjustment based on previous performance)
  const targetTime = calculatePageTargetTime(
    session.target_study_time_seconds,
    session.planned_total_pages,
    pageNumber,
    gradeLevel,
    previousPage
  );

  // Generate problems
  const problems = generateProblemsForPage(
    session.target_concepts,
    difficultyConfig,
    targetTime,
    gradeLevel
  );

  return problems.map((problem, index) => ({
    sequence_number: index + 1,
    question: problem.question,
    answer: problem.answer,
    subcategory: problem.subcategory,
    difficulty: problem.difficulty,
    estimatedTimeSeconds: problem.estimatedTimeSeconds,
    input_answer: [],
    score: 0,
  }));
}

/**
 * Get or create a page for a session
 * @param {Object} session - The VinciSession document
 * @param {number} pageNumber - The page number to get/create
 * @param {string} gradeLevel - Student's grade level
 * @returns {Object} The page object with problems
 */
function getOrCreatePage(session, pageNumber, gradeLevel) {
  // Check if page already exists
  let page = session.pages.find((p) => p.page_number === pageNumber);

  if (page) {
    return page;
  }

  if (!gradeLevel) {
    throw new Error("Grade level is required for page creation");
  }

  // Create new page
  let problems;
  if (pageNumber === 1) {
    problems = createFirstPage(
      session.target_concepts,
      session.target_study_time_seconds,
      session.planned_total_pages,
      gradeLevel
    );
  } else {
    problems = createNextPage(session, pageNumber, gradeLevel);
  }

  // Create page object
  page = {
    page_number: pageNumber,
    presented_at: new Date(),
    problems: problems,
  };

  // Add page to session
  session.pages.push(page);

  return page;
}

/**
 * Calculate target time for a specific page
 * @param {Object} session - The VinciSession document
 * @param {number} pageNumber - The page number
 * @returns {number} Target time in seconds for the page
 */
function getPageTargetTime(session, pageNumber) {
  const page = session.pages.find((p) => p.page_number === pageNumber);

  if (!page) {
    throw new Error(`Page ${pageNumber} not found`);
  }

  // Sum up estimated times for all problems on the page
  return page.problems.reduce(
    (total, problem) => total + (problem.estimatedTimeSeconds || 0),
    0
  );
}

/**
 * Check if a page can be accessed (previous pages must be submitted)
 * @param {Object} session - The VinciSession document
 * @param {number} pageNumber - The page number to check
 * @returns {boolean} Whether the page can be accessed
 */
function canAccessPage(session, pageNumber) {
  if (pageNumber === 1) {
    return true;
  }

  // Check if all previous pages are submitted
  for (let i = 1; i < pageNumber; i++) {
    const page = session.pages.find((p) => p.page_number === i);
    if (!page || !page.submitted_at) {
      return false;
    }
  }

  return true;
}

/**
 * Submit a page (mark it as completed and lock it)
 * @param {Object} session - The VinciSession document
 * @param {number} pageNumber - The page number to submit
 * @returns {Object} Submission result with performance metrics
 */
function submitPage(session, pageNumber) {
  const page = session.pages.find((p) => p.page_number === pageNumber);

  if (!page) {
    throw new Error(`Page ${pageNumber} not found`);
  }

  if (page.submitted_at) {
    throw new Error(`Page ${pageNumber} has already been submitted`);
  }

  // Mark page as submitted
  page.submitted_at = new Date();

  // Calculate performance metrics
  const performance = calculatePagePerformance(page.problems);

  return {
    pageNumber,
    submittedAt: page.submitted_at,
    performance,
  };
}

module.exports = {
  generateProblemsForPage,
  createFirstPage,
  createNextPage,
  getOrCreatePage,
  getPageTargetTime,
  canAccessPage,
  submitPage,
};
