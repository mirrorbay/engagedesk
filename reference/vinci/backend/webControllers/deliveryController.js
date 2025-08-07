/**
 * Delivery Controller - Enhanced with strict validation and immediate error throwing
 * Handles session management and coordinates with pageManager for problem delivery
 * NO FALLBACKS - throws errors immediately when logic issues are detected
 */

const VinciSession = require("../models/VinciSession");
const conceptService = require("../problems/conceptService");
const CONFIG = require("./deliveryControllerHelpers/config");
const pageManager = require("../interventionAgent/pageManager");
const celebrationManager = require("../economyAgent/celebrationManager");
const { calculateScore } = require("../utils/fractionUtils");
const { v4: uuidv4 } = require("uuid");

/**
 * Strict validation helper - throws immediately on any validation failure
 */
function validateRequired(data, requiredFields, operationName) {
  if (!data || typeof data !== "object") {
    throw new Error(`${operationName}: Request data must be an object`);
  }

  const missing = requiredFields.filter((field) => {
    const value = data[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length > 0) {
    throw new Error(
      `${operationName}: Missing required fields: ${missing.join(", ")}`
    );
  }
}

/**
 * Strict type validation helper
 */
function validateTypes(data, typeChecks, operationName) {
  for (const [field, expectedType, additionalCheck] of typeChecks) {
    const value = data[field];

    if (typeof value !== expectedType) {
      throw new Error(
        `${operationName}: Field '${field}' must be of type ${expectedType}, got ${typeof value}`
      );
    }

    if (additionalCheck && !additionalCheck(value)) {
      throw new Error(
        `${operationName}: Field '${field}' failed validation check`
      );
    }
  }
}

/**
 * Get concepts with optional grade filtering
 */
const getConcepts = async (req, res) => {
  try {
    const gradeLevel = req.query.gradeLevel;
    const concepts = conceptService.getConcepts(gradeLevel);

    if (!concepts || !Array.isArray(concepts)) {
      throw new Error("Concept service returned invalid data structure");
    }

    res.json(concepts);
  } catch (error) {
    console.error("Error fetching concepts:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch concepts" });
  }
};

/**
 * Get past sessions for the authenticated user
 */
const getStudentSessions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.json([]);
    }

    const sessions = await VinciSession.aggregate([
      {
        $match: { user_id: userId },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 50,
      },
      {
        $project: {
          session_id: 1,
          createdAt: 1,
          updatedAt: 1,
          target_study_time_seconds: 1,
          target_concepts: 1,
          planned_total_pages: 1,
          submittedPagesCount: {
            $size: {
              $filter: {
                input: { $ifNull: ["$pages", []] },
                cond: { $ne: ["$$this.submitted_at", null] },
              },
            },
          },
          totalProblems: {
            $sum: {
              $map: {
                input: { $ifNull: ["$pages", []] },
                as: "page",
                in: { $size: { $ifNull: ["$$page.problems", []] } },
              },
            },
          },
          totalScore: {
            $sum: {
              $map: {
                input: { $ifNull: ["$pages", []] },
                as: "page",
                in: {
                  $sum: {
                    $map: {
                      input: { $ifNull: ["$$page.problems", []] },
                      as: "problem",
                      in: { $ifNull: ["$$problem.score", 0] },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          is_completed: {
            $eq: ["$submittedPagesCount", "$planned_total_pages"],
          },
          maxScore: { $multiply: ["$totalProblems", 10] },
          scorePercentage: {
            $cond: {
              if: { $gt: ["$totalProblems", 0] },
              then: {
                $round: {
                  $multiply: [
                    {
                      $divide: [
                        "$totalScore",
                        { $multiply: ["$totalProblems", 10] },
                      ],
                    },
                    100,
                  ],
                },
              },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          session_id: 1,
          session_start: "$createdAt",
          session_end: {
            $cond: {
              if: "$is_completed",
              then: "$updatedAt",
              else: null,
            },
          },
          target_study_time_seconds: 1,
          is_completed: 1,
          target_concepts: { $ifNull: ["$target_concepts", []] },
          scorePercentage: 1,
          totalProblems: 1,
        },
      },
    ]);

    if (!Array.isArray(sessions)) {
      throw new Error("Database query returned invalid session data structure");
    }

    res.json(sessions);
  } catch (error) {
    console.error("Error fetching student sessions:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch sessions" });
  }
};

/**
 * Create a new study session with strict validation
 */
const createSession = async (req, res) => {
  try {
    const { conceptIds, studyTimeMinutes, gradeLevel, semester } = req.body;

    // Strict validation - no fallbacks
    validateRequired(
      req.body,
      ["conceptIds", "studyTimeMinutes", "gradeLevel"],
      "Create Session"
    );

    validateTypes(
      req.body,
      [
        ["studyTimeMinutes", "number", (val) => val > 0],
        ["gradeLevel", "string", (val) => val.trim().length > 0],
      ],
      "Create Session"
    );

    if (!Array.isArray(conceptIds)) {
      throw new Error("Create Session: conceptIds must be an array");
    }

    if (conceptIds.length === 0) {
      throw new Error("Create Session: Must select at least one concept");
    }

    if (
      studyTimeMinutes < CONFIG.MIN_STUDY_TIME ||
      studyTimeMinutes > CONFIG.MAX_STUDY_TIME
    ) {
      throw new Error(
        `Create Session: Study time must be between ${CONFIG.MIN_STUDY_TIME}-${CONFIG.MAX_STUDY_TIME} minutes`
      );
    }

    // Get user ID from optional auth - can be null for non-authenticated users
    const userId = req.user?.id || null;
    const sessionGradeLevel = gradeLevel.trim();

    // Validate that all selected concepts are appropriate for the grade level
    const inappropriateConcepts = conceptIds.filter(
      (conceptId) =>
        !conceptService.isConceptAppropriateForGrade(
          conceptId,
          sessionGradeLevel
        )
    );

    if (inappropriateConcepts.length > 0) {
      throw new Error(
        `Create Session: The following concepts are not appropriate for ${sessionGradeLevel}: ${inappropriateConcepts.join(
          ", "
        )}`
      );
    }

    const studyTimeSeconds = studyTimeMinutes * 60;
    const sessionId = uuidv4();

    // Determine number of pages based on study time
    const totalPages =
      studyTimeMinutes <= CONFIG.PAGE_CONFIG.SHORT_SESSION_THRESHOLD
        ? CONFIG.PAGE_CONFIG.SHORT_SESSION_PAGES
        : CONFIG.PAGE_CONFIG.LONG_SESSION_PAGES;

    if (!totalPages || totalPages < 1) {
      throw new Error("Create Session: Invalid total pages calculation");
    }

    console.log(
      `[CREATE SESSION] studyTimeMinutes=${studyTimeMinutes}, totalPages=${totalPages}, sessionId=${sessionId}`
    );

    // Create new session with proper structure
    const newSession = new VinciSession({
      session_id: sessionId,
      user_id: userId,
      target_study_time_seconds: studyTimeSeconds,
      target_concepts: conceptIds,
      grade_level: sessionGradeLevel,
      semester: semester,
      pages: [],
      planned_total_pages: totalPages,
    });

    // Create the first page using pageManager with grade level
    const firstPage = pageManager.getOrCreatePage(
      newSession,
      1,
      sessionGradeLevel
    );

    if (
      !firstPage ||
      !firstPage.problems ||
      !Array.isArray(firstPage.problems)
    ) {
      throw new Error(
        "Create Session: Failed to create first page with valid problems"
      );
    }

    await newSession.save();

    const estimatedTime = Math.round(
      firstPage.problems.reduce(
        (sum, p) => sum + (p.estimatedTimeSeconds || 0),
        0
      ) / 60
    );

    res.json({
      sessionId,
      totalProblems: firstPage.problems.length,
      totalPages,
      estimatedTime,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to create session" });
  }
};

/**
 * Get session problems with pagination and strict validation
 */
const getSessionProblems = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { page = 1 } = req.query;

    if (
      !sessionId ||
      typeof sessionId !== "string" ||
      sessionId.trim() === ""
    ) {
      throw new Error(
        "Get Session Problems: sessionId is required and must be a non-empty string"
      );
    }

    const currentPage = parseInt(page);
    if (isNaN(currentPage) || currentPage < 1) {
      throw new Error("Get Session Problems: page must be a positive integer");
    }

    const session = await VinciSession.findOne({ session_id: sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (!session.planned_total_pages || session.planned_total_pages < 1) {
      throw new Error(
        "Get Session Problems: Session has invalid planned_total_pages"
      );
    }

    if (!session.grade_level || typeof session.grade_level !== "string") {
      throw new Error(
        "Get Session Problems: Session missing valid grade_level"
      );
    }

    console.log(
      `[GET PROBLEMS] sessionId=${sessionId}, page=${currentPage}, planned_total_pages=${session.planned_total_pages}`
    );

    // Check if page can be accessed
    if (!pageManager.canAccessPage(session, currentPage)) {
      const previousPage = currentPage - 1;
      throw new Error(
        `Page ${previousPage} must be submitted before accessing page ${currentPage}`
      );
    }

    // Get or create the requested page with grade level
    const pageData = pageManager.getOrCreatePage(
      session,
      currentPage,
      session.grade_level
    );

    if (!pageData || !pageData.problems || !Array.isArray(pageData.problems)) {
      throw new Error(
        "Get Session Problems: Failed to get valid page data with problems"
      );
    }

    // Save session if new page was created
    if (session.isModified()) {
      await session.save();
    }

    // Check if current page is submitted
    const isPageSubmitted = !!pageData.submitted_at;

    // Calculate target time for current page
    const currentPageTargetTime = pageManager.getPageTargetTime(
      session,
      currentPage
    );

    const submittedPages = session.pages.filter((p) => p.submitted_at).length;
    const isCompleted = submittedPages === session.planned_total_pages;

    res.json({
      problems: pageData.problems,
      currentPage,
      totalPages: session.planned_total_pages,
      isLastPage: currentPage >= session.planned_total_pages,
      isPageSubmitted,
      sessionInfo: {
        sessionId: session.session_id,
        isCompleted,
        targetTime: session.target_study_time_seconds,
        currentPageTargetTime: currentPageTargetTime,
        targetConcepts: session.target_concepts,
        submittedPages: session.pages
          .filter((p) => p.submitted_at)
          .map((p) => p.page_number),
        gradeLevel: session.grade_level,
        semester: session.semester,
        studyTimeMinutes: Math.round(session.target_study_time_seconds / 60),
        conceptNames: session.target_concepts.map((conceptId) =>
          conceptService.getConceptDisplayName(conceptId)
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching session problems:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch session problems" });
  }
};

/**
 * Submit answer for a problem with strict validation
 */
const submitAnswer = async (req, res) => {
  try {
    const { sessionId, pageNumber, sequenceNumber, answer } = req.body;

    validateRequired(
      req.body,
      ["sessionId", "pageNumber", "sequenceNumber", "answer"],
      "Submit Answer"
    );

    validateTypes(
      req.body,
      [
        ["pageNumber", "number", (val) => val >= 1],
        ["sequenceNumber", "number", (val) => val >= 1],
        ["answer", "string", (val) => val.trim().length > 0],
      ],
      "Submit Answer"
    );

    const session = await VinciSession.findOne({ session_id: sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Find the page
    const page = session.pages.find((p) => p.page_number === pageNumber);
    if (!page) {
      throw new Error("Submit Answer: Page not found in session");
    }

    // Check if page is already submitted
    if (page.submitted_at) {
      throw new Error(
        "Submit Answer: Page has already been submitted and cannot be modified"
      );
    }

    // Find the problem in the page
    const problem = page.problems.find(
      (p) => p.sequence_number === sequenceNumber
    );
    if (!problem) {
      throw new Error("Submit Answer: Problem not found in page");
    }

    if (!problem.answer || typeof problem.answer !== "string") {
      throw new Error("Submit Answer: Problem missing valid correct answer");
    }

    // Calculate score with fraction equivalence support
    const score = calculateScore(
      answer.trim(),
      problem.answer.trim(),
      problem.subcategory
    );

    if (typeof score !== "number" || score < 0) {
      throw new Error(
        "Submit Answer: Score calculation returned invalid result"
      );
    }

    // Add input answer with timestamp
    problem.input_answer.push({
      value: answer.trim(),
      timestamp: new Date(),
    });
    problem.score = score;

    await session.save();

    res.json({
      score,
      correctAnswer: problem.answer,
      isCorrect: score > 0,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: error.message || "Failed to submit answer" });
  }
};

/**
 * Submit a page (lock it from further edits) with strict validation
 */
const submitPage = async (req, res) => {
  try {
    const { sessionId, pageNumber } = req.body;

    validateRequired(req.body, ["sessionId", "pageNumber"], "Submit Page");

    validateTypes(
      req.body,
      [["pageNumber", "number", (val) => val >= 1]],
      "Submit Page"
    );

    console.log(
      `[SUBMIT PAGE] Attempting to submit page ${pageNumber} for session ${sessionId}`
    );

    const session = await VinciSession.findOne({ session_id: sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    if (
      !session.planned_total_pages ||
      pageNumber > session.planned_total_pages
    ) {
      throw new Error(
        `Submit Page: Invalid page number ${pageNumber}. Session has ${session.planned_total_pages} total pages`
      );
    }

    // Submit the page using pageManager
    const result = pageManager.submitPage(session, pageNumber);

    if (
      !result ||
      typeof result.pageNumber !== "number" ||
      !result.performance
    ) {
      throw new Error("Submit Page: Page manager returned invalid result");
    }

    await session.save();

    console.log(
      `[SUBMIT PAGE] Successfully submitted page ${
        result.pageNumber
      } with accuracy ${Math.round(result.performance.accuracy * 100)}%`
    );

    res.json({
      message: "Page submitted successfully",
      pageNumber: result.pageNumber,
      accuracy: Math.round(result.performance.accuracy * 100),
      correctAnswers: result.performance.correctAnswers,
      totalAnswered: result.performance.totalAnswered,
      totalProblems: result.performance.totalProblems,
    });
  } catch (error) {
    console.error("Error submitting page:", error);
    res.status(500).json({ error: error.message || "Failed to submit page" });
  }
};

/**
 * Complete a session with strict validation
 */
const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    validateRequired(req.body, ["sessionId"], "Complete Session");

    const session = await VinciSession.findOne({ session_id: sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if all pages are submitted
    const submittedPages = session.pages.filter((p) => p.submitted_at).length;
    if (submittedPages !== session.planned_total_pages) {
      throw new Error(
        `Complete Session: All pages must be submitted before completing session. ${submittedPages}/${session.planned_total_pages} pages submitted`
      );
    }

    // Calculate final score
    let totalScore = 0;
    let maxScore = 0;
    let totalProblems = 0;

    session.pages.forEach((page) => {
      if (!page.problems || !Array.isArray(page.problems)) {
        throw new Error("Complete Session: Invalid page problems structure");
      }

      page.problems.forEach((problem) => {
        totalScore += problem.score || 0;
        maxScore += 10;
        totalProblems++;
      });
    });

    if (totalProblems === 0) {
      throw new Error("Complete Session: No problems found in session");
    }

    const scorePercentage =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const correctAnswers = session.pages.reduce(
      (total, page) => total + page.problems.filter((p) => p.score > 0).length,
      0
    );

    res.json({
      message: "Session completed successfully",
      finalScore: scorePercentage,
      totalProblems,
      correctAnswers,
    });
  } catch (error) {
    console.error("Error completing session:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to complete session" });
  }
};

/**
 * Get session details for results page with strict validation
 */
const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (
      !sessionId ||
      typeof sessionId !== "string" ||
      sessionId.trim() === ""
    ) {
      throw new Error(
        "Get Session Details: sessionId is required and must be a non-empty string"
      );
    }

    const session = await VinciSession.findOne({ session_id: sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    let totalProblems = 0;

    session.pages.forEach((page) => {
      if (!page.problems || !Array.isArray(page.problems)) {
        throw new Error("Get Session Details: Invalid page problems structure");
      }

      page.problems.forEach((problem) => {
        totalScore += problem.score || 0;
        maxScore += 10;
        totalProblems++;
      });
    });

    const scorePercentage =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Format problems for results display
    const problemResults = [];
    session.pages.forEach((page) => {
      page.problems.forEach((problem) => {
        problemResults.push({
          page_number: page.page_number,
          sequence_number: problem.sequence_number,
          question: problem.question,
          correct_answer: problem.answer,
          student_answer:
            problem.input_answer.length > 0
              ? problem.input_answer[problem.input_answer.length - 1].value
              : "",
          is_correct: problem.score > 0,
          score: problem.score,
          subcategory: problem.subcategory,
          difficulty: problem.difficulty,
        });
      });
    });

    // Check completion status
    const submittedPages = session.pages.filter((p) => p.submitted_at).length;
    const isCompleted = submittedPages === session.planned_total_pages;
    const correctAnswers = session.pages.reduce(
      (total, page) => total + page.problems.filter((p) => p.score > 0).length,
      0
    );

    // Get celebration data from celebration manager
    const celebrationData =
      celebrationManager.getCelebrationData(scorePercentage);

    res.json({
      session_id: session.session_id,
      session_start: session.createdAt,
      session_end: isCompleted ? session.updatedAt : null,
      target_study_time_seconds: session.target_study_time_seconds,
      target_concepts: session.target_concepts,
      grade_level: session.grade_level,
      semester: session.semester,
      is_completed: isCompleted,
      total_pages: session.planned_total_pages,
      submitted_pages: session.pages
        .filter((p) => p.submitted_at)
        .map((p) => p.page_number),
      scorePercentage,
      totalProblems,
      correctAnswers,
      problems: problemResults,
      celebration: celebrationData,
      conceptNames: session.target_concepts.map((conceptId) =>
        conceptService.getConceptDisplayName(conceptId)
      ),
    });
  } catch (error) {
    console.error("Error fetching session details:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch session details" });
  }
};

/**
 * Claim an anonymous session for an authenticated user with strict validation
 */
const claimSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;

    if (
      !sessionId ||
      typeof sessionId !== "string" ||
      sessionId.trim() === ""
    ) {
      throw new Error(
        "Claim Session: sessionId is required and must be a non-empty string"
      );
    }

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const session = await VinciSession.findOne({ session_id: sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if session is already claimed by another user
    if (session.user_id && session.user_id !== userId) {
      throw new Error(
        "Claim Session: Session is already claimed by another user"
      );
    }

    // Check if session is already claimed by this user
    if (session.user_id === userId) {
      return res.json({
        message: "Session already belongs to this user",
        claimed: true,
      });
    }

    // Claim the session for this user
    session.user_id = userId;
    await session.save();

    console.log(
      `[SESSION CLAIM] Session ${sessionId} claimed by user ${userId}`
    );

    res.json({
      message: "Session successfully claimed",
      claimed: true,
      sessionId: session.session_id,
    });
  } catch (error) {
    console.error("Error claiming session:", error);
    res.status(500).json({ error: error.message || "Failed to claim session" });
  }
};

module.exports = {
  getConcepts,
  getStudentSessions,
  createSession,
  getSessionProblems,
  submitAnswer,
  submitPage,
  completeSession,
  getSessionDetails,
  claimSession,
};
