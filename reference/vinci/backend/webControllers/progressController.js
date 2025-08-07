/**
 * Progress Controller
 * Handles progress analytics and performance metrics
 */

const VinciSession = require("../models/VinciSession");
const {
  DASHBOARD_BENCHMARKS,
  ACHIEVEMENT_THRESHOLDS,
  PERFORMANCE_CATEGORIES,
  ENCOURAGING_MESSAGES,
} = require("./progressControllerHelpers/config");

/**
 * Get progress analytics data for the authenticated user
 */
const getProgressData = async (req, res) => {
  try {
    // Get user ID from authenticated token
    const userId = req.user.id;

    // Get all sessions for the user
    const sessions = await VinciSession.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .limit(100); // Limit for performance

    // Calculate analytics
    const analytics = calculateProgressAnalytics(sessions);

    // Add benchmark data
    const benchmarks = DASHBOARD_BENCHMARKS;

    // Generate encouraging commentary
    const commentary = generateEncouragingCommentary(analytics, benchmarks);

    // Calculate achievements
    const achievements = calculateAchievements(analytics);

    // Get study trends for the past 7 days
    const studyTrends = await calculateStudyTrends(userId, 7);

    res.json({
      sessions: sessions.map((session) => ({
        session_id: session.session_id,
        createdAt: session.createdAt,
        target_concepts: session.target_concepts,
        target_study_time_seconds: session.target_study_time_seconds,
        is_completed:
          session.pages.filter((p) => p.submitted_at).length ===
          session.planned_total_pages,
        scorePercentage:
          session.pages.length > 0
            ? Math.round(
                (session.pages.reduce(
                  (sum, page) =>
                    sum +
                    page.problems.reduce(
                      (pSum, problem) => pSum + (problem.score > 0 ? 1 : 0),
                      0
                    ),
                  0
                ) /
                  session.pages.reduce(
                    (sum, page) => sum + page.problems.length,
                    0
                  )) *
                  100
              )
            : 0,
        totalProblems: session.pages.reduce(
          (sum, page) => sum + page.problems.length,
          0
        ),
      })),
      analytics,
      benchmarks,
      commentary,
      achievements,
      studyTrends,
    });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    res.status(500).json({ error: "Failed to fetch progress data" });
  }
};

/**
 * Get benchmark data
 */
const getBenchmarks = async (req, res) => {
  try {
    res.json({
      benchmarks: DASHBOARD_BENCHMARKS,
      thresholds: ACHIEVEMENT_THRESHOLDS,
      categories: PERFORMANCE_CATEGORIES,
    });
  } catch (error) {
    console.error("Error fetching benchmarks:", error);
    res.status(500).json({ error: "Failed to fetch benchmarks" });
  }
};

/**
 * Calculate progress analytics from sessions data
 */
const calculateProgressAnalytics = (sessions) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Filter completed sessions
  const completedSessions = sessions.filter(
    (session) =>
      session.pages.filter((p) => p.submitted_at).length ===
      session.planned_total_pages
  );

  // Calculate overall metrics
  let totalProblems = 0;
  let totalCorrect = 0;
  let totalStudyTime = 0;
  let weeklyStudyTime = 0;
  let monthlyStudyTime = 0;
  let difficultySum = 0;
  let difficultyCount = 0;

  // Concept performance tracking
  const conceptPerformance = {};

  completedSessions.forEach((session) => {
    const sessionDate = new Date(session.createdAt);
    const sessionStudyTime = session.target_study_time_seconds / 60; // Convert to minutes

    totalStudyTime += sessionStudyTime;

    if (sessionDate >= oneWeekAgo) {
      weeklyStudyTime += sessionStudyTime;
    }

    if (sessionDate >= oneMonthAgo) {
      monthlyStudyTime += sessionStudyTime;
    }

    // Process problems in each session
    session.pages.forEach((page) => {
      page.problems.forEach((problem) => {
        totalProblems++;
        if (problem.score > 0) {
          totalCorrect++;
        }

        // Track difficulty
        if (problem.difficulty) {
          difficultySum += problem.difficulty;
          difficultyCount++;
        }

        // Track concept performance
        if (problem.subcategory) {
          if (!conceptPerformance[problem.subcategory]) {
            conceptPerformance[problem.subcategory] = {
              totalProblems: 0,
              correctProblems: 0,
              difficultySum: 0,
              difficultyCount: 0,
            };
          }

          const concept = conceptPerformance[problem.subcategory];
          concept.totalProblems++;
          if (problem.score > 0) {
            concept.correctProblems++;
          }
          if (problem.difficulty) {
            concept.difficultySum += problem.difficulty;
            concept.difficultyCount++;
          }
        }
      });
    });
  });

  // Calculate study streak (consecutive days with completed sessions)
  const studyStreak = calculateStudyStreak(completedSessions);

  // Calculate session completion rate
  const sessionCompletionRate =
    sessions.length > 0
      ? Math.round((completedSessions.length / sessions.length) * 100)
      : 0;

  // Calculate problems per minute (rough estimate)
  const problemsPerMinute =
    totalStudyTime > 0 ? totalProblems / totalStudyTime : 0;

  // Process concept performance
  const processedConceptPerformance = {};
  Object.entries(conceptPerformance).forEach(([conceptId, data]) => {
    processedConceptPerformance[conceptId] = {
      accuracy:
        data.totalProblems > 0
          ? Math.round((data.correctProblems / data.totalProblems) * 100)
          : 0,
      totalProblems: data.totalProblems,
      averageDifficulty:
        data.difficultyCount > 0
          ? data.difficultySum / data.difficultyCount
          : 0,
    };
  });

  return {
    overallAccuracy:
      totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0,
    studyStreak,
    weeklyStudyTime: Math.round(weeklyStudyTime),
    monthlyStudyTime: Math.round(monthlyStudyTime),
    totalProblems,
    averageDifficulty:
      difficultyCount > 0
        ? Number((difficultySum / difficultyCount).toFixed(1))
        : 0,
    sessionCompletionRate,
    problemsPerMinute: Number(problemsPerMinute.toFixed(2)),
    conceptPerformance: processedConceptPerformance,
  };
};

/**
 * Calculate study streak (consecutive days with completed sessions)
 */
const calculateStudyStreak = (completedSessions) => {
  if (completedSessions.length === 0) return 0;

  // Sort sessions by date (most recent first)
  const sortedSessions = completedSessions
    .map((session) => new Date(session.createdAt))
    .sort((a, b) => b - a);

  // Get unique dates (remove duplicates from same day)
  const uniqueDates = [
    ...new Set(sortedSessions.map((date) => date.toISOString().split("T")[0])),
  ];

  if (uniqueDates.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Check if streak is current (studied today or yesterday)
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }

  // Count consecutive days
  let streak = 1;
  let currentDate = new Date(uniqueDates[0]);

  for (let i = 1; i < uniqueDates.length; i++) {
    const previousDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const expectedDateString = previousDate.toISOString().split("T")[0];

    if (uniqueDates[i] === expectedDateString) {
      streak++;
      currentDate = previousDate;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Get concept-specific analytics
 */
const getConceptAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conceptId } = req.params;

    const sessions = await VinciSession.find({
      user_id: userId,
      target_concepts: conceptId,
    }).sort({ createdAt: -1 });

    const completedSessions = sessions.filter(
      (session) =>
        session.pages.filter((p) => p.submitted_at).length ===
        session.planned_total_pages
    );

    let conceptProblems = [];
    let totalProblems = 0;
    let correctProblems = 0;
    let difficultyProgression = [];

    completedSessions.forEach((session) => {
      session.pages.forEach((page) => {
        page.problems.forEach((problem) => {
          if (
            problem.subcategory === conceptId ||
            problem.category === conceptId
          ) {
            totalProblems++;
            if (problem.score > 0) {
              correctProblems++;
            }

            conceptProblems.push({
              sessionDate: session.createdAt,
              question: problem.question,
              correct: problem.score > 0,
              difficulty: problem.difficulty,
              studentAnswer:
                problem.input_answer.length > 0
                  ? problem.input_answer[problem.input_answer.length - 1].value
                  : "",
              correctAnswer: problem.answer,
            });

            difficultyProgression.push({
              date: session.createdAt,
              difficulty: problem.difficulty,
              correct: problem.score > 0,
            });
          }
        });
      });
    });

    const analytics = {
      conceptId,
      totalProblems,
      accuracy:
        totalProblems > 0
          ? Math.round((correctProblems / totalProblems) * 100)
          : 0,
      sessionsCount: completedSessions.length,
      recentProblems: conceptProblems.slice(0, 20), // Last 20 problems
      difficultyProgression: difficultyProgression.slice(-30), // Last 30 problems for progression
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching concept analytics:", error);
    res.status(500).json({ error: "Failed to fetch concept analytics" });
  }
};

/**
 * Generate concept mastery message based on analytics
 */
const generateConceptMasteryMessage = (analytics) => {
  const conceptPerformance = analytics.conceptPerformance || {};
  const concepts = Object.entries(conceptPerformance);

  if (concepts.length === 0) {
    return ENCOURAGING_MESSAGES.CONCEPT_MASTERY.NO_DATA;
  }

  const masteredConcepts = concepts.filter(([_, data]) => data.accuracy >= 85);
  const developingConcepts = concepts.filter(
    ([_, data]) => data.accuracy >= 65 && data.accuracy < 85
  );
  const strugglingConcepts = concepts.filter(([_, data]) => data.accuracy < 65);

  // Single mastered concept
  if (
    masteredConcepts.length === 1 &&
    developingConcepts.length === 0 &&
    strugglingConcepts.length === 0
  ) {
    return ENCOURAGING_MESSAGES.CONCEPT_MASTERY.SINGLE_MASTERED;
  }

  // Multiple mastered concepts
  if (
    masteredConcepts.length > 1 &&
    developingConcepts.length === 0 &&
    strugglingConcepts.length === 0
  ) {
    return ENCOURAGING_MESSAGES.CONCEPT_MASTERY.MULTIPLE_MASTERED;
  }

  // Only developing concepts
  if (
    masteredConcepts.length === 0 &&
    developingConcepts.length > 0 &&
    strugglingConcepts.length === 0
  ) {
    return ENCOURAGING_MESSAGES.CONCEPT_MASTERY.DEVELOPING_PROGRESS;
  }

  // Only struggling concepts
  if (
    masteredConcepts.length === 0 &&
    developingConcepts.length === 0 &&
    strugglingConcepts.length > 0
  ) {
    return ENCOURAGING_MESSAGES.CONCEPT_MASTERY.BUILDING_UNDERSTANDING;
  }

  // Mixed progress (combination of different levels)
  return ENCOURAGING_MESSAGES.CONCEPT_MASTERY.MIXED_PROGRESS;
};

/**
 * Generate encouraging commentary based on analytics with focus on time spent and performance
 */
const generateEncouragingCommentary = (analytics, benchmarks) => {
  const strengths = [];
  const growthOpportunities = [];

  // Generate concept mastery message
  const conceptMasteryMessage = generateConceptMasteryMessage(analytics);

  // Analyze concept mastery patterns
  const conceptPerformance = analytics.conceptPerformance || {};
  const concepts = Object.entries(conceptPerformance);
  const masteredConcepts = concepts.filter(([_, data]) => data.accuracy >= 85);
  const developingConcepts = concepts.filter(
    ([_, data]) => data.accuracy >= 65 && data.accuracy < 85
  );
  const strugglingConcepts = concepts.filter(([_, data]) => data.accuracy < 65);

  // Calculate effort and performance ratios for dynamic messaging
  const effortRatio =
    analytics.weeklyStudyTime / benchmarks.AVERAGE_STUDY_TIME_WEEKLY;
  const performanceRatio =
    analytics.overallAccuracy / benchmarks.AVERAGE_ACCURACY;
  const difficultyRatio =
    analytics.averageDifficulty / benchmarks.AVERAGE_DIFFICULTY;

  // STRENGTHS: Analyze based on effort (time spent) and performance score

  // High effort + High performance
  if (effortRatio >= 1.2 && performanceRatio >= 1.1) {
    strengths.push(
      `Exceptional work! Your ${analytics.weeklyStudyTime} minutes of weekly practice combined with ${analytics.overallAccuracy}% accuracy shows you're maximizing both effort and results.`
    );
  }
  // High effort + Average performance
  else if (effortRatio >= 1.2 && performanceRatio >= 0.9) {
    strengths.push(
      `Your dedication is outstanding with ${analytics.weeklyStudyTime} minutes of weekly practice! This consistent effort is building the foundation for improved performance.`
    );
  }
  // Average effort + High performance
  else if (effortRatio >= 0.8 && performanceRatio >= 1.1) {
    strengths.push(
      `Impressive efficiency! You're achieving ${analytics.overallAccuracy}% accuracy with focused study time, showing excellent learning effectiveness.`
    );
  }

  // Study streak recognition (effort-based)
  if (analytics.studyStreak >= ACHIEVEMENT_THRESHOLDS.CONSISTENCY_STREAK_MIN) {
    if (analytics.studyStreak >= 7) {
      strengths.push(
        `Outstanding consistency! Your ${analytics.studyStreak}-day study streak demonstrates exceptional commitment to mathematical growth.`
      );
    } else {
      strengths.push(
        `Great consistency! Your ${analytics.studyStreak}-day study streak shows you're building strong study habits.`
      );
    }
  }

  // Performance-based strengths
  if (analytics.overallAccuracy >= 90) {
    strengths.push(
      `Excellent mastery! Your ${analytics.overallAccuracy}% accuracy demonstrates strong conceptual understanding and careful problem-solving.`
    );
  } else if (analytics.overallAccuracy >= 80) {
    strengths.push(
      `Strong performance! Your ${analytics.overallAccuracy}% accuracy shows solid mathematical understanding.`
    );
  }

  // Difficulty progression (performance + challenge level)
  if (difficultyRatio >= 1.2 && analytics.overallAccuracy >= 70) {
    strengths.push(
      `You're confidently tackling advanced problems with ${analytics.overallAccuracy}% accuracy - your mathematical thinking is becoming more sophisticated!`
    );
  }

  // Concept mastery strengths
  if (masteredConcepts.length > 0) {
    if (masteredConcepts.length === 1) {
      strengths.push(
        "You're showing strong mastery in your math skills, demonstrating your ability to develop deep understanding through focused practice."
      );
    } else {
      strengths.push(
        `You've mastered ${masteredConcepts.length} concept areas - this shows your growing mathematical maturity and problem-solving confidence.`
      );
    }
  }

  // GROWTH OPPORTUNITIES: Based on effort and performance gaps

  // Low effort opportunities
  if (effortRatio < 0.7) {
    if (analytics.weeklyStudyTime < 20) {
      growthOpportunities.push(
        `Increasing your study time from ${analytics.weeklyStudyTime} to 25-30 minutes per week could significantly boost your mathematical understanding and confidence.`
      );
    } else {
      growthOpportunities.push(
        "Consider extending your study sessions gradually - even 10-15 more minutes per week can significantly deepen your understanding of mathematical concepts."
      );
    }
  }

  // Performance improvement opportunities
  if (performanceRatio < 0.9) {
    if (analytics.overallAccuracy < 60) {
      growthOpportunities.push(
        `Focus on building foundational skills - your current ${analytics.overallAccuracy}% accuracy will improve with targeted practice on core concepts.`
      );
    } else {
      growthOpportunities.push(
        `With ${analytics.overallAccuracy}% accuracy, you're close to the benchmark - focused practice on problem-solving strategies will help boost your performance.`
      );
    }
  }

  // Effort vs Performance mismatch
  if (effortRatio >= 1.2 && performanceRatio < 0.8) {
    growthOpportunities.push(
      "Your study time investment is excellent - consider focusing on understanding core concepts more deeply to see your accuracy improve."
    );
  }

  // Speed and efficiency
  if (
    analytics.problemsPerMinute < benchmarks.AVERAGE_PROBLEMS_PER_MINUTE &&
    analytics.overallAccuracy >= 75
  ) {
    growthOpportunities.push(
      "Your accuracy is strong - as you continue practicing, your problem-solving speed will naturally improve while maintaining quality."
    );
  }

  // Concept-specific opportunities
  if (strugglingConcepts.length > 0) {
    if (strugglingConcepts.length === 1) {
      growthOpportunities.push(
        "You're building understanding in one challenging area - focused practice in this concept will strengthen your overall mathematical foundation."
      );
    } else {
      growthOpportunities.push(
        `You're working on ${strugglingConcepts.length} developing areas - this exploration of new mathematical ideas is exactly how learning happens.`
      );
    }
  }

  // Consistency opportunities
  if (
    analytics.studyStreak < 3 &&
    analytics.weeklyStudyTime >= benchmarks.AVERAGE_STUDY_TIME_WEEKLY
  ) {
    growthOpportunities.push(
      "Your study time is good - establishing a more regular daily routine could help maximize your learning momentum."
    );
  }

  // Ensure we have at least one item in each category
  if (strengths.length === 0) {
    if (analytics.totalProblems > 0) {
      strengths.push(
        `You've solved ${analytics.totalProblems} problems - every problem you complete builds your mathematical understanding and confidence!`
      );
    } else {
      strengths.push(
        "You're building mathematical understanding through practice - every problem you solve strengthens your foundation for future learning!"
      );
    }
  }

  if (growthOpportunities.length === 0) {
    growthOpportunities.push(
      "Your mathematical understanding is developing well - continue practicing to deepen your mastery across all concepts."
    );
  }

  return {
    strengths,
    growthOpportunities,
    conceptMastery: conceptMasteryMessage,
  };
};

/**
 * Calculate achievements based on analytics
 */
const calculateAchievements = (analytics) => {
  const achievements = [];

  // Problem Solver badges
  if (analytics.totalProblems >= ACHIEVEMENT_THRESHOLDS.PROBLEM_SOLVER_GOLD) {
    achievements.push({
      type: "problem_solver",
      level: "gold",
      title: "Problem Solver Gold",
      description: "1000+ problems solved",
    });
  } else if (
    analytics.totalProblems >= ACHIEVEMENT_THRESHOLDS.PROBLEM_SOLVER_SILVER
  ) {
    achievements.push({
      type: "problem_solver",
      level: "silver",
      title: "Problem Solver Silver",
      description: "500+ problems solved",
    });
  } else if (
    analytics.totalProblems >= ACHIEVEMENT_THRESHOLDS.PROBLEM_SOLVER_BRONZE
  ) {
    achievements.push({
      type: "problem_solver",
      level: "bronze",
      title: "Problem Solver Bronze",
      description: "100+ problems solved",
    });
  }

  // Consistency Champion
  if (analytics.studyStreak >= ACHIEVEMENT_THRESHOLDS.CONSISTENCY_STREAK_MIN) {
    achievements.push({
      type: "consistency",
      level: "champion",
      title: "Consistency Champion",
      description: `${analytics.studyStreak}-day study streak`,
    });
  }

  // Difficulty Climber
  if (
    analytics.averageDifficulty >= ACHIEVEMENT_THRESHOLDS.DIFFICULTY_CLIMBER_MIN
  ) {
    achievements.push({
      type: "difficulty",
      level: "climber",
      title: "Difficulty Climber",
      description: `Tackling advanced problems`,
    });
  }

  // High Accuracy
  if (analytics.overallAccuracy >= ACHIEVEMENT_THRESHOLDS.HIGH_ACCURACY_MIN) {
    achievements.push({
      type: "accuracy",
      level: "master",
      title: "Accuracy Master",
      description: `${analytics.overallAccuracy}% overall accuracy`,
    });
  }

  // Speed Demon
  if (analytics.problemsPerMinute >= ACHIEVEMENT_THRESHOLDS.SPEED_DEMON_MIN) {
    achievements.push({
      type: "speed",
      level: "demon",
      title: "Speed Demon",
      description: `${analytics.problemsPerMinute} problems per minute`,
    });
  }

  return achievements;
};

/**
 * Calculate study trends for the past N days
 */
const calculateStudyTrends = async (userId, days = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const sessions = await VinciSession.find({
    user_id: userId,
    createdAt: { $gte: startDate },
  }).sort({ createdAt: 1 });

  const completedSessions = sessions.filter(
    (session) =>
      session.pages.filter((p) => p.submitted_at).length ===
      session.planned_total_pages
  );

  // Create array for each day (always show full period)
  const trends = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split("T")[0];
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    // Find sessions for this day
    const daySessions = completedSessions.filter(
      (session) => session.createdAt.toISOString().split("T")[0] === dateString
    );

    let studyTime = 0;
    let problems = 0;
    let correct = 0;

    daySessions.forEach((session) => {
      studyTime += session.target_study_time_seconds / 60;
      session.pages.forEach((page) => {
        page.problems.forEach((problem) => {
          problems++;
          if (problem.score > 0) correct++;
        });
      });
    });

    const accuracy = problems > 0 ? Math.round((correct / problems) * 100) : 0;

    // Get platform average (constant for all days)
    const studyTimeBenchmark = DASHBOARD_BENCHMARKS.AVERAGE_STUDY_TIME_DAILY;
    const accuracyBenchmark = DASHBOARD_BENCHMARKS.AVERAGE_ACCURACY;

    trends.push({
      date: dateString,
      dayName,
      studyTime: Math.round(studyTime),
      accuracy,
      problems,
      sessions: daySessions.length,
      studyTimeBenchmark,
      accuracyBenchmark,
      studyTimeVsBenchmark: studyTime - studyTimeBenchmark,
      accuracyVsBenchmark: accuracy - accuracyBenchmark,
    });
  }

  return trends;
};

/**
 * Delete a session for the authenticated user
 */
const deleteSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Find the session and verify it belongs to the user
    const session = await VinciSession.findOne({
      session_id: sessionId,
      user_id: userId,
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Delete the session
    await VinciSession.deleteOne({
      session_id: sessionId,
      user_id: userId,
    });

    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
};

module.exports = {
  getProgressData,
  getBenchmarks,
  getConceptAnalytics,
  deleteSession,
};
