/**
 * Configuration file for delivery controller
 * Contains all constants for session management and delivery
 */

const CONFIG = {
    // Study time constraints (in minutes)
    MIN_STUDY_TIME: 6,
    MAX_STUDY_TIME: 20,
    DEFAULT_STUDY_TIME: 12,

    // Page configuration based on study time
    PAGE_CONFIG: {
        SHORT_SESSION_PAGES: 2,  // <= 8 minutes
        LONG_SESSION_PAGES: 3,   // > 8 minutes
        SHORT_SESSION_THRESHOLD: 8
    }
};

module.exports = CONFIG;
