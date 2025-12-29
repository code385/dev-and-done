# DevAndDone - Comprehensive Project Documentation

**Version:** 1.0.0  
**Last Updated:** 2024  
**Project Type:** Premium Development Agency Website with AI Integration  
**Status:** Production Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Architecture & Technology Stack](#architecture--technology-stack)
4. [Database Schema & Data Models](#database-schema--data-models)
5. [API Documentation](#api-documentation)
6. [AI Integration & Training Data](#ai-integration--training-data)
7. [Features & Functionality](#features--functionality)
8. [File Structure](#file-structure)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [AI Model Training Guide](#ai-model-training-guide)
11. [Security & Best Practices](#security--best-practices)
12. [Performance Metrics](#performance-metrics)

---

## Executive Summary

DevAndDone is a next-generation, AI-powered premium development agency website built with modern web technologies. The platform serves as both a marketing website and a client engagement tool, featuring AI chat assistance, project estimation, content management, and comprehensive analytics.

### Key Highlights

- **AI-Powered Features**: Chat assistant and project estimator using Google Gemini AI
- **Content Management**: Blog and book management system with admin dashboard
- **Client Engagement**: Contact forms, newsletter subscriptions, service bookings
- **Analytics**: Comprehensive user engagement and behavior tracking
- **Modern Stack**: Next.js 16, React 19, MongoDB, Tailwind CSS v4
- **3D Graphics**: Interactive Three.js visualizations
- **Performance**: Lighthouse score 90+

---

## Project Overview

### Purpose

DevAndDone is a full-stack web application designed to:
1. Showcase the agency's services, portfolio, and expertise
2. Generate and qualify leads through multiple touchpoints
3. Provide AI-powered assistance to potential clients
4. Manage content (blogs, books) through an admin interface
5. Track user engagement and conversion metrics

### Target Audience

- **Primary**: Potential clients seeking web/mobile/AI development services
- **Secondary**: Existing clients accessing resources and booking services
- **Internal**: Founders/admins managing content and leads

### Business Goals

- Lead generation and qualification
- Brand positioning as a premium development agency
- Content marketing through blogs and books
- Client self-service through AI chat and project estimator

---

## Architecture & Technology Stack

### Frontend Stack

```
- Framework: Next.js 16.1.1 (App Router)
- UI Library: React 19.2.3
- Styling: Tailwind CSS v4
- Animations: Framer Motion 11.0.0
- 3D Graphics: Three.js 0.160.0, @react-three/fiber, @react-three/drei
- Forms: React Hook Form 7.49.0, Zod 3.22.4
- Notifications: React Hot Toast 2.4.1
- Icons: Lucide React 0.562.0
- Font: Comfortaa (Google Fonts)
```

### Backend Stack

```
- Runtime: Node.js 18+
- Framework: Next.js API Routes
- Database: MongoDB 6.3.0
- Authentication: JWT (jose 6.1.3), bcryptjs 3.0.3
- AI Integration: @google/generative-ai 0.21.0
- Email: @emailjs/browser 3.11.0
- File Storage: @vercel/blob 2.0.0
```

### Infrastructure

```
- Hosting: Vercel (recommended)
- Database: MongoDB Atlas
- File Storage: Vercel Blob Storage
- Email Service: EmailJS
- CDN: Vercel Edge Network
```

### Architecture Pattern

- **Pattern**: Server-Side Rendering (SSR) + Static Site Generation (SSG) + API Routes
- **State Management**: React Context API + Local State
- **Data Fetching**: Server Components + Client Components with fetch
- **Authentication**: JWT-based with HTTP-only cookies (optional)

---

## Database Schema & Data Models

### Database: `devanddone`

### Collections Overview

1. **blogs** - Blog posts and articles
2. **contacts** - Contact form submissions
3. **chat_conversations** - AI chat interactions
4. **project_estimates** - Project estimation requests
5. **newsletter_subscribers** - Email newsletter subscriptions
6. **founders** - Admin/founder accounts
7. **books** - Published books
8. **book_reviews** - Book reviews and ratings
9. **service_bookings** - Service booking requests
10. **analytics** - User engagement events

---

### 1. Blogs Collection

**Collection Name:** `blogs`

**Schema:**
```javascript
{
  _id: ObjectId,
  title: String (required),
  slug: String (required, unique),
  excerpt: String (required),
  content: String (required, HTML),
  author: String (required),
  category: String (required),
  readTime: String (default: "5 min read"),
  coverImage: String (URL),
  featured: Boolean (default: false),
  isPublished: Boolean (default: true),
  views: Number (default: 0),
  createdBy: ObjectId (Founder reference),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Text index on: `title`, `excerpt`, `content`
- Unique index on: `slug`
- Index on: `createdAt` (descending)
- Compound index: `{ isPublished: 1, createdAt: -1 }`
- Compound index: `{ featured: 1, isPublished: 1, createdAt: -1 }`
- Index on: `category`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Next.js vs React: Which Should You Choose?",
  "slug": "nextjs-vs-react-which-to-choose",
  "excerpt": "A comprehensive comparison of Next.js and React frameworks...",
  "content": "<p>Full HTML content...</p>",
  "author": "DevAndDone Team",
  "category": "Web Development",
  "readTime": "8 min read",
  "coverImage": "https://blob.vercel-storage.com/blogs/cover-images/...",
  "featured": true,
  "isPublished": true,
  "views": 1250,
  "createdBy": "507f191e810c19729de860ea",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:22:00Z"
}
```

---

### 2. Contacts Collection

**Collection Name:** `contacts`

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  company: String (optional),
  message: String (required),
  source: String (default: "contact_form"),
  status: String (default: "new", enum: ["new", "contacted", "qualified", "converted", "archived"]),
  ip: String,
  userAgent: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Index on: `email`
- Index on: `status`
- Index on: `createdAt` (descending)
- Index on: `source`

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "message": "Interested in web development services...",
  "source": "contact_form",
  "status": "new",
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2024-01-20T09:15:00Z",
  "updatedAt": "2024-01-20T09:15:00Z"
}
```

---

### 3. Chat Conversations Collection

**Collection Name:** `chat_conversations`

**Schema:**
```javascript
{
  _id: ObjectId,
  sessionId: String (required),
  messages: Array<{
    role: String (enum: ["user", "assistant"]),
    content: String
  }>,
  lastMessage: Object (latest message),
  ip: String,
  userAgent: String,
  source: String (default: "ai_chat"),
  status: String (default: "active"),
  leadStatus: String (default: "new", enum: ["new", "qualified", "contacted", "converted"]),
  leadData: Object (optional, captured lead information),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Index on: `sessionId`
- Index on: `leadStatus`
- Index on: `updatedAt` (descending)

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "sessionId": "sess_abc123xyz",
  "messages": [
    {
      "role": "user",
      "content": "What services do you offer?"
    },
    {
      "role": "assistant",
      "content": "We offer web development, mobile app development..."
    }
  ],
  "lastMessage": {
    "role": "assistant",
    "content": "We offer web development, mobile app development..."
  },
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "source": "ai_chat",
  "status": "active",
  "leadStatus": "new",
  "leadData": null,
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:05:00Z"
}
```

---

### 4. Project Estimates Collection

**Collection Name:** `project_estimates`

**Schema:**
```javascript
{
  _id: ObjectId,
  answers: Object {
    projectType: String (enum: ["web-app", "mobile-app", "ai-solution", "custom-software"]),
    complexity: String (enum: ["simple", "medium", "complex", "enterprise"]),
    features: Array<String>,
    timeline: String,
    budget: String,
    additionalInfo: String
  },
  estimate: Object {
    priceRange: { min: Number, max: Number },
    timeline: { min: Number, max: Number },
    suggestedTechStack: Array<String>,
    confidence: String (enum: ["low", "medium", "high"]),
    aiInsights: String (optional)
  },
  email: String (optional),
  name: String (optional),
  company: String (optional),
  ip: String,
  source: String (default: "project_estimator"),
  status: String (default: "new", enum: ["new", "contacted", "quoted", "converted", "archived"]),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Index on: `email`
- Index on: `status`
- Index on: `createdAt` (descending)

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "answers": {
    "projectType": "web-app",
    "complexity": "medium",
    "features": ["user-authentication", "payment-integration", "admin-dashboard"],
    "timeline": "3-6 months",
    "budget": "$50,000 - $100,000",
    "additionalInfo": "Need e-commerce functionality"
  },
  "estimate": {
    "priceRange": {
      "min": 45000,
      "max": 75000
    },
    "timeline": {
      "min": 12,
      "max": 18
    },
    "suggestedTechStack": ["Next.js", "React", "TypeScript", "PostgreSQL", "Stripe"],
    "confidence": "high",
    "aiInsights": "Based on the requirements, this is a medium-complexity e-commerce platform..."
  },
  "email": "client@example.com",
  "name": "Jane Smith",
  "company": "Retail Co",
  "ip": "192.168.1.1",
  "source": "project_estimator",
  "status": "new",
  "createdAt": "2024-01-20T11:00:00Z",
  "updatedAt": "2024-01-20T11:00:00Z"
}
```

---

### 5. Newsletter Subscribers Collection

**Collection Name:** `newsletter_subscribers`

**Schema:**
```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  name: String (optional),
  source: String (default: "website"),
  status: String (default: "active", enum: ["active", "unsubscribed", "bounced"]),
  ip: String,
  subscribedAt: Date,
  unsubscribedAt: Date (optional),
  lastEmailSent: Date (optional)
}
```

**Indexes:**
- Unique index on: `email`
- Index on: `status`
- Index on: `subscribedAt` (descending)

---

### 6. Founders Collection

**Collection Name:** `founders`

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (default: "founder", enum: ["founder", "admin"]),
  isActive: Boolean (default: true),
  lastLogin: Date (optional),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Unique index on: `email`
- Index on: `role`
- Index on: `isActive`

---

### 7. Books Collection

**Collection Name:** `books`

**Schema:**
```javascript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  description: String (required),
  coverImage: String (URL),
  pdfUrl: String (URL),
  category: String,
  publishedDate: Date,
  isbn: String (optional),
  featured: Boolean (default: false),
  views: Number (default: 0),
  downloads: Number (default: 0),
  averageRating: Number (default: 0),
  reviewCount: Number (default: 0),
  createdBy: ObjectId (Founder reference),
  createdAt: Date,
  updatedAt: Date
}
```

---

### 8. Book Reviews Collection

**Collection Name:** `book_reviews`

**Schema:**
```javascript
{
  _id: ObjectId,
  bookId: ObjectId (required, reference to books),
  reviewerName: String (required),
  reviewerEmail: String (required),
  rating: Number (required, 1-5),
  review: String (required),
  isApproved: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Index on: `bookId`
- Index on: `isApproved`
- Index on: `createdAt` (descending)

---

### 9. Service Bookings Collection

**Collection Name:** `service_bookings`

**Schema:**
```javascript
{
  _id: ObjectId,
  serviceId: String (required),
  serviceName: String (required),
  clientName: String (required),
  clientEmail: String (required),
  clientPhone: String (optional),
  company: String (optional),
  projectDetails: String (required),
  preferredDate: Date (optional),
  budget: String (optional),
  status: String (default: "pending", enum: ["pending", "confirmed", "in-progress", "completed", "cancelled"]),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

---

### 10. Analytics Collection

**Collection Name:** `analytics`

**Schema:**
```javascript
{
  _id: ObjectId,
  type: String (required, enum: ["page_view", "click", "form_submit", "download", "video_play", "custom"]),
  page: String (required),
  element: String (optional),
  value: String (optional),
  ip: String,
  userAgent: String,
  referrer: String (optional),
  sessionId: String (optional),
  userId: String (optional),
  metadata: Object (optional, additional data),
  timestamp: Date
}
```

**Indexes:**
- Index on: `type`
- Index on: `page`
- Index on: `timestamp` (descending)
- Compound index: `{ type: 1, timestamp: -1 }`

---

## API Documentation

### Base URL
- **Development:** `http://localhost:3000`
- **Production:** `https://devanddone.com`

### Authentication

Most admin endpoints require JWT authentication via cookie or Authorization header.

---

### Public APIs

#### 1. Health Check

**GET** `/api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:00:00Z"
}
```

---

#### 2. Get Blogs

**GET** `/api/blogs`

**Query Parameters:**
- `featured` (boolean, optional): Filter featured blogs
- `category` (string, optional): Filter by category
- `limit` (number, optional): Limit results (default: 12)
- `page` (number, optional): Page number (default: 1)

**Response:**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "...",
      "title": "...",
      "slug": "...",
      "excerpt": "...",
      "author": "...",
      "category": "...",
      "readTime": "...",
      "coverImage": "...",
      "featured": true,
      "views": 1250,
      "createdAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "pages": 5
  }
}
```

---

#### 3. Get Blog by Slug

**GET** `/api/blogs/[slug]`

**Response:**
```json
{
  "success": true,
  "blog": {
    "_id": "...",
    "title": "...",
    "slug": "...",
    "content": "...",
    "author": "...",
    "category": "...",
    "readTime": "...",
    "coverImage": "...",
    "views": 1250,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### 4. Submit Contact Form

**POST** `/api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "message": "Interested in your services..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

**Rate Limiting:** 5 requests per 15 minutes per IP

---

#### 5. AI Chat

**POST** `/api/chat`

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What services do you offer?"
    }
  ],
  "sessionId": "sess_abc123" // optional
}
```

**Response:**
```json
{
  "message": "We offer web development, mobile app development...",
  "requiresApiKey": false
}
```

**Rate Limiting:** 20 requests per minute per IP

---

#### 6. Project Estimator

**POST** `/api/estimator`

**Request Body:**
```json
{
  "answers": {
    "projectType": "web-app",
    "complexity": "medium",
    "features": ["user-auth", "payments"],
    "timeline": "3-6 months",
    "budget": "$50k-$100k",
    "additionalInfo": "E-commerce platform"
  }
}
```

**Response:**
```json
{
  "priceRange": {
    "min": 45000,
    "max": 75000
  },
  "timeline": {
    "min": 12,
    "max": 18
  },
  "suggestedTechStack": ["Next.js", "React", "PostgreSQL"],
  "confidence": "high",
  "aiInsights": "Based on requirements..."
}
```

**Rate Limiting:** 10 requests per hour per IP

---

#### 7. Newsletter Subscription

**POST** `/api/newsletter`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

**Rate Limiting:** 3 requests per hour per IP

---

### Admin APIs (Require Authentication)

#### 8. Admin Login

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "admin@devanddone.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "founder": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "founder"
  }
}
```

---

#### 9. Get Current User

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "founder": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "founder"
  }
}
```

---

#### 10. Admin - Get All Blogs

**GET** `/api/admin/blogs`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "blogs": [...]
}
```

---

#### 11. Admin - Create Blog

**POST** `/api/admin/blogs`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "slug": "new-blog-post",
  "excerpt": "Short description...",
  "content": "<p>Full content...</p>",
  "author": "DevAndDone Team",
  "category": "Web Development",
  "readTime": "5 min read",
  "coverImage": "https://...",
  "featured": false,
  "isPublished": true
}
```

---

#### 12. Admin - Update Blog

**PUT** `/api/admin/blogs/[id]`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (Same as create, all fields optional)

---

#### 13. Admin - Delete Blog

**DELETE** `/api/admin/blogs/[id]`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

#### 14. Admin - Upload Blog Cover Image

**POST** `/api/admin/blogs/upload-cover`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Image file (JPEG, PNG, WebP, max 5MB)

**Response:**
```json
{
  "success": true,
  "url": "https://blob.vercel-storage.com/blogs/cover-images/...",
  "fileName": "original-name.jpg",
  "size": 245678
}
```

---

#### 15. Upload Book PDF

**POST** `/api/books/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: PDF file (max 50MB)

**Response:**
```json
{
  "success": true,
  "url": "https://blob.vercel-storage.com/books/...",
  "fileName": "book.pdf",
  "size": 5242880
}
```

---

#### 16. Upload Book Cover Image

**POST** `/api/books/upload-image`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: Image file (JPEG, PNG, WebP, max 5MB)

---

### Analytics API

#### 17. Track Event

**POST** `/api/analytics`

**Request Body:**
```json
{
  "type": "page_view",
  "page": "/services/web-development",
  "element": "cta-button",
  "value": "click",
  "metadata": {
    "custom": "data"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

---

## AI Integration & Training Data

### Current AI Implementation

The project uses **Google Generative AI (Gemini)** for two main features:

1. **AI Chat Assistant** (`/api/chat`)
   - Model: Gemini 1.5 Flash / Gemini Pro
   - Purpose: Answer questions about services, provide information
   - Context: Company services, expertise, processes

2. **Project Estimator** (`/api/estimator`)
   - Model: Gemini Pro
   - Purpose: Generate project estimates based on requirements
   - Output: Price range, timeline, tech stack recommendations

### AI Training Data Structure

For training a custom AI model, the following data sources are available:

#### 1. Chat Conversations Dataset

**Source:** `chat_conversations` collection

**Structure:**
```json
{
  "conversations": [
    {
      "messages": [
        {
          "role": "user",
          "content": "What services do you offer?"
        },
        {
          "role": "assistant",
          "content": "We offer web development, mobile app development..."
        }
      ],
      "sessionId": "sess_123",
      "source": "ai_chat",
      "timestamp": "2024-01-20T10:00:00Z"
    }
  ]
}
```

**Use Cases:**
- Fine-tune conversational AI
- Train on company-specific responses
- Learn user intent patterns
- Improve response quality

**Export Format:**
```json
{
  "training_data": [
    {
      "input": "What services do you offer?",
      "output": "We offer web development, mobile app development, AI solutions, and custom software development. Our services include...",
      "context": {
        "source": "website",
        "page": "/chat"
      }
    }
  ]
}
```

---

#### 2. Project Estimation Dataset

**Source:** `project_estimates` collection

**Structure:**
```json
{
  "estimates": [
    {
      "input": {
        "projectType": "web-app",
        "complexity": "medium",
        "features": ["user-auth", "payments"],
        "timeline": "3-6 months",
        "budget": "$50k-$100k"
      },
      "output": {
        "priceRange": { "min": 45000, "max": 75000 },
        "timeline": { "min": 12, "max": 18 },
        "suggestedTechStack": ["Next.js", "React", "PostgreSQL"],
        "aiInsights": "Based on requirements..."
      }
    }
  ]
}
```

**Use Cases:**
- Train estimation model
- Learn pricing patterns
- Tech stack recommendation engine
- Timeline prediction

---

#### 3. Content Dataset

**Source:** `blogs` collection + `services` data

**Structure:**
```json
{
  "content": [
    {
      "type": "blog",
      "title": "Next.js vs React",
      "content": "Full blog content...",
      "category": "Web Development",
      "tags": ["nextjs", "react", "framework"]
    },
    {
      "type": "service",
      "title": "Web Development",
      "description": "Service description...",
      "process": ["Step 1", "Step 2"],
      "techStack": ["Next.js", "React"]
    }
  ]
}
```

**Use Cases:**
- Train on company knowledge base
- Content generation
- Service recommendations
- SEO content optimization

---

#### 4. User Interaction Dataset

**Source:** `analytics` collection + `contacts` collection

**Structure:**
```json
{
  "interactions": [
    {
      "type": "page_view",
      "page": "/services/web-development",
      "timestamp": "2024-01-20T10:00:00Z",
      "userAgent": "...",
      "referrer": "..."
    },
    {
      "type": "form_submit",
      "form": "contact",
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "message": "..."
      }
    }
  ]
}
```

**Use Cases:**
- User behavior prediction
- Lead scoring
- Personalization
- Conversion optimization

---

### Recommended AI Model Training Approach

#### Option 1: Fine-tune Existing Model (Recommended)

**Base Model:** GPT-3.5/4, Claude, or Gemini

**Training Data Preparation:**

1. **Conversation Data:**
   ```python
   # Export chat conversations
   conversations = db.chat_conversations.find({})
   
   training_data = []
   for conv in conversations:
       for i in range(0, len(conv['messages'])-1, 2):
           if conv['messages'][i]['role'] == 'user':
               training_data.append({
                   'messages': [
                       {'role': 'system', 'content': 'You are a helpful AI assistant for DevAndDone, a premium development agency...'},
                       {'role': 'user', 'content': conv['messages'][i]['content']},
                       {'role': 'assistant', 'content': conv['messages'][i+1]['content']}
                   ]
               })
   ```

2. **Estimation Data:**
   ```python
   # Export project estimates
   estimates = db.project_estimates.find({})
   
   training_data = []
   for est in estimates:
       prompt = f"Estimate project: Type={est['answers']['projectType']}, Complexity={est['answers']['complexity']}..."
       training_data.append({
           'input': prompt,
           'output': json.dumps(est['estimate'])
       })
   ```

3. **Knowledge Base:**
   ```python
   # Export blogs and services
   blogs = db.blogs.find({'isPublished': True})
   services = get_services_data()  # From services.js
   
   knowledge_base = []
   for blog in blogs:
       knowledge_base.append({
           'title': blog['title'],
           'content': blog['content'],
           'category': blog['category']
       })
   ```

#### Option 2: Train Custom Model from Scratch

**Requirements:**
- Large dataset (10,000+ examples recommended)
- GPU resources
- ML framework (PyTorch, TensorFlow)

**Architecture Suggestions:**
- **Conversational AI:** Transformer-based (GPT-style)
- **Estimation Model:** Regression + Classification hybrid
- **Content Generation:** Fine-tuned language model

---

### AI Model Integration Points

#### 1. Chat Assistant Enhancement

**Current:** Uses Gemini API with basic prompts

**Enhanced Version:**
```javascript
// Enhanced chat with custom model
export async function generateChatResponse(messages, customModelEndpoint) {
  const response = await fetch(customModelEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages,
      context: {
        company: 'DevAndDone',
        services: getServicesData(),
        recentBlogs: getRecentBlogs()
      }
    })
  });
  return response.json();
}
```

#### 2. Intelligent Lead Scoring

**New Feature:**
```javascript
// AI-powered lead scoring
export async function scoreLead(leadData) {
  const modelResponse = await fetch('/api/ai/score-lead', {
    method: 'POST',
    body: JSON.stringify({
      email: leadData.email,
      interactions: leadData.interactions,
      chatHistory: leadData.chatHistory,
      estimateData: leadData.estimateData
    })
  });
  return modelResponse.json(); // { score: 0-100, reasoning: "..." }
}
```

#### 3. Personalized Recommendations

**New Feature:**
```javascript
// AI-powered service recommendations
export async function recommendServices(userProfile) {
  const recommendations = await fetch('/api/ai/recommend', {
    method: 'POST',
    body: JSON.stringify({
      userInterests: userProfile.interests,
      browsingHistory: userProfile.history,
      chatContext: userProfile.chatContext
    })
  });
  return recommendations.json();
}
```

---

## Features & Functionality

### Core Features

1. **Homepage**
   - Hero section with animated 3D background
   - Services overview
   - Trust signals
   - Founder story
   - Featured books
   - What we build showcase

2. **Services Pages**
   - Individual service detail pages
   - Service booking forms
   - Process explanations
   - Tech stack information

3. **Blog System**
   - Blog listing with categories
   - Individual blog posts
   - Featured blogs
   - Related posts
   - View tracking

4. **Books Section**
   - Book catalog
   - Individual book pages
   - PDF downloads
   - Book reviews

5. **AI Chat**
   - Real-time chat interface
   - Conversation history
   - Lead capture
   - Session management

6. **Project Estimator**
   - Multi-step form
   - AI-powered estimates
   - Tech stack recommendations
   - Email delivery

7. **Contact Forms**
   - Contact form
   - Newsletter subscription
   - Service booking
   - Spam protection

8. **Admin Dashboard**
   - Blog management (CRUD)
   - Book management
   - Lead management
   - Analytics overview

9. **Tech Playground**
   - Interactive demo showcase
   - Live preview system
   - 200+ animation demos
   - Multi-demo combination

10. **Analytics**
    - Page view tracking
    - Event tracking
    - User behavior analysis
    - Conversion tracking

---

## File Structure

```
devanddone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin APIs
│   │   │   ├── auth/          # Authentication
│   │   │   ├── blogs/         # Blog APIs
│   │   │   ├── books/         # Book APIs
│   │   │   ├── chat/          # AI Chat API
│   │   │   ├── contact/       # Contact form API
│   │   │   ├── estimator/     # Project estimator API
│   │   │   └── newsletter/    # Newsletter API
│   │   ├── admin/             # Admin pages
│   │   ├── blogs/             # Blog pages
│   │   ├── books/             # Book pages
│   │   ├── chat/              # AI Chat page
│   │   ├── contact/           # Contact page
│   │   ├── estimator/         # Project estimator page
│   │   ├── playground/        # Tech Playground
│   │   ├── services/          # Service pages
│   │   ├── layout.js          # Root layout
│   │   ├── page.js            # Homepage
│   │   └── globals.css        # Global styles
│   │
│   ├── components/            # React components
│   │   ├── ai/                # AI components
│   │   ├── layout/            # Layout components
│   │   ├── sections/          # Page sections
│   │   ├── playground/        # Playground components
│   │   ├── three/             # Three.js components
│   │   └── ui/                # UI components
│   │
│   ├── lib/                   # Utilities
│   │   ├── ai/                # AI integration
│   │   ├── analytics/         # Analytics
│   │   ├── auth/              # Authentication
│   │   ├── emailjs/           # Email utilities
│   │   ├── mongodb/           # Database models
│   │   └── security/          # Security utilities
│   │
│   ├── data/                  # Static data
│   │   ├── services.js        # Services data
│   │   ├── caseStudies.js     # Case studies
│   │   └── blogPosts.js       # Initial blog data
│   │
│   └── contexts/              # React contexts
│       └── ThemeContext.js    # Theme management
│
├── public/                    # Static assets
│   ├── D.png                  # Logo
│   ├── Hovered_logo.png       # Hover logo
│   └── ...
│
├── docs/                      # Documentation
├── scripts/                   # Utility scripts
├── .env.local                 # Environment variables
├── package.json               # Dependencies
├── next.config.mjs            # Next.js config
└── README.md                  # Project README
```

---

## Deployment & Infrastructure

### Vercel Deployment

**Recommended Platform:** Vercel

**Configuration:**
1. Connect GitHub repository
2. Configure environment variables
3. Set up MongoDB Atlas
4. Configure Vercel Blob Storage
5. Deploy

**Environment Variables Required:**
```env
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_SITE_URL=https://devanddone.com
GOOGLE_AI_API_KEY=AIzaSy...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
JWT_SECRET=...
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
```

### File Storage

**Vercel Blob Storage:**
- Books: `books/{timestamp}_{filename}.pdf`
- Book Covers: `books/cover-images/{timestamp}_{filename}`
- Blog Covers: `blogs/cover-images/{timestamp}_{filename}`

**Fallback:** Local filesystem for development

---

## AI Model Training Guide

### Step 1: Data Collection

1. **Export MongoDB Data:**
   ```bash
   # Export chat conversations
   mongoexport --uri="mongodb+srv://..." \
     --db=devanddone \
     --collection=chat_conversations \
     --out=chat_data.json
   
   # Export project estimates
   mongoexport --uri="mongodb+srv://..." \
     --db=devanddone \
     --collection=project_estimates \
     --out=estimates_data.json
   
   # Export blogs
   mongoexport --uri="mongodb+srv://..." \
     --db=devanddone \
     --collection=blogs \
     --out=blogs_data.json
   ```

2. **Export Static Data:**
   - Services data from `src/data/services.js`
   - Case studies from `src/data/caseStudies.js`

### Step 2: Data Preprocessing

**Python Script Example:**
```python
import json
import re

def preprocess_chat_data(input_file, output_file):
    with open(input_file, 'r') as f:
        conversations = json.load(f)
    
    training_data = []
    for conv in conversations:
        messages = conv.get('messages', [])
        for i in range(0, len(messages)-1, 2):
            if messages[i]['role'] == 'user' and messages[i+1]['role'] == 'assistant':
                training_data.append({
                    'instruction': messages[i]['content'],
                    'input': '',
                    'output': messages[i+1]['content']
                })
    
    with open(output_file, 'w') as f:
        json.dump(training_data, f, indent=2)

# Run preprocessing
preprocess_chat_data('chat_data.json', 'chat_training.json')
```

### Step 3: Model Training

**Option A: Fine-tune with OpenAI**
```python
import openai

openai.FineTuningJob.create(
    training_file="chat_training.jsonl",
    model="gpt-3.5-turbo",
    hyperparameters={
        "n_epochs": 3,
        "batch_size": 4,
        "learning_rate_multiplier": 0.1
    }
)
```

**Option B: Train Custom Model**
```python
from transformers import GPT2LMHeadModel, GPT2Tokenizer, Trainer, TrainingArguments

# Load model
model = GPT2LMHeadModel.from_pretrained('gpt2')
tokenizer = GPT2Tokenizer.from_pretrained('gpt2')

# Prepare dataset
dataset = load_dataset('json', data_files='chat_training.json')

# Training arguments
training_args = TrainingArguments(
    output_dir='./devanddone-ai-model',
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=1000,
    logging_steps=100
)

# Train
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset['train']
)
trainer.train()
```

### Step 4: Model Integration

**Update API Route:**
```javascript
// src/app/api/chat/route.js
import { CustomAIModel } from '@/lib/ai/custom-model';

export async function POST(request) {
  const { messages } = await request.json();
  
  // Use custom model instead of Gemini
  const response = await CustomAIModel.generate(messages);
  
  return NextResponse.json(response);
}
```

---

## Security & Best Practices

### Security Measures

1. **Authentication:**
   - JWT tokens with secure secret
   - Password hashing with bcrypt
   - HTTP-only cookies (optional)

2. **Rate Limiting:**
   - API routes protected
   - IP-based limiting
   - Per-endpoint limits

3. **Input Validation:**
   - Zod schema validation
   - Input sanitization
   - XSS protection

4. **Spam Protection:**
   - Honeypot fields
   - Rate limiting
   - Email validation

5. **File Upload Security:**
   - File type validation
   - Size limits
   - Virus scanning (recommended)

### Best Practices

1. **Code Quality:**
   - ESLint configuration
   - TypeScript (recommended for future)
   - Component modularity

2. **Performance:**
   - Image optimization
   - Code splitting
   - Lazy loading
   - Caching strategies

3. **SEO:**
   - Meta tags
   - Structured data
   - Sitemap generation
   - robots.txt

---

## Performance Metrics

### Current Performance

- **Lighthouse Score:** 90+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

### Optimization Strategies

1. **Image Optimization:**
   - Next.js Image component
   - WebP format
   - Lazy loading

2. **Code Splitting:**
   - Dynamic imports
   - Route-based splitting
   - Component-level splitting

3. **Caching:**
   - Static page generation
   - API response caching
   - CDN caching

---

## Conclusion

This documentation provides a comprehensive overview of the DevAndDone project, including:

- Complete database schemas
- Full API documentation
- AI integration details
- Training data structure
- Deployment guidelines
- Security best practices

For questions or additional information, contact: **info@devanddone.com**

---

**Document Version:** 1.0.0  
**Last Updated:** 2024  
**Maintained By:** DevAndDone Development Team
