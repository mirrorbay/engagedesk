/**
 * Celebration Configuration
 * Defines celebration logic, levels, messages, and thresholds
 * Visual aspects (icons, colors) are handled by the frontend
 */

const CELEBRATION_CONFIG = {
    // Celebration level definitions with score ranges
    LEVELS: [
        // Level 0: 0-59% - Encouragement
        {
            minScore: 0,
            maxScore: 59,
            message: "Keep practicing - you're learning!",
            subMessage: "Every expert was once a beginner. Don't give up!",
            intensity: 0
        },
        // Level 1: 60-64% - Basic happiness
        {
            minScore: 60,
            maxScore: 64,
            message: "Good job! You're getting there!",
            subMessage: "Keep practicing to improve even more!",
            intensity: 1
        },
        // Level 2: 65-69% - More enthusiasm
        {
            minScore: 65,
            maxScore: 69,
            message: "Nice work! You're doing well!",
            subMessage: "You're building solid math skills!",
            intensity: 2
        },
        // Level 3: 70-74% - Good progress
        {
            minScore: 70,
            maxScore: 74,
            message: "Great job! You're really improving!",
            subMessage: "Your hard work is paying off!",
            intensity: 3
        },
        // Level 4: 75-79% - Very good
        {
            minScore: 75,
            maxScore: 79,
            message: "Excellent work! You're a star!",
            subMessage: "You're mastering these concepts!",
            intensity: 4
        },
        // Level 5: 80-84% - Outstanding
        {
            minScore: 80,
            maxScore: 84,
            message: "Outstanding! You're sparkling!",
            subMessage: "Your math skills are really shining!",
            intensity: 5
        },
        // Level 6: 85-89% - Fantastic
        {
            minScore: 85,
            maxScore: 89,
            message: "Fantastic! We love your progress!",
            subMessage: "You're becoming a math champion!",
            intensity: 6
        },
        // Level 7: 90-94% - Amazing
        {
            minScore: 90,
            maxScore: 94,
            message: "Amazing! You deserve a trophy!",
            subMessage: "You're at the top of your game!",
            intensity: 7
        },
        // Level 8: 95-100% - Perfect/Near perfect
        {
            minScore: 95,
            maxScore: 100,
            message: "INCREDIBLE! Time to celebrate!",
            subMessage: "You're a true math superstar!",
            intensity: 8
        }
    ]
};

module.exports = CELEBRATION_CONFIG;
