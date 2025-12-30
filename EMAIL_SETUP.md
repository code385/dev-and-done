# Email Service Setup Guide

## Overview

The DevAndDone website uses **Resend** for sending emails. We support two email templates:

1. **Contact Us** - Sent when users submit the contact form
2. **Service Booking** - Sent when users book a service

## Setup Instructions

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Navigate to **API Keys** in your Resend dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "DevAndDone Production")
4. Copy the API key (starts with `re_`)

### 3. Verify Your Domain (Recommended for Production)

1. Go to **Domains** in your Resend dashboard
2. Click **Add Domain**
3. Add your domain (e.g., `devanddone.com`)
4. Follow the DNS configuration instructions
5. Wait for domain verification (usually takes a few minutes)

**Note:** For development/testing, you can use Resend's default domain which allows sending to verified email addresses only.

### 4. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here


# Email Configuration
EMAIL_FROM=noreply@devanddone.com
ADMIN_EMAIL=contact@devanddone.com
```

**Important:**
- `EMAIL_FROM` should be a verified domain or use Resend's default domain format
- `ADMIN_EMAIL` is where contact form and booking notifications are sent
- For development, you can use: `onboarding@resend.dev` as `EMAIL_FROM`

### 5. Test the Email Service

1. Submit a contact form on your website
2. Check that:
   - Admin receives notification email
   - User receives confirmation email
3. Book a service
4. Check that:
   - Admin receives booking notification
   - User receives booking confirmation

## Email Templates

### Contact Us Template

**Sent to Admin:**
- Subject: "New Contact Form Submission from [Name]"
- Contains: Name, Email, Company (if provided), Message
- Reply-to: User's email

**Sent to User:**
- Subject: "Thank you for contacting DevAndDone"
- Contains: Confirmation message with their submitted message

### Service Booking Template

**Sent to Admin:**
- Subject: "New Service Booking: [Service Name]"
- Contains: Client info, Service details, Booking date/time, Duration, Message (if provided)
- Reply-to: Client's email

**Sent to User:**
- Subject: "Booking Confirmation: [Service Name]" or "Booking Received: [Service Name]"
- Contains: Booking details, Status (pending/confirmed), Meeting link (if confirmed)

## Troubleshooting

### Emails Not Sending

1. **Check API Key:**
   - Verify `RESEND_API_KEY` is set correctly
   - Ensure the API key is active in Resend dashboard

2. **Check Domain Verification:**
   - If using custom domain, ensure it's verified
   - For development, use `onboarding@resend.dev`

3. **Check Email Addresses:**
   - In development mode, Resend only sends to verified email addresses
   - Add your test email to Resend's verified emails list

4. **Check Server Logs:**
   - Look for error messages in your server console
   - Check Resend dashboard for delivery status

### Rate Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day

For higher limits, upgrade your Resend plan.

## Migration from EmailJS

If you were previously using EmailJS:

1. ✅ EmailJS has been completely removed
2. ✅ All email functionality now uses Resend
3. ✅ No client-side email sending (all server-side)
4. ✅ Only 2 templates: Contact Us and Service Booking

## Support

For issues with:
- **Resend Service:** Check [Resend Documentation](https://resend.com/docs)
- **Email Templates:** See `src/lib/email/service.js`
- **API Integration:** See `src/app/api/contact/route.js` and `src/app/api/bookings/route.js`

