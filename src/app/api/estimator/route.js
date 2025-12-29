import { NextResponse } from 'next/server';
import { estimateProject } from '@/lib/ai/estimator';
import { createProjectEstimate } from '@/lib/mongodb/models/ProjectEstimate';

// Rate limiting store
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5; // Lower limit for estimator

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const limit = rateLimitMap.get(ip);
  if (now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (limit.count >= maxRequests) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { answers } = await request.json();

    // Validate input
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    // Generate estimate
    const estimate = await estimateProject(answers, apiKey);

    // Store estimate in MongoDB (non-blocking)
    try {
      const estimateData = {
        answers,
        estimate,
        ip: ip,
        source: 'project_estimator',
      };
      
      await createProjectEstimate(estimateData);
    } catch (dbError) {
      console.error('Failed to save estimate to database:', dbError);
      // Continue - don't fail the request if DB fails
    }

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Estimator API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

