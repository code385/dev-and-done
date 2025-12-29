# Deployment Guide

This guide will help you deploy the DevAndDone website to production.

## Prerequisites

- MongoDB database (MongoDB Atlas recommended for production)
- EmailJS account and configured templates
- Domain name (optional but recommended)
- Vercel account (recommended) or another hosting provider

## Step 1: Set Up MongoDB

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for Vercel)
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/devanddone`

## Step 2: Configure EmailJS

1. Sign up at https://www.emailjs.com/
2. Create an email service (Gmail, Outlook, etc.)
3. Create email templates:
   - Contact form notification (to admin)
   - Contact form confirmation (to user)
   - Project estimate notification
   - Newsletter confirmation
4. Get your Service ID, Public Key, and Template IDs

## Step 3: Environment Variables

Create a `.env.local` file (or set in your hosting provider):

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devanddone?retryWrites=true&w=majority

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT=template_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONFIRMATION=template_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_ESTIMATE=template_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_NEWSLETTER=template_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://devanddone.com
CONTACT_EMAIL=contact@devanddone.com
ADMIN_EMAIL=admin@devanddone.com

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key
```

## Step 4: Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add all environment variables in Vercel dashboard
5. Deploy!

Vercel will automatically:
- Build your Next.js app
- Deploy to CDN
- Set up SSL certificates
- Provide analytics

## Step 5: Post-Deployment

1. **Test all forms:**
   - Contact form
   - Newsletter subscription
   - Project estimator
   - AI chat

2. **Verify database:**
   - Check MongoDB Atlas to ensure data is being stored
   - Verify indexes are created

3. **Test emails:**
   - Submit contact form
   - Subscribe to newsletter
   - Verify emails are received

4. **Monitor:**
   - Check Vercel analytics
   - Monitor MongoDB usage
   - Set up error tracking (Sentry, etc.)

## Alternative Hosting Options

### Netlify
Similar to Vercel, supports Next.js with some limitations for API routes.

### AWS/Google Cloud/Azure
For more control, deploy using Docker or serverless functions.

## Database Indexes

The application will automatically create indexes on first run. To manually create:

```javascript
// Run in MongoDB shell or Compass
use devanddone;
db.contacts.createIndex({ email: 1 });
db.contacts.createIndex({ status: 1 });
db.contacts.createIndex({ createdAt: -1 });
```

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Verify database user permissions

### EmailJS Not Working
- Verify all template IDs are correct
- Check EmailJS service is active
- Verify public key is correct

### Build Errors
- Check all environment variables are set
- Verify Node.js version (18+)
- Check for TypeScript errors

## Performance Optimization

1. Enable MongoDB connection pooling (already configured)
2. Use Vercel Edge Functions for API routes (if needed)
3. Enable image optimization (Next.js Image component)
4. Monitor bundle size

## Security Checklist

- ✅ All environment variables secured
- ✅ Rate limiting enabled
- ✅ Input sanitization
- ✅ Honeypot spam protection
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ CORS configured (if needed)

## Support

For issues or questions, contact: support@devanddone.com

