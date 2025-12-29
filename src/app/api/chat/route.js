import { NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/ai/chat';
import { createChatConversation, updateChatConversation, getChatConversations } from '@/lib/mongodb/models/ChatConversation';

// Rate limiting store (in production, use Redis or similar)
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;

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

    const { messages, sessionId } = await request.json();

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Sanitize messages (basic sanitization)
    const sanitizedMessages = messages.map((msg) => ({
      role: msg.role,
      content: String(msg.content).slice(0, 2000), // Limit message length
    }));

    // Get API key from environment
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    // Generate response
    const response = await generateChatResponse(sanitizedMessages, apiKey);

    // Store conversation in MongoDB (non-blocking)
    try {
      if (sessionId) {
        // Check if conversation exists
        const existing = await getChatConversations({ sessionId }, 1);
        
        if (existing.length > 0) {
          // Update existing conversation
          await updateChatConversation(existing[0]._id, {
            messages: sanitizedMessages,
            lastMessage: sanitizedMessages[sanitizedMessages.length - 1],
          });
        } else {
          // Create new conversation
          await createChatConversation({
            sessionId,
            messages: sanitizedMessages,
            ip: ip,
            source: 'ai_chat',
          });
        }
      }
    } catch (dbError) {
      console.error('Failed to save chat conversation:', dbError);
      // Continue - don't fail the request if DB fails
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

