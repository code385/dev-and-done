// Email service using Resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@devanddone.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@devanddone.com';

/**
 * Check if email service is configured
 */
export function isEmailConfigured() {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Send contact form email to admin
 */
export async function sendContactEmail(data) {
  if (!isEmailConfigured()) {
    console.warn('Resend API key not configured. Skipping email send.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Contact Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.name)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0; color: #1f2937;">
                      <a href="mailto:${escapeHtml(data.email)}" style="color: #667eea; text-decoration: none;">${escapeHtml(data.email)}</a>
                    </td>
                  </tr>
                  ${data.company ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Company:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.company)}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Message</h2>
                <div style="color: #374151; white-space: pre-wrap; line-height: 1.8;">${escapeHtml(data.message)}</div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                <a href="mailto:${escapeHtml(data.email)}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Reply to ${escapeHtml(data.name)}</a>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
              <p>This email was sent from the DevAndDone contact form.</p>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

Contact Information:
Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ''}

Message:
${data.message}

---
Reply to: ${data.email}
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error('Error sending contact email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send service booking email to admin
 */
export async function sendServiceBookingEmail(data) {
  if (!isEmailConfigured()) {
    console.warn('Resend API key not configured. Skipping email send.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const bookingDate = new Date(data.bookingDate);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.clientEmail,
      subject: `New Service Booking: ${data.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Service Booking</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">New Service Booking</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Service Details</h2>
                <p style="font-size: 18px; font-weight: 600; color: #667eea; margin: 10px 0;">${escapeHtml(data.serviceName)}</p>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Client Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.clientName)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0; color: #1f2937;">
                      <a href="mailto:${escapeHtml(data.clientEmail)}" style="color: #667eea; text-decoration: none;">${escapeHtml(data.clientEmail)}</a>
                    </td>
                  </tr>
                  ${data.clientPhone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0; color: #1f2937;">
                      <a href="tel:${escapeHtml(data.clientPhone)}" style="color: #667eea; text-decoration: none;">${escapeHtml(data.clientPhone)}</a>
                    </td>
                  </tr>
                  ` : ''}
                  ${data.company ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Company:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.company)}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 120px;">Date:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Time:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.preferredTime)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Duration:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${data.duration || 60} minutes</td>
                  </tr>
                  ${data.timezone ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Timezone:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${escapeHtml(data.timezone)}</td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              ${data.message ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Client Message</h2>
                <div style="color: #374151; white-space: pre-wrap; line-height: 1.8;">${escapeHtml(data.message)}</div>
              </div>
              ` : ''}
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                <a href="mailto:${escapeHtml(data.clientEmail)}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-right: 10px;">Reply to Client</a>
                ${data.clientPhone ? `
                <a href="tel:${escapeHtml(data.clientPhone)}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Call Client</a>
                ` : ''}
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
              <p>This email was sent from the DevAndDone service booking system.</p>
            </div>
          </body>
        </html>
      `,
      text: `
New Service Booking

Service: ${data.serviceName}

Client Information:
Name: ${data.clientName}
Email: ${data.clientEmail}
${data.clientPhone ? `Phone: ${data.clientPhone}` : ''}
${data.company ? `Company: ${data.company}` : ''}

Booking Details:
Date: ${formattedDate}
Time: ${data.preferredTime}
Duration: ${data.duration || 60} minutes
${data.timezone ? `Timezone: ${data.timezone}` : ''}

${data.message ? `\nClient Message:\n${data.message}` : ''}

---
Reply to: ${data.clientEmail}
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error('Error sending service booking email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send confirmation email to client (for contact form)
 */
export async function sendContactConfirmationEmail(data) {
  if (!isEmailConfigured()) {
    console.warn('Resend API key not configured. Skipping confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Thank you for contacting DevAndDone',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank you for contacting DevAndDone</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Thank You, ${escapeHtml(data.name)}!</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                We've received your message and truly appreciate you reaching out to us.
              </p>
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Our team will review your inquiry and get back to you within <strong>24 hours</strong>.
              </p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Your Message:</p>
                <p style="color: #1f2937; margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
              </div>
              <p style="color: #374151; font-size: 16px; margin: 30px 0 0 0;">
                If you have any urgent questions, feel free to reach out to us directly at 
                <a href="mailto:${ADMIN_EMAIL}" style="color: #667eea; text-decoration: none;">${ADMIN_EMAIL}</a>.
              </p>
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong style="color: #667eea;">The DevAndDone Team</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Thank You, ${data.name}!

We've received your message and truly appreciate you reaching out to us.

Our team will review your inquiry and get back to you within 24 hours.

Your Message:
${data.message}

If you have any urgent questions, feel free to reach out to us directly at ${ADMIN_EMAIL}.

Best regards,
The DevAndDone Team
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Send booking confirmation email to client
 */
export async function sendBookingConfirmationEmail(data) {
  if (!isEmailConfigured()) {
    console.warn('Resend API key not configured. Skipping confirmation email.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const bookingDate = new Date(data.bookingDate);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.clientEmail,
      subject: `Booking Confirmation: ${data.serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Booking ${data.status === 'confirmed' ? 'Confirmed' : 'Received'}!</h1>
            </div>
            <div style="background: #f9fafb; padding: 40px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hi ${escapeHtml(data.clientName)},
              </p>
              ${data.status === 'confirmed' ? `
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Great news! Your booking has been <strong style="color: #10b981;">confirmed</strong>. We're excited to work with you!
              </p>
              ` : `
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                We've received your booking request. Our team will review it and confirm shortly.
              </p>
              `}
              
              <div style="background: white; padding: 25px; border-radius: 8px; margin: 30px 0; border: 2px solid #667eea;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Booking Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600; width: 140px;">Service:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 18px; font-weight: 600; color: #667eea;">${escapeHtml(data.serviceName)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Date:</td>
                    <td style="padding: 10px 0; color: #1f2937;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Time:</td>
                    <td style="padding: 10px 0; color: #1f2937;">${escapeHtml(data.preferredTime)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Duration:</td>
                    <td style="padding: 10px 0; color: #1f2937;">${data.duration || 60} minutes</td>
                  </tr>
                  ${data.meetingLink ? `
                  <tr>
                    <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Meeting Link:</td>
                    <td style="padding: 10px 0;">
                      <a href="${escapeHtml(data.meetingLink)}" style="color: #667eea; text-decoration: none; font-weight: 600;">Join Meeting</a>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              
              ${data.status === 'confirmed' ? `
              <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #065f46; margin: 0; font-weight: 600;">✓ Your booking is confirmed!</p>
                <p style="color: #047857; margin: 10px 0 0 0; font-size: 14px;">
                  We'll send you a reminder 24 hours before your scheduled time.
                </p>
              </div>
              ` : `
              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="color: #92400e; margin: 0; font-weight: 600;">⏳ Your booking is pending confirmation</p>
                <p style="color: #78350f; margin: 10px 0 0 0; font-size: 14px;">
                  We'll review your request and confirm within 24 hours.
                </p>
              </div>
              `}
              
              <p style="color: #374151; font-size: 16px; margin: 30px 0 0 0;">
                If you need to make any changes or have questions, please don't hesitate to contact us at 
                <a href="mailto:${ADMIN_EMAIL}" style="color: #667eea; text-decoration: none;">${ADMIN_EMAIL}</a>.
              </p>
              
              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong style="color: #667eea;">The DevAndDone Team</strong>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Booking ${data.status === 'confirmed' ? 'Confirmed' : 'Received'}!

Hi ${data.clientName},

${data.status === 'confirmed' ? 'Great news! Your booking has been confirmed. We\'re excited to work with you!' : 'We\'ve received your booking request. Our team will review it and confirm shortly.'}

Booking Details:
Service: ${data.serviceName}
Date: ${formattedDate}
Time: ${data.preferredTime}
Duration: ${data.duration || 60} minutes
${data.meetingLink ? `Meeting Link: ${data.meetingLink}` : ''}

If you need to make any changes or have questions, please contact us at ${ADMIN_EMAIL}.

Best regards,
The DevAndDone Team
      `.trim(),
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

