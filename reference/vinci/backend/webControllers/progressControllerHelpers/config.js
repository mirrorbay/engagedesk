/**
 * Progress Configuration Constants
 * Contains benchmark data and thresholds for progress analytics
 */

const DASHBOARD_BENCHMARKS = {
  // Performance benchmarks (average student performance)
  AVERAGE_ACCURACY: 72.3,
  AVERAGE_STUDY_TIME_WEEKLY: 38.2, // minutes per week
  AVERAGE_STUDY_TIME_DAILY: 8.1, // minutes per day
  AVERAGE_SESSION_COMPLETION: 76.4, // percentage
  AVERAGE_DIFFICULTY: 2.5,
  AVERAGE_PROBLEMS_PER_MINUTE: 1.2,
  AVERAGE_PROBLEMS_PER_SESSION: 15,
};

const ACHIEVEMENT_THRESHOLDS = {
  PROBLEM_SOLVER_BRONZE: 100,
  PROBLEM_SOLVER_SILVER: 500,
  PROBLEM_SOLVER_GOLD: 1000,
  CONSISTENCY_STREAK_MIN: 3,
  DIFFICULTY_CLIMBER_MIN: 3.0,
  CONCEPT_MASTERY_MIN: 85,
  HIGH_ACCURACY_MIN: 85,
  SPEED_DEMON_MIN: 1.5, // problems per minute
};

const PERFORMANCE_CATEGORIES = {
  STRUGGLING: {
    threshold: 60,
    color: "#ef4444",
    label: "Needs Practice",
  },
  DEVELOPING: {
    threshold: 75,
    color: "#f59e0b",
    label: "Making Progress",
  },
  MASTERED: {
    threshold: 85,
    color: "#22c55e",
    label: "Well Done",
  },
};

const ENCOURAGING_MESSAGES = {
  STRENGTHS: [
    "You're building excellent study habits!",
    "Your consistency is paying off!",
    "Great progress on challenging problems!",
    "You're developing strong problem-solving skills!",
    "Your accuracy shows real understanding!",
    "You're tackling harder concepts with confidence!",
    "Your study streak shows dedication!",
    "You're mastering new concepts effectively!",
  ],

  GROWTH_OPPORTUNITIES: [
    "Ready to explore more challenging problems!",
    "Perfect time to strengthen your foundation!",
    "You're prepared for the next level of difficulty!",
    "Consider extending your study sessions for deeper learning!",
    "Focus practice will help solidify these concepts!",
    "You're close to mastering this topic!",
    "A little more practice will boost your confidence!",
    "Ready to tackle new mathematical concepts!",
  ],

  DIFFICULTY_PROGRESSION: [
    "You're ready for more challenging problems!",
    "Your skills are developing nicely - time to level up!",
    "You've mastered the basics - let's explore advanced concepts!",
    "Your problem-solving confidence is growing!",
    "You're prepared for the next difficulty level!",
    "Your mathematical thinking is becoming more sophisticated!",
  ],

  CONCEPT_MASTERY: {
    SINGLE_MASTERED:
      "You're showing strong mastery in your math skills, demonstrating your ability to develop deep understanding through focused practice.",
    MULTIPLE_MASTERED:
      "You're excelling at basic math, showing growing mathematical maturity and problem-solving confidence.",
    DEVELOPING_PROGRESS:
      "You're making solid progress in your math skills, with consistent effort building strong foundations.",
    BUILDING_UNDERSTANDING:
      "You're building understanding in your math work - this exploration of new mathematical ideas is exactly how learning happens, with each practice session strengthening your foundation.",
    MIXED_PROGRESS:
      "Your mathematical understanding is developing well, with strong performance in some topics and continued growth in others through dedicated practice.",
    NO_DATA:
      "Continue practicing to develop your math skills - every problem you solve builds understanding and strengthens your mathematical foundation.",
  },
};

module.exports = {
  DASHBOARD_BENCHMARKS,
  ACHIEVEMENT_THRESHOLDS,
  PERFORMANCE_CATEGORIES,
  ENCOURAGING_MESSAGES,
};
