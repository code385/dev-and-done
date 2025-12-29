import { NextResponse } from 'next/server';
import { createContact } from '@/lib/mongodb/models/Contact';
import { sanitizeInput, sanitizeEmail } from '@/lib/security/sanitize';

// Rate limiting store
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 3; // Lower limit for contact form

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

// Using enhanced sanitization from security module

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

    const data = await request.json();

    // Honeypot check
    if (data.honeypot) {
      // Bot detected, return success to avoid revealing the honeypot
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(data.email);
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: sanitizedEmail,
      company: sanitizeInput(data.company || ''),
      message: sanitizeInput(data.message),
    };

    // Store in MongoDB
    try {
      const contactData = {
        ...sanitizedData,
        source: 'contact_form',
        ip: ip,
      };
      
      const dbResult = await createContact(contactData);
      
      if (!dbResult.success) {
        console.error('Failed to save contact to database');
        // Continue anyway - don't fail the request if DB fails
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue - email will still be sent via EmailJS on client side
    }

    // EmailJS will be handled on the client side
    // Return success so client can trigger EmailJS
    return NextResponse.json({ 
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

