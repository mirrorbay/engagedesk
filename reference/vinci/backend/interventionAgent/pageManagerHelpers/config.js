/**
 * Configuration file for pagination controller
 * Contains all key constants for progressive pagination and problem selection
 */

const CONFIG = {
  // Unified time adjustment rules - used for all grades
  // Base rules optimized for grades 4-10, with grade-specific time adjustments applied separately
  TIME_RULES: [
    {
      name: "VERY_FAST",
      threshold: 0.5, // < 50% of estimated time
      multiplier: 1.5, // 50% more problems next page
    },
    {
      name: "FAST",
      threshold: 0.7, // < 70% of estimated time
      multiplier: 1.25, // 25% more problems next page
    },
    {
      name: "NORMAL",
      threshold: 1.2, // < 120% of estimated time
      multiplier: 1.0, // Same number of problems
    },
    {
      name: "SLOW",
      threshold: 1.8, // < 180% of estimated time
      multiplier: 0.75, // 25% fewer problems next page
    },
    {
      name: "DISTRACTED",
      threshold: Infinity, // >= 180% of estimated time
      multiplier: 0.5, // 50% fewer problems next page
    },
  ],

  // Grade-specific time adjustment ratios
  // Base estimatedTimeSeconds work well for grades 4-10 (ratio = 1.0)
  // Younger grades get easier ratios (more time), older grades get more demanding ratios (less time)
  GRADE_TIME_ADJUSTMENT_RATIOS: {
    Kindergarten: 4, // 300% more time - much easier
    "1st Grade": 3, // 250% more time
    "2nd Grade": 2, // 100% more time
    "3rd Grade": 1.5, // 150% more time
    "4th Grade": 1.2, // Base time (no adjustment)
    "5th Grade": 1.1, // Base time (no adjustment)
    "6th Grade": 1.0, // Base time (no adjustment)
    "7th Grade": 1.0, // Base time (no adjustment)
    "8th Grade": 1.0, // Base time (no adjustment)
    "9th Grade": 0.95, // Base time (no adjustment)
    "10th Grade": 0.9, // Base time (no adjustment)
    "11th Grade": 0.85, // 15% less time - more demanding
    "12th Grade": 0.8, // 25% less time - most demanding
  },

  // Grade-specific difficulty progression rules - ordered from lowest to highest performance
  DIFFICULTY_RULES: {
    // Kindergarten - Very gentle introduction, level 1 only
    Kindergarten: {
      PAGE_1: {
        levels: [1],
        distribution: [1.0],
      },
      PAGE_2: [
        {
          name: "NEEDS_SUPPORT",
          threshold: 0.9, // < 90% accuracy
          levels: [1],
          distribution: [1.0],
        },
        {
          name: "EXCELLENT",
          threshold: Infinity, // >= 90% accuracy
          levels: [1],
          distribution: [1.0],
        },
      ],
      PAGE_3: [
        {
          name: "NEEDS_SUPPORT",
          threshold: 0.8, // < 80% accuracy
          levels: [1],
          distribution: [1.0],
        },
        {
          name: "DEVELOPING",
          threshold: 0.9, // < 90% accuracy
          levels: [1],
          distribution: [1.0],
        },
        {
          name: "EXCELLENT",
          threshold: Infinity, // >= 90% accuracy
          levels: [1],
          distribution: [1.0],
        },
      ],
    },

    // 1st Grade - Mostly level 1, very limited level 2
    "1st Grade": {
      PAGE_1: {
        levels: [1],
        distribution: [1.0],
      },
      PAGE_2: [
        {
          name: "NEEDS_SUPPORT",
          threshold: 0.8, // < 80% accuracy
          levels: [1],
          distribution: [1.0],
        },
        {
          name: "GOOD",
          threshold: Infinity, // >= 80% accuracy
          levels: [1, 2],
          distribution: [0.8, 0.2],
        },
      ],
      PAGE_3: [
        {
          name: "NEEDS_SUPPORT",
          threshold: 0.7, // < 70% accuracy
          levels: [1],
          distribution: [1.0],
        },
        {
          name: "DEVELOPING",
          threshold: 0.85, // < 85% accuracy
          levels: [1, 2],
          distribution: [0.9, 0.1],
        },
        {
          name: "EXCELLENT",
          threshold: Infinity, // >= 85% accuracy
          levels: [1, 2],
          distribution: [0.7, 0.3],
        },
      ],
    },

    // 2nd Grade - Gradual introduction to level 2
    "2nd Grade": {
      PAGE_1: {
        levels: [1],
        distribution: [1.0],
      },
      PAGE_2: [
        {
          name: "NEEDS_SUPPORT",
          threshold: 0.8, // < 80% accuracy
          levels: [1],
          distribution: [1.0],
        },
        {
          name: "GOOD",
          threshold: Infinity, // >= 80% accuracy
          levels: [1, 2],
          distribution: [0.7, 0.3],
        },
      ],
      PAGE_3: [
        {
          name: "NEEDS_SUPPORT",
          threshold: 0.7, // < 70% accuracy
          levels: [1],
          distribution: [1.0],
        },
        {
          name: "DEVELOPING",
          threshold: 0.85, // < 85% accuracy
          levels: [1, 2],
          distribution: [0.8, 0.2],
        },
        {
          name: "EXCELLENT",
          threshold: Infinity, // >= 85% accuracy
          levels: [2],
          distribution: [1.0],
        },
      ],
    },

    // 3rd Grade - Keep existing middle elementary rules
    "3rd Grade": {
      PAGE_1: {
        levels: [1, 2],
        distribution: [0.3, 0.7],
      },
      PAGE_2: [
        {
          name: "POOR",
          threshold: 0.7, // < 70% accuracy
          levels: [1, 2],
          distribution: [0.5, 0.5],
        },
        {
          name: "GOOD",
          threshold: Infinity, // >= 70% accuracy
          levels: [2, 3],
          distribution: [0.5, 0.5],
        },
      ],
      PAGE_3: [
        {
          name: "POOR",
          threshold: 0.6, // < 60% accuracy
          levels: [1, 2],
          distribution: [0.7, 0.3],
        },
        {
          name: "AVERAGE",
          threshold: 0.7, // < 70% accuracy
          levels: [2, 3],
          distribution: [0.7, 0.3],
        },
        {
          name: "GOOD",
          threshold: 0.85, // < 85% accuracy
          levels: [3, 4],
          distribution: [0.3, 0.7],
        },
        {
          name: "EXCELLENT",
          threshold: Infinity, // >= 85% accuracy
          levels: [4, 5],
          distribution: [0.5, 0.5],
        },
      ],
    },

    // 4th Grade - Keep existing middle elementary rules
    "4th Grade": {
      PAGE_1: {
        levels: [1, 2],
        distribution: [0.3, 0.7],
      },
      PAGE_2: [
        {
          name: "POOR",
          threshold: 0.7, // < 70% accuracy
          levels: [1, 2],
          distribution: [0.5, 0.5],
        },
        {
          name: "GOOD",
          threshold: Infinity, // >= 70% accuracy
          levels: [2, 3],
          distribution: [0.5, 0.5],
        },
      ],
      PAGE_3: [
        {
          name: "POOR",
          threshold: 0.6, // < 60% accuracy
          levels: [1, 2],
          distribution: [0.7, 0.3],
        },
        {
          name: "AVERAGE",
          threshold: 0.7, // < 70% accuracy
          levels: [2, 3],
          distribution: [0.7, 0.3],
        },
        {
          name: "GOOD",
          threshold: 0.85, // < 85% accuracy
          levels: [3, 4],
          distribution: [0.3, 0.7],
        },
        {
          name: "EXCELLENT",
          threshold: Infinity, // >= 85% accuracy
          levels: [4, 5],
          distribution: [0.5, 0.5],
        },
      ],
    },

    // 5th Grade - Keep existing middle elementary rules
    "5th Grade": {
      PAGE_1: {
        levels: [1, 2],
        distribution: [0.3, 0.7],
      },
      PAGE_2: [
        {
          name: "POOR",
          threshold: 0.7, // < 70% accuracy
          levels: [1, 2],
          distribution: [0.5, 0.5],
        },
        {
          name: "GOOD",
          threshold: Infinity, // >= 70% accuracy
          levels: [2, 3],
          distribution: [0.5, 0.5],
        },
      ],
      PAGE_3: [
        {
          name: "POOR",
          threshold: 0.6, // < 60% accuracy
          levels: [1, 2],
          distribution: [0.7, 0.3],
        },
        {
          name: "AVERAGE",
          threshold: 0.7, // < 70% accuracy
          levels: [2, 3],
          distribution: [0.7, 0.3],
        },
        {
          name: "GOOD",
          threshold: 0.85, // < 85% accuracy
          levels: [3, 4],
          distribution: [0.3, 0.7],
        },
        {
          name: "EXCELLENT",
          threshold: Infinity, // >= 85% accuracy
          levels: [4, 5],
          distribution: [0.5, 0.5],
        },
      ],
    },

    // 6th Grade - Transition to higher levels
    "6th Grade": {
      PAGE_1: {
        levels: [2],
        distribution: [1.0],
      },
      PAGE_2: [
        {
          name: "STRUGGLING",
          threshold: 0.6, // < 60% accuracy
          levels: [1, 2],
          distribution: [0.4, 0.6],
        },
        {
          name: "DEVELOPING",
          threshold: 0.8, // < 80% accuracy
          levels: [2, 3],
          distribution: [0.6, 0.4],
        },
        {
          name: "PROFICIENT",
          threshold: Infinity, // >= 80% accuracy
          levels: [3, 4],
          distribution: [0.6, 0.4],
        },
      ],
      PAGE_3: [
        {
          name: "STRUGGLING",
          threshold: 0.5, // < 50% accuracy
          levels: [1, 2],
          distribution: [0.5, 0.5],
        },
        {
          name: "DEVELOPING",
          threshold: 0.65, // < 65% accuracy
          levels: [2, 3],
          distribution: [0.6, 0.4],
        },
        {
          name: "PROFICIENT",
          threshold: 0.8, // < 80% accuracy
          levels: [3, 4],
          distribution: [0.5, 0.5],
        },
        {
          name: "ADVANCED",
          threshold: 0.9, // < 90% accuracy
          levels: [4, 5],
          distribution: [0.4, 0.6],
        },
        {
          name: "EXCEPTIONAL",
          threshold: Infinity, // >= 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
      ],
    },

    // 7th Grade - Higher starting levels
    "7th Grade": {
      PAGE_1: {
        levels: [2, 3],
        distribution: [0.4, 0.6],
      },
      PAGE_2: [
        {
          name: "STRUGGLING",
          threshold: 0.6, // < 60% accuracy
          levels: [1, 2],
          distribution: [0.3, 0.7],
        },
        {
          name: "DEVELOPING",
          threshold: 0.8, // < 80% accuracy
          levels: [2, 3],
          distribution: [0.4, 0.6],
        },
        {
          name: "PROFICIENT",
          threshold: Infinity, // >= 80% accuracy
          levels: [3, 4],
          distribution: [0.5, 0.5],
        },
      ],
      PAGE_3: [
        {
          name: "STRUGGLING",
          threshold: 0.5, // < 50% accuracy
          levels: [1, 2],
          distribution: [0.6, 0.4],
        },
        {
          name: "DEVELOPING",
          threshold: 0.65, // < 65% accuracy
          levels: [2, 3],
          distribution: [0.5, 0.5],
        },
        {
          name: "PROFICIENT",
          threshold: 0.8, // < 80% accuracy
          levels: [3, 4],
          distribution: [0.4, 0.6],
        },
        {
          name: "ADVANCED",
          threshold: 0.9, // < 90% accuracy
          levels: [4, 5],
          distribution: [0.3, 0.7],
        },
        {
          name: "EXCEPTIONAL",
          threshold: Infinity, // >= 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
      ],
    },

    // 8th Grade - Similar to 7th but slightly more challenging
    "8th Grade": {
      PAGE_1: {
        levels: [2, 3],
        distribution: [0.3, 0.7],
      },
      PAGE_2: [
        {
          name: "STRUGGLING",
          threshold: 0.6, // < 60% accuracy
          levels: [1, 2],
          distribution: [0.2, 0.8],
        },
        {
          name: "DEVELOPING",
          threshold: 0.8, // < 80% accuracy
          levels: [2, 3],
          distribution: [0.3, 0.7],
        },
        {
          name: "PROFICIENT",
          threshold: Infinity, // >= 80% accuracy
          levels: [3, 4],
          distribution: [0.4, 0.6],
        },
      ],
      PAGE_3: [
        {
          name: "STRUGGLING",
          threshold: 0.5, // < 50% accuracy
          levels: [1, 2],
          distribution: [0.5, 0.5],
        },
        {
          name: "DEVELOPING",
          threshold: 0.65, // < 65% accuracy
          levels: [2, 3],
          distribution: [0.4, 0.6],
        },
        {
          name: "PROFICIENT",
          threshold: 0.8, // < 80% accuracy
          levels: [3, 4],
          distribution: [0.3, 0.7],
        },
        {
          name: "ADVANCED",
          threshold: 0.9, // < 90% accuracy
          levels: [4, 5],
          distribution: [0.2, 0.8],
        },
        {
          name: "EXCEPTIONAL",
          threshold: Infinity, // >= 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
      ],
    },

    // 9th Grade - High school level
    "9th Grade": {
      PAGE_1: {
        levels: [3],
        distribution: [1.0],
      },
      PAGE_2: [
        {
          name: "STRUGGLING",
          threshold: 0.6, // < 60% accuracy
          levels: [2, 3],
          distribution: [0.3, 0.7],
        },
        {
          name: "DEVELOPING",
          threshold: 0.8, // < 80% accuracy
          levels: [3, 4],
          distribution: [0.5, 0.5],
        },
        {
          name: "PROFICIENT",
          threshold: Infinity, // >= 80% accuracy
          levels: [4, 5],
          distribution: [0.4, 0.6],
        },
      ],
      PAGE_3: [
        {
          name: "STRUGGLING",
          threshold: 0.5, // < 50% accuracy
          levels: [2, 3],
          distribution: [0.4, 0.6],
        },
        {
          name: "DEVELOPING",
          threshold: 0.65, // < 65% accuracy
          levels: [3, 4],
          distribution: [0.5, 0.5],
        },
        {
          name: "PROFICIENT",
          threshold: 0.8, // < 80% accuracy
          levels: [4, 5],
          distribution: [0.4, 0.6],
        },
        {
          name: "ADVANCED",
          threshold: 0.9, // < 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
        {
          name: "EXCEPTIONAL",
          threshold: Infinity, // >= 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
      ],
    },

    // 10th Grade - Similar to 9th but more challenging
    "10th Grade": {
      PAGE_1: {
        levels: [3, 4],
        distribution: [0.6, 0.4],
      },
      PAGE_2: [
        {
          name: "STRUGGLING",
          threshold: 0.6, // < 60% accuracy
          levels: [2, 3],
          distribution: [0.2, 0.8],
        },
        {
          name: "DEVELOPING",
          threshold: 0.8, // < 80% accuracy
          levels: [3, 4],
          distribution: [0.4, 0.6],
        },
        {
          name: "PROFICIENT",
          threshold: Infinity, // >= 80% accuracy
          levels: [4, 5],
          distribution: [0.3, 0.7],
        },
      ],
      PAGE_3: [
        {
          name: "STRUGGLING",
          threshold: 0.5, // < 50% accuracy
          levels: [2, 3],
          distribution: [0.3, 0.7],
        },
        {
          name: "DEVELOPING",
          threshold: 0.65, // < 65% accuracy
          levels: [3, 4],
          distribution: [0.4, 0.6],
        },
        {
          name: "PROFICIENT",
          threshold: 0.8, // < 80% accuracy
          levels: [4, 5],
          distribution: [0.3, 0.7],
        },
        {
          name: "ADVANCED",
          threshold: 0.9, // < 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
        {
          name: "EXCEPTIONAL",
          threshold: Infinity, // >= 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
      ],
    },

    // 11th Grade - Advanced high school
    "11th Grade": {
      PAGE_1: {
        levels: [3, 4],
        distribution: [0.4, 0.6],
      },
      PAGE_2: [
        {
          name: "STRUGGLING",
          threshold: 0.6, // < 60% accuracy
          levels: [3],
          distribution: [1.0],
        },
        {
          name: "DEVELOPING",
          threshold: 0.8, // < 80% accuracy
          levels: [3, 4],
          distribution: [0.3, 0.7],
        },
        {
          name: "PROFICIENT",
          threshold: Infinity, // >= 80% accuracy
          levels: [4, 5],
          distribution: [0.2, 0.8],
        },
      ],
      PAGE_3: [
        {
          name: "STRUGGLING",
          threshold: 0.5, // < 50% accuracy
          levels: [3],
          distribution: [1.0],
        },
        {
          name: "DEVELOPING",
          threshold: 0.65, // < 65% accuracy
          levels: [3, 4],
          distribution: [0.3, 0.7],
        },
        {
          name: "PROFICIENT",
          threshold: 0.8, // < 80% accuracy
          levels: [4, 5],
          distribution: [0.2, 0.8],
        },
        {
          name: "ADVANCED",
          threshold: 0.9, // < 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
        {
          name: "EXCEPTIONAL",
          threshold: Infinity, // >= 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
      ],
    },

    // 12th Grade - Most challenging
    "12th Grade": {
      PAGE_1: {
        levels: [4],
        distribution: [1.0],
      },
      PAGE_2: [
        {
          name: "STRUGGLING",
          threshold: 0.6, // < 60% accuracy
          levels: [3, 4],
          distribution: [0.4, 0.6],
        },
        {
          name: "DEVELOPING",
          threshold: 0.8, // < 80% accuracy
          levels: [4],
          distribution: [1.0],
        },
        {
          name: "PROFICIENT",
          threshold: Infinity, // >= 80% accuracy
          levels: [4, 5],
          distribution: [0.1, 0.9],
        },
      ],
      PAGE_3: [
        {
          name: "STRUGGLING",
          threshold: 0.5, // < 50% accuracy
          levels: [3, 4],
          distribution: [0.2, 0.8],
        },
        {
          name: "DEVELOPING",
          threshold: 0.65, // < 65% accuracy
          levels: [4],
          distribution: [1.0],
        },
        {
          name: "PROFICIENT",
          threshold: 0.8, // < 80% accuracy
          levels: [4, 5],
          distribution: [0.1, 0.9],
        },
        {
          name: "ADVANCED",
          threshold: 0.9, // < 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
        {
          name: "EXCEPTIONAL",
          threshold: Infinity, // >= 90% accuracy
          levels: [5],
          distribution: [1.0],
        },
      ],
    },
  },

  // Problem generation constraints
  PROBLEM_GENERATION: {
    MIN_PROBLEMS_PER_PAGE: 3,
    MAX_PROBLEMS_PER_PAGE: 15,
    TARGET_TIME_BUFFER: 0.9, // Use 90% of available time to allow for buffer
    MAX_GENERATION_ATTEMPTS: 50, // Maximum attempts to generate problems within time constraints
  },
};

module.exports = CONFIG;
