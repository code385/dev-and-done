/**
 * Bookmark management utilities using localStorage
 */

const STORAGE_KEY = 'devanddone_bookmarks';
const PROGRESS_KEY = 'devanddone_reading_progress';

/**
 * Get all bookmarks from localStorage
 * @returns {Array} Array of bookmarked items
 */
export function getBookmarks() {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading bookmarks:', error);
    return [];
  }
}

/**
 * Add a bookmark
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content (blog, book, etc.)
 * @param {string} title - Title of the content
 * @param {string} url - URL of the content
 * @param {string} image - Optional image URL
 */
export function addBookmark(contentId, contentType, title, url, image = '') {
  if (typeof window === 'undefined') return false;
  
  try {
    const bookmarks = getBookmarks();
    
    // Check if already bookmarked
    if (bookmarks.some(b => b.contentId === contentId && b.contentType === contentType)) {
      return false;
    }
    
    const bookmark = {
      contentId,
      contentType,
      title,
      url,
      image,
      createdAt: new Date().toISOString(),
    };
    
    bookmarks.push(bookmark);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return true;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
}

/**
 * Remove a bookmark
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content
 */
export function removeBookmark(contentId, contentType) {
  if (typeof window === 'undefined') return false;
  
  try {
    const bookmarks = getBookmarks();
    const filtered = bookmarks.filter(
      b => !(b.contentId === contentId && b.contentType === contentType)
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
}

/**
 * Check if content is bookmarked
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content
 * @returns {boolean}
 */
export function isBookmarked(contentId, contentType) {
  if (typeof window === 'undefined') return false;
  
  const bookmarks = getBookmarks();
  return bookmarks.some(
    b => b.contentId === contentId && b.contentType === contentType
  );
}

/**
 * Get reading progress for content
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content
 * @returns {number} Progress percentage (0-100)
 */
export function getReadingProgress(contentId, contentType) {
  if (typeof window === 'undefined') return 0;
  
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    const key = `${contentType}_${contentId}`;
    return progress[key] || 0;
  } catch (error) {
    console.error('Error reading progress:', error);
    return 0;
  }
}

/**
 * Save reading progress
 * @param {string} contentId - ID of the content
 * @param {string} contentType - Type of content
 * @param {number} percentage - Progress percentage (0-100)
 */
export function saveReadingProgress(contentId, contentType, percentage) {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    const progress = stored ? JSON.parse(stored) : {};
    const key = `${contentType}_${contentId}`;
    progress[key] = Math.min(100, Math.max(0, percentage));
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    
    // Optionally sync to server
    fetch('/api/reading-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentId,
        contentType,
        percentage: progress[key],
      }),
    }).catch(() => {}); // Silently fail if sync fails
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Get all reading progress
 * @returns {Object} Progress object with keys as contentType_contentId
 */
export function getAllReadingProgress() {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading all progress:', error);
    return {};
  }
}

