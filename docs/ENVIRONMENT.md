# Environment Variables Setup

This document explains all environment variables needed for the DevAndDone website.

## Required Variables

### MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/devanddone
```
- **Development**: Use local MongoDB or MongoDB Atlas free tier
- **Production**: Use MongoDB Atlas connection string
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Site Configuration
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
- **Development**: `http://localhost:3000`
- **Production**: Your production domain (e.g., `https://devanddone.com`)

## EmailJS Variables (Required for Email Functionality)

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
```

**How to get these:**
1. Sign up at https://www.emailjs.com/
2. Create an email service
3. Create ONE template that handles all email types (contact, confirmation, estimate, newsletter)
4. The template should use `{{email_type}}` parameter to differentiate between email types
5. Copy the IDs from EmailJS dashboard

**Template Variables:**
- `{{email_type}}`: 'contact' | 'confirmation' | 'estimate' | 'newsletter'
- `{{to_name}}`, `{{to_email}}`, `{{from_name}}`, `{{from_email}}`
- `{{company}}`, `{{message}}`, `{{reply_to}}`
- For estimates: `{{project_type}}`, `{{budget_range}}`, `{{timeline}}`

## Optional Variables

### Google AI Studio (Gemini API)
```env
GOOGLE_AI_API_KEY=AIzaSy...
```
- Required for full AI chat and estimator functionality
- Get from https://aistudio.google.com/
- Uses Gemini 1.5 Flash model for fast, cost-effective responses
- Without this, AI features will use placeholder responses

### Contact Information
```env
CONTACT_EMAIL=info@devanddone.com
NEXT_PUBLIC_CONTACT_EMAIL=info@devanddone.com
ADMIN_EMAIL=admin@devanddone.com
```
- Used in email templates and metadata
- `NEXT_PUBLIC_CONTACT_EMAIL` is required for client components (like contact page)
- Defaults provided if not set

### Analytics
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```
- Google Analytics tracking ID
- Optional - only needed if using Google Analytics

## Setup Instructions

1. Copy `.env.example` to `.env.local`
2. Fill in all required variables
3. For production, set variables in your hosting provider's dashboard
4. Never commit `.env.local` to git (already in .gitignore)

## Validation

The app includes environment validation that will warn about missing variables in development and error in production.

## Security Notes

- Never commit `.env.local` to version control
- Use different values for development and production
- Rotate API keys regularly
- Use environment-specific MongoDB databases
- Keep EmailJS public key secure (it's public but still sensitive)

