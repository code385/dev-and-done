/**
 * Calculate reading time in minutes based on text content
 * @param {string} content - The text content to analyze
 * @returns {number} Reading time in minutes
 */
export function calculateReadingTime(content) {
  if (!content) return 0;

  // Remove HTML tags if present
  const text = content.replace(/<[^>]*>/g, '');
  
  // Count words (split by whitespace)
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  
  // Average reading speed: 200-250 words per minute
  // Using 225 as a middle ground
  const wordsPerMinute = 225;
  
  const minutes = Math.ceil(words.length / wordsPerMinute);
  
  // Minimum 1 minute
  return Math.max(1, minutes);
}

/**
 * Format reading time as a string
 * @param {number} minutes - Reading time in minutes
 * @returns {string} Formatted reading time (e.g., "5 min read")
 */
export function formatReadingTime(minutes) {
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}

/**
 * Calculate and format reading time from content
 * @param {string} content - The text content
 * @returns {string} Formatted reading time
 */
export function getReadingTime(content) {
  const minutes = calculateReadingTime(content);
  return formatReadingTime(minutes);
}

