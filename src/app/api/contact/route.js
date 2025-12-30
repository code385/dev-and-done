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
      // Continue - email will still be sent via server-side email service
    }

    // Send emails via server-side email service
    try {
      const { sendContactEmail, sendContactConfirmationEmail } = await import('@/lib/email/service');
      
      // Send notification to admin (non-blocking)
      sendContactEmail({
        name: sanitizedData.name,
        email: sanitizedData.email,
        company: sanitizedData.company,
        message: sanitizedData.message,
      }).catch((emailError) => {
        console.error('Error sending admin notification:', emailError);
      });
      
      // Send confirmation to user (non-blocking)
      sendContactConfirmationEmail({
        name: sanitizedData.name,
        email: sanitizedData.email,
        message: sanitizedData.message,
      }).catch((emailError) => {
        console.error('Error sending confirmation email:', emailError);
      });
    } catch (emailError) {
      console.error('Error importing email service:', emailError);
      // Don't fail the request if email fails
    }

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

