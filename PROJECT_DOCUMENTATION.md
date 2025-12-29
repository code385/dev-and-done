# DevAndDone Website - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [API Routes](#api-routes)
6. [Pages & Routes](#pages--routes)
7. [Authentication & Authorization](#authentication--authorization)
8. [Database Models](#database-models)
9. [Environment Variables](#environment-variables)
10. [Setup & Installation](#setup--installation)
11. [Deployment](#deployment)

---

## Project Overview

DevAndDone is a premium software development agency website built with Next.js 16, featuring:
- Service-based business showcase
- AI-powered tools (chat, project estimator)
- Founder's library with book reading and reviews
- Service booking system
- Protected admin dashboard for multiple founders
- Full-stack functionality with MongoDB integration

---

## Technology Stack

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **Tailwind CSS 4** - Styling
- **Framer Motion 11** - Animations
- **React Three Fiber** - 3D graphics
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **React Hot Toast** - Notifications

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB 6.3.0** - Database
- **bcryptjs** - Password hashing
- **jose** - JWT authentication
- **EmailJS** - Email service

### AI Integration
- **Google Generative AI (Gemini)** - AI chat and project estimation

---

## Project Structure

```
devanddone/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── books/             # Book reading pages
│   │   ├── bookings/          # Booking management
│   │   ├── book-service/      # Service booking page
│   │   ├── chat/              # AI chat page
│   │   ├── contact/           # Contact page
│   │   ├── estimator/        # Project estimator
│   │   ├── playground/        # Tech playground
│   │   ├── services/          # Services page
│   │   ├── work/              # Case studies
│   │   └── about/             # About page
│   ├── components/            # React components
│   │   ├── ai/               # AI-related components
│   │   ├── books/            # Book components
│   │   ├── booking/          # Booking components
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   └── ui/               # UI components
│   ├── lib/                   # Utility libraries
│   │   ├── ai/               # AI integration
│   │   ├── analytics/        # Analytics tracking
│   │   ├── auth/             # Authentication
│   │   ├── emailjs/          # Email service
│   │   ├── mongodb/          # Database models
│   │   ├── security/         # Security utilities
│   │   └── seo/              # SEO utilities
│   ├── data/                  # Static data
│   └── middleware.js         # Route protection
├── public/                    # Static assets
│   └── uploads/              # User uploads (books, images)
├── scripts/                   # Utility scripts
└── docs/                      # Documentation

```

---

## Features

### 1. Public Website Features

#### Home Page
- Hero section with 3D background
- Trust signals with animated counters
- Services showcase
- Why DevAndDone section
- Founder's library preview
- AI chat integration

#### Services Page (`/services`)
- Detailed service listings:
  - Web Development
  - Mobile App Development
  - AI & Automation
  - UI/UX Engineering
  - Maintenance & Scaling
- Service booking CTA
- Project estimator link

#### Founder's Library (`/books`)
- Book listing with search and filters
- Category filtering
- Featured books
- Book detail pages with:
  - Full book reading (PDF or text)
  - Review system with ratings
  - View tracking
  - Average rating display

#### Service Booking (`/book-service`)
- Service selection
- Date and time picker
- Client information form
- Duration selection
- Conflict detection
- Email confirmations

#### Booking Management (`/bookings`)
- View bookings by email
- Booking status tracking
- Cancel bookings
- Meeting link display

#### AI Chat (`/chat`)
- Interactive AI assistant
- Conversation history
- Session tracking
- Powered by Google Gemini API

#### Project Estimator (`/estimator`)
- AI-powered project estimation
- Service selection
- Budget and timeline inputs
- Detailed estimate results
- Lead capture

#### Contact Page (`/contact`)
- Contact form with EmailJS
- Contact information
- Trust badges
- Email notifications

#### Tech Playground (`/playground`)
- 15+ interactive demos
- 3D experiences
- Animation showcases
- AI tool demos

#### Work/Case Studies (`/work`)
- Portfolio showcase
- Case study details
- Project filtering

#### About Page (`/about`)
- Founder story
- Company vision
- Team information

### 2. Admin Dashboard Features

#### Authentication
- JWT-based authentication
- Multiple founder accounts
- Password-protected login
- Session management (24 hours)
- Secure password hashing

#### Admin Dashboard (`/admin/dashboard`)
- Overview dashboard
- Quick access to:
  - Book Management
  - Service Bookings
  - Founder Management

#### Book Management (`/admin/books`)
- **Founder-specific books only** - Each founder sees only their own books
- Create new books
- Upload PDF files
- Upload cover images with preview
- Edit books
- Delete books
- Book metadata management
- Featured book toggle

#### Founder Management (`/admin/founders`)
- View all founders
- Create new founder accounts
- Account status management

#### Service Bookings (`/admin/bookings`)
- View all service bookings
- Booking status management
- Meeting link assignment
- Booking notes

---

## API Routes

### Authentication Routes

#### `POST /api/auth/login`
- **Description**: Login for founders
- **Body**: `{ email: string, password: string }`
- **Response**: `{ success: boolean, founder: {...} }`
- **Cookie**: Sets `admin_token` (httpOnly)

#### `POST /api/auth/logout`
- **Description**: Logout current founder
- **Response**: `{ success: boolean }`
- **Cookie**: Deletes `admin_token`

#### `GET /api/auth/me`
- **Description**: Get current authenticated founder
- **Auth**: Required
- **Response**: `{ success: boolean, founder: {...} }`

### Book Routes

#### `GET /api/books`
- **Description**: Get published books (public)
- **Query Params**: 
  - `page` (number)
  - `limit` (number)
  - `category` (string)
  - `search` (string)
  - `featured` (boolean)
- **Response**: `{ success: boolean, books: [...], pagination: {...} }`

#### `POST /api/books`
- **Description**: Create new book (founder only)
- **Auth**: Required
- **Body**: 
  ```json
  {
    "title": "string",
    "author": "string",
    "description": "string",
    "content": "string" (for text books),
    "pdfUrl": "string" (for PDF books),
    "fileType": "text" | "pdf",
    "coverImage": "string",
    "category": "string",
    "tags": ["string"],
    "featured": boolean
  }
  ```
- **Response**: `{ success: boolean, book: {...} }`
- **Note**: Automatically associates book with creator

#### `GET /api/books/[id]`
- **Description**: Get single book with reviews
- **Response**: `{ success: boolean, book: {...}, reviews: [...] }`

#### `PUT /api/books/[id]`
- **Description**: Update book (founder only, own books only)
- **Auth**: Required
- **Body**: Book update fields
- **Response**: `{ success: boolean, book: {...} }`
- **Security**: Only creator can update

#### `DELETE /api/books/[id]`
- **Description**: Delete book (founder only, own books only)
- **Auth**: Required
- **Response**: `{ success: boolean, message: string }`
- **Security**: Only creator can delete

#### `GET /api/admin/books`
- **Description**: Get books created by current founder
- **Auth**: Required
- **Response**: `{ success: boolean, books: [...], pagination: {...} }`
- **Note**: Returns only books created by authenticated founder

### Book Review Routes

#### `GET /api/books/[id]/reviews`
- **Description**: Get reviews for a book
- **Query Params**: 
  - `page` (number)
  - `limit` (number)
  - `sort` ("recent" | "helpful" | "rating")
- **Response**: `{ success: boolean, reviews: [...], pagination: {...} }`

#### `POST /api/books/[id]/reviews`
- **Description**: Create book review
- **Body**: 
  ```json
  {
    "userName": "string",
    "userEmail": "string",
    "rating": number (1-5),
    "review": "string"
  }
  ```
- **Response**: `{ success: boolean, review: {...} }`
- **Note**: Updates book's average rating automatically

### Book Upload Routes

#### `POST /api/books/upload`
- **Description**: Upload PDF file
- **Auth**: Required
- **Body**: FormData with `file` (PDF, max 50MB)
- **Response**: `{ success: boolean, url: string, fileName: string, size: number }`
- **Storage**: `/public/uploads/books/`

#### `POST /api/books/upload-image`
- **Description**: Upload cover image
- **Auth**: Required
- **Body**: FormData with `file` (JPEG/PNG/WebP, max 5MB)
- **Response**: `{ success: boolean, url: string, fileName: string, size: number }`
- **Storage**: `/public/uploads/images/`

### Booking Routes

#### `GET /api/bookings`
- **Description**: Get bookings
- **Query Params**: 
  - `email` (string) - Filter by client email
  - `status` (string)
  - `page` (number)
  - `limit` (number)
- **Response**: `{ success: boolean, bookings: [...], pagination: {...} }`

#### `POST /api/bookings`
- **Description**: Create service booking
- **Body**: 
  ```json
  {
    "serviceId": "string",
    "serviceName": "string",
    "clientName": "string",
    "clientEmail": "string",
    "clientPhone": "string",
    "company": "string",
    "bookingDate": "ISO date string",
    "preferredTime": "string",
    "timezone": "string",
    "duration": number,
    "message": "string"
  }
  ```
- **Response**: `{ success: boolean, booking: {...} }`
- **Emails**: Sends confirmation to client and notification to admin

#### `GET /api/bookings/[id]`
- **Description**: Get single booking
- **Response**: `{ success: boolean, booking: {...} }`

#### `PUT /api/bookings/[id]`
- **Description**: Update booking status (admin only)
- **Auth**: Required
- **Body**: `{ status: string, meetingLink: string, notes: string }`
- **Response**: `{ success: boolean, booking: {...} }`

#### `DELETE /api/bookings/[id]`
- **Description**: Cancel booking
- **Body**: `{ reason: string }`
- **Response**: `{ success: boolean, message: string }`

### Founder Routes

#### `GET /api/founders`
- **Description**: Get all founders
- **Auth**: Required
- **Response**: `{ success: boolean, founders: [...] }`

#### `POST /api/founders`
- **Description**: Create new founder account
- **Auth**: Required
- **Body**: 
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string" (min 6 chars)
  }
  ```
- **Response**: `{ success: boolean, founder: {...} }`

### Other API Routes

#### `POST /api/contact`
- **Description**: Submit contact form
- **Body**: Contact form data
- **Response**: `{ success: boolean }`
- **Emails**: Sends via EmailJS

#### `POST /api/newsletter`
- **Description**: Subscribe to newsletter
- **Body**: `{ email: string, name: string }`
- **Response**: `{ success: boolean }`

#### `POST /api/chat`
- **Description**: AI chat endpoint
- **Body**: `{ message: string, sessionId: string, history: [...] }`
- **Response**: `{ success: boolean, response: string }`
- **AI**: Google Gemini API

#### `POST /api/estimator`
- **Description**: Get project estimate
- **Body**: Project details
- **Response**: `{ success: boolean, estimate: {...} }`
- **AI**: Google Gemini API

#### `GET /api/health`
- **Description**: Health check endpoint
- **Response**: `{ status: string, timestamp: string, services: {...} }`

---

## Pages & Routes

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Main landing page |
| `/services` | Services | Service listings |
| `/services/[id]` | Service Detail | Individual service page |
| `/books` | Books | Book library listing |
| `/books/[id]` | Book Detail | Book reading and reviews |
| `/book-service` | Book Service | Service booking form |
| `/bookings` | Bookings | Client booking management |
| `/chat` | AI Chat | Interactive AI assistant |
| `/estimator` | Estimator | Project estimation tool |
| `/contact` | Contact | Contact form and info |
| `/playground` | Playground | Tech demos |
| `/work` | Work | Case studies listing |
| `/work/[slug]` | Case Study | Individual case study |
| `/about` | About | Company information |

### Admin Routes (Protected)

| Route | Page | Description | Auth Required |
|-------|------|-------------|---------------|
| `/admin/login` | Admin Login | Founder login page | No |
| `/admin/dashboard` | Admin Dashboard | Main admin dashboard | Yes |
| `/admin/books` | Book Management | Manage books (own only) | Yes |
| `/admin/founders` | Founder Management | Manage founder accounts | Yes |
| `/admin/bookings` | Booking Management | Manage service bookings | Yes |

---

## Authentication & Authorization

### Authentication Flow

1. **Login**: Founder logs in at `/admin/login`
2. **JWT Token**: Server creates JWT token with founder info
3. **Cookie**: Token stored in httpOnly cookie (`admin_token`)
4. **Middleware**: All `/admin/*` routes (except login) are protected
5. **Verification**: Each request verifies JWT token
6. **Session**: Token valid for 24 hours

### Authorization

- **Book Ownership**: Each founder can only see/edit/delete their own books
- **Book Creation**: Books are automatically associated with creator
- **Admin Access**: All founders have admin access to dashboard
- **Founder Management**: Any founder can create other founder accounts

### Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with expiration
- HttpOnly cookies (prevents XSS)
- CSRF protection via SameSite cookies
- Route protection via middleware
- Input validation and sanitization

---

## Database Models

### Founders Collection
```javascript
{
  _id: ObjectId,
  email: string (unique, lowercase),
  name: string,
  password: string (hashed),
  role: "founder",
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Books Collection
```javascript
{
  _id: ObjectId,
  title: string,
  author: string,
  description: string,
  content: string (for text books),
  pdfUrl: string (for PDF books),
  fileType: "text" | "pdf",
  coverImage: string,
  category: string,
  tags: [string],
  publishedAt: Date,
  isPublished: boolean,
  views: number,
  averageRating: number (0-5),
  reviewCount: number,
  featured: boolean,
  createdBy: ObjectId (founder ID),
  createdAt: Date,
  updatedAt: Date
}
```

### BookReviews Collection
```javascript
{
  _id: ObjectId,
  bookId: ObjectId,
  userId: string,
  userName: string,
  userEmail: string (lowercase),
  rating: number (1-5),
  review: string,
  isApproved: boolean,
  helpful: number,
  createdAt: Date,
  updatedAt: Date
}
// Index: { bookId: 1, userEmail: 1 } (unique)
```

### ServiceBookings Collection
```javascript
{
  _id: ObjectId,
  serviceId: string,
  serviceName: string,
  clientName: string,
  clientEmail: string (lowercase),
  clientPhone: string,
  company: string,
  bookingDate: Date,
  preferredTime: string,
  timezone: string,
  duration: number (minutes),
  message: string,
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled",
  meetingLink: string,
  notes: string,
  reminderSent: boolean,
  confirmedAt: Date,
  cancelledAt: Date,
  cancellationReason: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Other Collections
- `contacts` - Contact form submissions
- `project_estimates` - Project estimates
- `chat_conversations` - AI chat sessions
- `newsletter_subscribers` - Newsletter subscriptions

---

## Environment Variables

### Required Variables

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT Secret (for admin authentication)
JWT_SECRET=your-secret-key

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# EmailJS
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxx

# Contact Email
CONTACT_EMAIL=info@devanddone.com
NEXT_PUBLIC_CONTACT_EMAIL=info@devanddone.com
```

### Optional Variables

```env
# Google AI (Gemini)
GOOGLE_AI_API_KEY=AIzaSy...

# Analytics
NEXT_PUBLIC_GA_ID=G-XXX
```

See `env.template` for complete list.

---

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation Steps

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp env.template .env.local
   # Edit .env.local with your credentials
   ```

3. **Create First Founder**
   ```bash
   npm run create-founder
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Public site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

---

## Deployment

### Build
```bash
npm run build
npm start
```

### Environment Variables
Set all environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other: Follow platform-specific instructions

### MongoDB
- Use MongoDB Atlas for production
- Update `MONGODB_URI` in production environment

### File Uploads
- For production, consider using cloud storage (AWS S3, Cloudinary)
- Update upload routes to use cloud storage APIs
- Current setup uses local file storage (`/public/uploads/`)

### Security Checklist
- [ ] Change `JWT_SECRET` to strong random string
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags in production
- [ ] Enable MongoDB authentication
- [ ] Use environment-specific configurations
- [ ] Set up proper CORS policies
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

---

## Additional Notes

### Book Ownership
- Each founder can only manage their own books
- Books are automatically associated with creator on creation
- API endpoints enforce ownership checks
- Admin panel filters books by creator

### File Uploads
- PDFs: Max 50MB, stored in `/public/uploads/books/`
- Images: Max 5MB, stored in `/public/uploads/images/`
- Files are accessible via public URLs
- Consider cloud storage for production

### Email Integration
- Uses EmailJS for email sending
- Single template handles all email types
- Template uses `email_type` parameter for differentiation

### AI Integration
- Google Gemini API for chat and estimation
- Dynamic model discovery
- Conversation history stored in MongoDB
- Fallback to basic functionality if API key not set

---

## Support & Maintenance

For issues or questions:
1. Check documentation in `/docs` folder
2. Review API documentation in `docs/API.md`
3. Check environment setup in `ENV_SETUP.md`
4. Review deployment guide in `docs/DEPLOYMENT.md`

---

**Last Updated**: December 2025
**Version**: 1.0.0

