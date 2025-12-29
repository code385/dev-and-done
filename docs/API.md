# API Documentation

This document describes all API endpoints in the DevAndDone application.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://devanddone.com`

## Endpoints

### POST /api/contact

Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "message": "I'm interested in your services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid input
- `429` - Rate limit exceeded
- `500` - Server error

---

### POST /api/newsletter

Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "source": "website"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid email or already subscribed
- `429` - Rate limit exceeded
- `500` - Server error

---

### POST /api/chat

AI chat conversation.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ],
  "sessionId": "chat_1234567890_abc123"
}
```

**Response:**
```json
{
  "message": "AI response text",
  "requiresApiKey": false
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request
- `429` - Rate limit exceeded
- `500` - Server error

---

### POST /api/estimator

Get project estimate.

**Request Body:**
```json
{
  "answers": {
    "projectType": "web-app",
    "complexity": "medium",
    "features": ["user-auth", "payments"],
    "timeline": "standard"
  }
}
```

**Response:**
```json
{
  "priceRange": {
    "min": 12000,
    "max": 18000
  },
  "timeline": {
    "min": 6,
    "max": 10
  },
  "suggestedTechStack": ["Next.js", "React", "TypeScript"],
  "confidence": "medium"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid input
- `429` - Rate limit exceeded
- `500` - Server error

---

### POST /api/analytics

Track analytics events.

**Request Body:**
```json
{
  "type": "page_view",
  "data": {
    "path": "/services"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid event
- `500` - Server error

---

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "services": {
    "database": "connected"
  }
}
```

**Status Codes:**
- `200` - Healthy
- `503` - Unhealthy

---

## Rate Limiting

All endpoints implement rate limiting:
- Contact form: 3 requests per minute
- Newsletter: 5 requests per minute
- Chat: 10 requests per minute
- Estimator: 5 requests per minute

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message description"
}
```

## Authentication

Currently, all endpoints are public. Future admin endpoints may require authentication.

## CORS

CORS is handled by Next.js. For production, configure CORS in `next.config.mjs` if needed.

