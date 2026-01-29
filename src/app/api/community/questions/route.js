import { NextResponse } from 'next/server';
import * as QuestionModel from '@/lib/mongodb/models/CommunityQuestion';
import * as UserModel from '@/lib/mongodb/models/CommunityUser';
import { verifyToken } from '@/lib/auth/verify';
import { sanitizeTitle, sanitizeText, sanitizeTags, checkRateLimit } from '@/lib/utils/sanitize';

// GET /api/community/questions - Get all questions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const sort = searchParams.get('sort') || 'newest';
    const search = searchParams.get('search');

    const filter = {};
    if (status) filter.status = status;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    let sortOption = { isPinned: -1, createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { isPinned: -1, upvoteCount: -1, createdAt: -1 };
    } else if (sort === 'trending') {
      sortOption = { isPinned: -1, lastActivityAt: -1, upvoteCount: -1 };
    }

    const result = await QuestionModel.getQuestions(filter, {
      page,
      limit,
      sort: sortOption,
    });

    return NextResponse.json({
      success: true,
      questions: result.questions,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST /api/community/questions - Create new question
export async function POST(request) {
  try {
    const body = await request.json();
    let { title, content, tags, status, authorName, authorEmail } = body;

    // Rate limiting
    const identifier = authorEmail || request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(identifier, 10, 3600000)) { // 10 questions per hour
      return NextResponse.json(
        { success: false, error: 'Too many questions. Please try again later.' },
        { status: 429 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    title = sanitizeTitle(title, 200);
    content = sanitizeText(content, 50000);
    tags = sanitizeTags(tags || [], 10);

    // Get or create user
    let user = null;
    let authorId = null;
    let finalAuthorName = authorName;
    let finalAuthorEmail = authorEmail;

    const token = await verifyToken();
    if (token && token.email) {
      user = await UserModel.getCommunityUserByEmail(token.email);
      if (user) {
        authorId = user._id.toString();
        finalAuthorName = user.displayName || user.username;
        finalAuthorEmail = user.email;
      }
    }

    if (!user && finalAuthorEmail) {
      user = await UserModel.getCommunityUserByEmail(finalAuthorEmail);
      if (!user) {
        const newUser = await UserModel.createCommunityUser({
          email: finalAuthorEmail,
          name: finalAuthorName || 'Guest',
          displayName: finalAuthorName || 'Guest',
        });
        if (newUser.success) {
          user = newUser.user;
          authorId = user._id.toString();
          finalAuthorName = user.displayName || user.username;
        }
      } else {
        authorId = user._id.toString();
        finalAuthorName = user.displayName || user.username;
        finalAuthorEmail = user.email;
      }
    }

    const questionData = {
      title,
      content,
      tags: tags || [],
      status: status || 'open',
      authorId,
      authorName: finalAuthorName || 'Anonymous',
      authorEmail: finalAuthorEmail || '',
    };

    const result = await QuestionModel.createQuestion(questionData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to create question' },
        { status: 400 }
      );
    }

    // Increment user question count
    if (user && authorId) {
      await UserModel.incrementQuestionCount(authorId);
      await UserModel.incrementReputation(authorId, 5);
    }

    return NextResponse.json({
      success: true,
      question: result.question,
      message: 'Question created successfully',
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

