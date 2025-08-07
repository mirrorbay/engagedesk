/**
 * Utility functions for formatting data
 */

/**
 * Format a number with commas for thousands separator
 * @param {number} num - The number to format
 * @returns {string} - The formatted number string
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

/**
 * Format a percentage with specified decimal places
 * @param {number} num - The number to format as percentage
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} - The formatted percentage string
 */
export const formatPercentage = (num, decimals = 0) => {
  return `${num.toFixed(decimals)}%`;
};

/**
 * Format date and time for session display
 * @param {string} startDate - The start date string
 * @param {string} endDate - The end date string (optional)
 * @returns {string} - The formatted date and time string
 */
export const formatDateTime = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  
  const dateStr = start.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const startTime = start.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  if (end) {
    const endTime = end.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${dateStr} • ${startTime} - ${endTime}`;
  }
  
  return `${dateStr} • ${startTime}`;
};

/**
 * Format answer for display, handling empty answers and numeric formatting
 * @param {string|number} answer - The answer to format
 * @returns {string} - The formatted answer string
 */
export const formatAnswer = (answer) => {
  if (!answer || answer.toString().trim() === '') {
    return 'No answer';
  }
  
  // Try to parse as number for formatting
  const numericAnswer = parseFloat(answer);
  if (!isNaN(numericAnswer) && isFinite(numericAnswer)) {
    return formatNumber(numericAnswer);
  }
  
  // Return as-is if not a valid number
  return answer.toString();
};

/**
 * Format time in seconds to minutes display
 * @param {number} seconds - The time in seconds
 * @returns {string} - The formatted time string (e.g., "5m")
 */
export const formatTime = (seconds) => {
  const minutes = Math.round(seconds / 60);
  if (minutes === 0) {
    return `1 min`;
  }
  return `${minutes} min`;
};

/**
 * Get concept display name from concepts array
 * @param {string} conceptId - The concept ID to look up
 * @param {Array} concepts - Array of concept objects
 * @returns {string} - The display name or the conceptId if not found
 */
export const getConceptDisplayName = (conceptId, concepts) => {
  const concept = concepts.find(c => c.id === conceptId);
  return concept ? concept.displayName : conceptId;
};

/**
 * Format date with time for session display (Home.jsx style)
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format duration in seconds to minutes display
 * @param {number} seconds - The time in seconds
 * @returns {string} - The formatted duration string (e.g., "5 mins")
 */
export const formatDuration = (seconds) => {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min${minutes !== 1 ? 's' : ''}`;
};

/**
 * Format time in seconds to MM:SS format for study timer
 * @param {number} seconds - The time in seconds
 * @returns {string} - The formatted time string (e.g., "05:30")
 */
export const formatStudyTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format target time in seconds to minutes display
 * @param {number} seconds - The time in seconds
 * @returns {string} - The formatted target time string (e.g., "12 mins")
 */
export const formatTargetTime = (seconds) => {
  const minutes = Math.round(seconds / 60);
  return `${minutes} min${minutes !== 1 ? 's' : ''}`;
};

/**
 * Get category display name for concept categories
 * @param {string} category - The category ID
 * @returns {string} - The formatted category display name
 */
export const getCategoryDisplayName = (category) => {
  switch (category) {
    case 'basic':
      return 'Basic Arithmetic';
    case 'mixed':
      return 'Mixed Arithmetic';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

/**
 * Calculate actual study time from start and end dates
 * @param {string} startDate - The session start date string
 * @param {string} endDate - The session end date string
 * @returns {number} - The time difference in seconds
 */
export const calculateActualStudyTime = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return 0;
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  return Math.floor((end - start) / 1000); // Convert to seconds
};
