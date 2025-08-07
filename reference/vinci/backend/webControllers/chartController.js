/**
 * Chart Controller
 * Handles performance chart data and analytics for visualization components
 */

const VinciSession = require("../models/VinciSession");
const { DASHBOARD_BENCHMARKS } = require("./progressControllerHelpers/config");

/**
 * Get performance trends over time for charts
 */
const getPerformanceTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;
    const numDays = parseInt(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

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
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      const dayName = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();

      // Find sessions for this day
      const daySessions = completedSessions.filter(
        (session) =>
          session.createdAt.toISOString().split("T")[0] === dateString
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

      const accuracy =
        problems > 0 ? Math.round((correct / problems) * 100) : 0;

      // Get platform average (constant for all days)
      const studyTimeBenchmark = DASHBOARD_BENCHMARKS.AVERAGE_STUDY_TIME_DAILY;
      const accuracyBenchmark = DASHBOARD_BENCHMARKS.AVERAGE_ACCURACY;

      trends.push({
        date: dateString,
        studyTime: Math.round(studyTime),
        accuracy,
        problems,
        sessions: daySessions.length,
        studyTimeBenchmark,
        accuracyBenchmark,
      });
    }

    res.json({ trends });
  } catch (error) {
    console.error("Error fetching performance trends:", error);
    res.status(500).json({ error: "Failed to fetch performance trends" });
  }
};

module.exports = {
  getPerformanceTrends,
};
