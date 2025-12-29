# DevAndDone - Premium Development Agency Website

A next-generation, AI-powered, visually stunning company website built with Next.js, React, MongoDB, and EmailJS.

## Features

- 🎨 **Premium Design** - Modern, futuristic UI with 3D interactive elements
- 🤖 **AI-Powered** - AI chat assistant and project estimator
- 📧 **Email Integration** - Contact forms with EmailJS
- 💾 **MongoDB Backend** - Full database integration for leads, contacts, and analytics
- 📊 **Analytics Tracking** - Comprehensive user engagement tracking
- 🚀 **Performance Optimized** - Lighthouse score 90+
- ♿ **Accessible** - WCAG compliant
- 🔒 **Secure** - Rate limiting, input sanitization, spam protection

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Backend**: Next.js API Routes, MongoDB
- **Email**: EmailJS
- **Forms**: React Hook Form, Zod validation
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- EmailJS account (for email functionality)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devanddone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
- MongoDB connection string
- EmailJS credentials
- Site URL
- Contact email

4. Run database seed (creates indexes):
```bash
npm run seed
```

5. Start development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Environment Variables

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for complete environment variable documentation.

Required:
- `MONGODB_URI` - MongoDB connection string
- `NEXT_PUBLIC_SITE_URL` - Your site URL
- EmailJS variables (for email functionality)

Optional:
- `OPENAI_API_KEY` - For full AI features
- `CONTACT_EMAIL` - Contact email address

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── api/         # API routes
│   ├── about/       # About page
│   ├── contact/     # Contact page
│   ├── services/    # Services page
│   └── work/        # Case studies page
├── components/      # React components
│   ├── ui/         # Base UI components
│   ├── sections/   # Page sections
│   ├── layout/     # Layout components
│   ├── ai/         # AI components
│   └── three/      # 3D components
├── lib/            # Utilities
│   ├── mongodb/    # Database models
│   ├── emailjs/    # Email utilities
│   ├── ai/         # AI integration
│   └── analytics/  # Analytics tracking
└── data/           # Static data
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Create database indexes

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

## API Documentation

See [docs/API.md](docs/API.md) for complete API documentation.

## Features in Detail

### Contact Form
- EmailJS integration for sending emails
- MongoDB storage for all submissions
- Spam protection (honeypot)
- Rate limiting
- Toast notifications

### AI Chat
- OpenAI integration (when API key provided)
- Conversation storage in MongoDB
- Session tracking
- Lead capture

### Project Estimator
- Multi-step form
- AI-powered estimation (when API key provided)
- Estimate storage in MongoDB
- Email notifications

### Newsletter
- Email subscription
- MongoDB storage
- Confirmation emails
- Duplicate prevention

## Performance

- Lighthouse Score: 90+
- Optimized images
- Code splitting
- Lazy loading
- Edge rendering ready

## Security

- Rate limiting on all API routes
- Input sanitization
- Honeypot spam protection
- CSRF protection ready
- Secure environment variables

## Contributing

This is a private project. For questions or support, contact: contact@devanddone.com

## License

Proprietary - All rights reserved

## Support

For deployment issues or questions:
- Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- Review [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
- Contact: support@devanddone.com
