import { NextResponse } from 'next/server';
import { sendContactEmail, sendConfirmationEmail, sendEstimateEmail, sendNewsletterConfirmation } from '@/lib/emailjs/send';

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'contact':
        result = await sendContactEmail(data);
        break;
      case 'confirmation':
        result = await sendConfirmationEmail(data);
        break;
      case 'estimate':
        result = await sendEstimateEmail(data);
        break;
      case 'newsletter':
        result = await sendNewsletterConfirmation(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('EmailJS API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

