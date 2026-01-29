import { NextResponse } from 'next/server';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as BookModel from '@/lib/mongodb/models/Book';
import {
  getRecommendationsByTags,
  getRecommendationsByCategory,
  getTrendingContent,
  getPersonalizedRecommendations,
} from '@/lib/utils/recommendations';

// GET /api/recommendations - Get content recommendations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('type'); // blog or book
    const contentId = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '6');
    const strategy = searchParams.get('strategy') || 'personalized'; // tags, category, trending, personalized

    let recommendations = [];
    let reason = '';

    if (contentType && contentId) {
      // Get recommendations for specific content
      switch (strategy) {
        case 'tags':
          recommendations = await getRecommendationsByTags(contentId, contentType, limit);
          reason = 'Similar tags';
          break;
        case 'category':
          recommendations = await getRecommendationsByCategory(contentId, contentType, limit);
          reason = 'Same category';
          break;
        case 'trending':
          recommendations = await getTrendingContent(contentType, limit, 7);
          reason = 'Trending now';
          break;
        default: // personalized
          recommendations = await getPersonalizedRecommendations(contentId, contentType, limit);
          reason = 'Recommended for you';
      }
    } else {
      // Get trending content when no specific content is provided
      try {
        const trendingBlogs = await getTrendingContent('blog', Math.floor(limit / 2), 7);
        const trendingBooks = await getTrendingContent('book', Math.floor(limit / 2), 7);
        recommendations = [...trendingBlogs, ...trendingBooks]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, limit);
        reason = 'Trending content';
      } catch (error) {
        console.error('Error fetching trending content:', error);
      }
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations.slice(0, limit),
      reason,
      strategy,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}

