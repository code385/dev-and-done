# Environment File Setup

## Quick Setup

1. **Copy the template file:**
   ```bash
   cp env.template .env.local
   ```
   
   Or manually:
   - Copy `env.template`
   - Rename it to `.env.local`

2. **Open `.env.local` and fill in your values:**

### Required Values to Fill:

#### 1. MongoDB (REQUIRED)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devanddone
```
- Get from MongoDB Atlas: https://cloud.mongodb.com/
- Or use local: `mongodb://localhost:27017/devanddone`

#### 2. Site URL (REQUIRED)
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

#### 3. EmailJS (Required for emails to work)
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx
```
- Get from: https://www.emailjs.com/
- Create ONE template that handles all email types (contact, confirmation, estimate, newsletter)
- Template should use {{email_type}} parameter to differentiate email types
- See SETUP.md for detailed EmailJS setup

#### 4. Contact Email
```env
CONTACT_EMAIL=info@devanddone.com
NEXT_PUBLIC_CONTACT_EMAIL=info@devanddone.com
ADMIN_EMAIL=admin@devanddone.com
```
- Change to your actual email addresses
- `NEXT_PUBLIC_CONTACT_EMAIL` is needed for client components to access the email

#### 5. Google AI Studio (Optional - for AI features)
```env
GOOGLE_AI_API_KEY=AIzaSyxxxxx
```
- Get from: https://aistudio.google.com/
- Uses Gemini 1.5 Flash model
- Without this, AI features use placeholder responses

## Example .env.local

```env
# MongoDB
MONGODB_URI=mongodb+srv://myuser:mypass@cluster0.xxxxx.mongodb.net/devanddone?retryWrites=true&w=majority

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xyz789
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx

# Contact
CONTACT_EMAIL=info@devanddone.com
NEXT_PUBLIC_CONTACT_EMAIL=info@devanddone.com
ADMIN_EMAIL=admin@devanddone.com

# Google AI Studio (optional)
GOOGLE_AI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Verification

After setting up `.env.local`, verify it works:

1. Start the dev server: `npm run dev`
2. Check health: Visit `http://localhost:3000/api/health`
3. Should show: `"database": "connected"`

## Need Help?

- See `SETUP.md` for detailed setup instructions
- See `docs/ENVIRONMENT.md` for variable explanations
- See `docs/DEPLOYMENT.md` for production setup

