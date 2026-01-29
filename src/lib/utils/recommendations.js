import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as BookModel from '@/lib/mongodb/models/Book';

/**
 * Calculate Jaccard similarity between two tag arrays
 * @param {Array} tags1 - First array of tag ObjectIds or tag objects
 * @param {Array} tags2 - Second array of tag ObjectIds or tag objects
 * @returns {number} Similarity score between 0 and 1
 */
export function calculateTagSimilarity(tags1, tags2) {
  if (!tags1 || !tags2 || tags1.length === 0 || tags2.length === 0) {
    return 0;
  }

  // Convert to string arrays for comparison
  const set1 = new Set(tags1.map(t => t.toString ? t.toString() : (t._id ? t._id.toString() : t)));
  const set2 = new Set(tags2.map(t => t.toString ? t.toString() : (t._id ? t._id.toString() : t)));

  // Calculate intersection
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  
  // Calculate union
  const union = new Set([...set1, ...set2]);

  // Jaccard similarity = intersection / union
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Get recommendations based on tag similarity
 */
export async function getRecommendationsByTags(contentId, contentType, limit = 6) {
  try {
    // Get the source content
    let sourceContent;
    if (contentType === 'blog') {
      sourceContent = await BlogModel.getBlogById(contentId);
    } else if (contentType === 'book') {
      sourceContent = await BookModel.getBookById(contentId);
    }

    if (!sourceContent || !sourceContent.tags || sourceContent.tags.length === 0) {
      return [];
    }

    // Get all published content of the same type
    const filter = { isPublished: true };
    const { ObjectId } = await import('mongodb');
    const contentIdObj = typeof contentId === 'string' ? new ObjectId(contentId) : contentId;
    filter._id = { $ne: contentIdObj };

    let allContent;
    if (contentType === 'blog') {
      const result = await BlogModel.getBlogs(filter, { limit: 100, populate: true });
      allContent = result.blogs || [];
    } else {
      const result = await BookModel.getBooks(filter, { limit: 100, populate: true });
      allContent = result.books || [];
    }

    // Calculate similarity scores
    const scoredContent = allContent.map(item => {
      const similarity = calculateTagSimilarity(sourceContent.tags, item.tags || []);
      return {
        ...item,
        similarity,
        score: similarity,
      };
    });

    // Sort by similarity and return top results
    return scoredContent
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .filter(item => item.similarity > 0);
  } catch (error) {
    console.error('Error getting tag-based recommendations:', error);
    return [];
  }
}

/**
 * Get recommendations based on category
 */
export async function getRecommendationsByCategory(contentId, contentType, limit = 6) {
  try {
    // Get the source content
    let sourceContent;
    if (contentType === 'blog') {
      sourceContent = await BlogModel.getBlogById(contentId);
    } else if (contentType === 'book') {
      sourceContent = await BookModel.getBookById(contentId);
    }

    if (!sourceContent || !sourceContent.category) {
      return [];
    }

    // Get content with same category
    const { ObjectId } = await import('mongodb');
    const categoryId = sourceContent.category;
    const contentIdObj = typeof contentId === 'string' ? new ObjectId(contentId) : contentId;

    const filter = {
      isPublished: true,
      category: categoryId,
      _id: { $ne: contentIdObj },
    };

    let result;
    if (contentType === 'blog') {
      result = await BlogModel.getBlogs(filter, { limit, sort: { views: -1, createdAt: -1 }, populate: true });
      return result.blogs || [];
    } else {
      result = await BookModel.getBooks(filter, { limit, sort: { views: -1, publishedAt: -1 }, populate: true });
      return result.books || [];
    }
  } catch (error) {
    console.error('Error getting category-based recommendations:', error);
    return [];
  }
}

/**
 * Get trending content based on views and engagement
 */
export async function getTrendingContent(contentType, limit = 6, days = 7) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const filter = {
      isPublished: true,
      createdAt: { $gte: cutoffDate },
    };

    let result;
    if (contentType === 'blog') {
      result = await BlogModel.getBlogs(filter, {
        limit,
        sort: { views: -1, createdAt: -1 },
        populate: true,
      });
      return result.blogs || [];
    } else {
      result = await BookModel.getBooks(filter, {
        limit,
        sort: { views: -1, publishedAt: -1 },
        populate: true,
      });
      return result.books || [];
    }
  } catch (error) {
    console.error('Error getting trending content:', error);
    return [];
  }
}

/**
 * Get personalized recommendations (combines multiple signals)
 */
export async function getPersonalizedRecommendations(contentId, contentType, limit = 6) {
  try {
    // Get recommendations from multiple sources
    const [tagBased, categoryBased, trending] = await Promise.all([
      getRecommendationsByTags(contentId, contentType, limit * 2),
      getRecommendationsByCategory(contentId, contentType, limit * 2),
      getTrendingContent(contentType, limit, 30),
    ]);

    // Combine and deduplicate
    const contentMap = new Map();
    
    // Add tag-based (highest weight)
    tagBased.forEach(item => {
      const id = item._id.toString();
      if (!contentMap.has(id)) {
        contentMap.set(id, { ...item, score: item.similarity * 3 }); // Weight: 3
      }
    });

    // Add category-based (medium weight)
    categoryBased.forEach(item => {
      const id = item._id.toString();
      if (contentMap.has(id)) {
        contentMap.get(id).score += 2; // Weight: 2
      } else {
        contentMap.set(id, { ...item, score: 2 });
      }
    });

    // Add trending (lower weight)
    trending.forEach(item => {
      const id = item._id.toString();
      if (contentMap.has(id)) {
        contentMap.get(id).score += 1; // Weight: 1
      } else if (contentMap.size < limit) {
        contentMap.set(id, { ...item, score: 1 });
      }
    });

    // Sort by score and return top results
    return Array.from(contentMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
}


