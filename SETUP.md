# Setup Guide

Complete setup instructions for the DevAndDone website.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in MongoDB URI
   - Add EmailJS credentials (optional but recommended)

3. **Set Up MongoDB**
   - Install MongoDB locally OR
   - Create MongoDB Atlas account (free tier available)
   - Get connection string
   - Run seed script: `npm run seed`

4. **Set Up EmailJS** (Optional but Recommended)
   - Sign up at https://www.emailjs.com/
   - Create email service
   - Create templates
   - Add credentials to `.env.local`

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Detailed Setup

### MongoDB Setup

#### Option 1: MongoDB Atlas (Recommended for Production)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free M0 tier)
4. Create database user
5. Whitelist IP (0.0.0.0/0 for development, specific IPs for production)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/devanddone`
7. Add to `.env.local` as `MONGODB_URI`

#### Option 2: Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Connection string: `mongodb://localhost:27017/devanddone`
4. Add to `.env.local` as `MONGODB_URI`

### EmailJS Setup

1. **Create Account**
   - Sign up at https://www.emailjs.com/
   - Free tier includes 200 emails/month

2. **Add Email Service**
   - Go to Email Services
   - Add service (Gmail, Outlook, etc.)
   - Follow setup instructions

3. **Create Templates**
   
   **Contact Form Template:**
   - Template ID: `contact_template`
   - Variables: `{{to_name}}`, `{{from_name}}`, `{{from_email}}`, `{{company}}`, `{{message}}`, `{{reply_to}}`
   
   **Confirmation Template:**
   - Template ID: `confirmation_template`
   - Variables: `{{to_name}}`, `{{to_email}}`, `{{from_name}}`, `{{message}}`

4. **Get Credentials**
   - Service ID: Found in Email Services
   - Public Key: Found in Account > API Keys
   - Template IDs: Found in each template

5. **Add to .env.local**
   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT=template_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONFIRMATION=template_id
   ```

### OpenAI Setup (Optional)

For full AI chat and estimator functionality:

1. Get API key from https://platform.openai.com/
2. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   ```

Without this, AI features will use placeholder responses.

## Verification

After setup, verify everything works:

1. **Database Connection**
   - Visit `/api/health`
   - Should show `"database": "connected"`

2. **Contact Form**
   - Go to `/contact`
   - Submit test form
   - Check MongoDB for stored contact
   - Check email inbox

3. **Newsletter**
   - Subscribe in footer
   - Check MongoDB for subscriber
   - Check email for confirmation

4. **Project Estimator**
   - Go to `/estimator`
   - Complete form
   - Check MongoDB for estimate

## Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check MongoDB is running (if local)
- Verify IP whitelist (if Atlas)
- Check database user permissions

### EmailJS Not Working
- Verify all template IDs are correct
- Check EmailJS service is active
- Verify public key is correct
- Check browser console for errors

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`
- Check Node.js version (18+)

## Next Steps

- Review [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment
- Check [API.md](docs/API.md) for API documentation
- See [ENVIRONMENT.md](docs/ENVIRONMENT.md) for all environment variables

