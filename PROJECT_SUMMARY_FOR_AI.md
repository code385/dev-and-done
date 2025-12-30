# DevAndDone - Project Summary for AI Development

**Quick Reference Guide for AI Model Training and Integration**

---

## Project Overview

**DevAndDone** is a premium development agency website featuring:
- AI-powered chat assistant
- Project estimation tool
- Content management system (blogs, books)
- Lead generation and tracking
- Admin dashboard

**Tech Stack:** Next.js 16, React 19, MongoDB, Google Gemini AI, Vercel Blob Storage

---

## Key Data Sources for AI Training

### 1. Chat Conversations
- **Collection:** `chat_conversations`
- **Volume:** Variable (grows with usage)
- **Format:** User-assistant message pairs
- **Use Case:** Train conversational AI
- **Fields:** messages[], sessionId, leadStatus, source

### 2. Project Estimates
- **Collection:** `project_estimates`
- **Volume:** Variable
- **Format:** Q&A pairs (requirements → estimate)
- **Use Case:** Train estimation model
- **Fields:** answers{}, estimate{}, confidence, aiInsights

### 3. Blogs
- **Collection:** `blogs`
- **Volume:** Variable (admin-created)
- **Format:** Articles with content, categories
- **Use Case:** Knowledge base, content generation
- **Fields:** title, content, category, excerpt, views

### 4. Services Data
- **Source:** `src/data/services.js` (static)
- **Format:** Service descriptions, processes, tech stacks
- **Use Case:** Service recommendations, knowledge base
- **Fields:** title, description, process[], techStack[]

### 5. Contacts
- **Collection:** `contacts`
- **Format:** Lead information
- **Use Case:** Lead scoring, intent classification
- **Fields:** name, email, message, status, source

---

## AI Integration Points

### Current Implementation
1. **Chat API** (`/api/chat`) - Uses Gemini 1.5 Flash
2. **Estimator API** (`/api/estimator`) - Uses Gemini Pro

### Recommended Enhancements
1. **Custom Chat Model** - Fine-tuned on company data
2. **Lead Scoring AI** - Predicts conversion probability
3. **Content Generation** - Auto-generate blog posts
4. **Personalization** - User-specific recommendations
5. **Intent Classification** - Categorize user queries

---

## Quick Data Export Commands

```bash
# Export all collections
mongoexport --uri="mongodb+srv://..." --db=devanddone --collection=chat_conversations --out=chat.json
mongoexport --uri="mongodb+srv://..." --db=devanddone --collection=project_estimates --out=estimates.json
mongoexport --uri="mongodb+srv://..." --db=devanddone --collection=blogs --out=blogs.json
mongoexport --uri="mongodb+srv://..." --db=devanddone --collection=contacts --out=contacts.json
```

---

## API Endpoints Summary

### Public APIs
- `GET /api/blogs` - List blogs
- `GET /api/blogs/[slug]` - Get blog
- `POST /api/contact` - Submit contact
- `POST /api/chat` - AI chat
- `POST /api/estimator` - Project estimate
- `POST /api/newsletter` - Subscribe

### Admin APIs (Auth Required)
- `GET /api/admin/blogs` - List all blogs
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/[id]` - Update blog
- `DELETE /api/admin/blogs/[id]` - Delete blog
- `POST /api/admin/blogs/upload-cover` - Upload image

---

## Training Data Format

### Chat Training Format
```json
{
  "instruction": "You are a helpful AI assistant for DevAndDone...",
  "input": "What services do you offer?",
  "output": "We offer web development, mobile app development..."
}
```

### Estimation Training Format
```json
{
  "instruction": "Estimate the following project...",
  "input": "Type: web-app, Complexity: medium, Features: [...]",
  "output": "{\"priceRange\": {\"min\": 45000, \"max\": 75000}, ...}"
}
```

---

## Model Deployment Options

1. **OpenAI Fine-tuning** - Easiest, high quality
2. **Anthropic Claude** - Good alternative
3. **Hugging Face** - Open source, customizable
4. **RAG (LangChain)** - Best for knowledge base
5. **Custom Training** - Full control, requires expertise

---

## Next Steps

1. Export data from MongoDB
2. Preprocess and format for training
3. Choose training approach
4. Train model
5. Deploy and integrate
6. Monitor and iterate

---

**See Full Documentation:**
- `PROJECT_DOCUMENTATION.md` - Complete project details
- `AI_TRAINING_GUIDE.md` - Step-by-step training guide


