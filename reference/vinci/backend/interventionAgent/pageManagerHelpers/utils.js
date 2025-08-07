/**
 * Utility functions for time calculations in pagination controller
 * Handles accurate time tracking for pages and individual problems
 */

/**
 * Calculate user's time spent on a page
 * Time = gap between page's presented_at and page's submitted_at
 * @param {Object} page - The page object with presented_at and submitted_at
 * @returns {number} Time spent in seconds, or 0 if page not submitted
 */
function calculatePageTime(page) {
    if (!page.presented_at || !page.submitted_at) {
        return 0;
    }
    
    const startTime = new Date(page.presented_at);
    const endTime = new Date(page.submitted_at);
    
    return Math.max(0, (endTime - startTime) / 1000);
}

/**
 * Calculate user's time spent on individual problems within a page
 * For each problem: time = gap between this problem's latest input timestamp 
 * and the closest input_answer timestamp before it across the entire page
 * (or page's presented_at if no prior input exists)
 * @param {Object} page - The page object with problems
 * @returns {Object} Object with totalTimeSeconds and problemTimes array
 */
function calculateProblemTimes(page) {
    if (!page.problems || page.problems.length === 0) {
        return {
            totalTimeSeconds: 0,
            problemTimes: []
        };
    }
    
    const problemTimes = [];
    const pageStartTime = new Date(page.presented_at);
    
    // Get all input answer timestamps from all problems on the page, sorted chronologically
    const allTimestamps = [];
    page.problems.forEach(problem => {
        if (problem.input_answer && problem.input_answer.length > 0) {
            problem.input_answer.forEach(input => {
                allTimestamps.push({
                    timestamp: new Date(input.timestamp),
                    problemSequence: problem.sequence_number
                });
            });
        }
    });
    allTimestamps.sort((a, b) => a.timestamp - b.timestamp);
    
    // Process each problem that has been answered
    page.problems.forEach(problem => {
        if (!problem.input_answer || problem.input_answer.length === 0) {
            return; // Skip unanswered problems
        }
        
        // Get this problem's latest input timestamp
        const latestInput = problem.input_answer[problem.input_answer.length - 1];
        const problemEndTime = new Date(latestInput.timestamp);
        
        // Find the closest input timestamp before this problem's latest timestamp
        let startTime = pageStartTime; // Default to page start
        
        for (let i = allTimestamps.length - 1; i >= 0; i--) {
            const timestamp = allTimestamps[i];
            
            // Skip if this timestamp is from the same problem's latest input
            if (timestamp.problemSequence === problem.sequence_number && 
                timestamp.timestamp.getTime() === problemEndTime.getTime()) {
                continue;
            }
            
            // If this timestamp is before our problem's end time, use it as start time
            if (timestamp.timestamp < problemEndTime) {
                startTime = timestamp.timestamp;
                break;
            }
        }
        
        const timeSpent = Math.max(0, (problemEndTime - startTime) / 1000);
        
        problemTimes.push({
            sequence_number: problem.sequence_number,
            timeSpent: timeSpent
        });
    });
    
    const totalTimeSeconds = problemTimes.reduce((sum, pt) => sum + pt.timeSpent, 0);
    
    return {
        totalTimeSeconds,
        problemTimes
    };
}

module.exports = {
    calculatePageTime,
    calculateProblemTimes
};
