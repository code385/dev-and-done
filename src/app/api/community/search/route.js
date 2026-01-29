import { NextResponse } from 'next/server';
import * as PostModel from '@/lib/mongodb/models/CommunityPost';
import * as QuestionModel from '@/lib/mongodb/models/CommunityQuestion';

// GET /api/community/search - Full-text search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type') || 'all'; // all, posts, questions
    const tags = searchParams.get('tags');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const filter = { $text: { $search: q } };
    if (tags) {
      const tagArray = tags.split(',').map(t => t.trim());
      filter.tags = { $in: tagArray };
    }

    const results = {
      posts: [],
      questions: [],
    };

    if (type === 'all' || type === 'posts') {
      const postsResult = await PostModel.getPosts(filter, { limit: Math.ceil(limit / 2) });
      results.posts = postsResult.posts || [];
    }

    if (type === 'all' || type === 'questions') {
      const questionsResult = await QuestionModel.getQuestions(filter, { limit: Math.floor(limit / 2) });
      results.questions = questionsResult.questions || [];
    }

    return NextResponse.json({
      success: true,
      results,
      query: q,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search' },
      { status: 500 }
    );
  }
}

