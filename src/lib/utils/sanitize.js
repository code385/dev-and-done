/**
 * Input sanitization utilities for production security
 */

// Basic HTML tag removal (for content that will be rendered as HTML)
export function sanitizeHTML(html) {
  if (typeof html !== 'string') return '';
  
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

// Sanitize text input (remove HTML, trim, limit length)
export function sanitizeText(text, maxLength = 10000) {
  if (typeof text !== 'string') return '';
  
  return text
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, maxLength);
}

// Sanitize title (no HTML, limited length)
export function sanitizeTitle(title, maxLength = 200) {
  if (typeof title !== 'string') return '';
  
  return title
    .trim()
    .replace(/<[^>]*>/g, '')
    .substring(0, maxLength);
}

// Validate email format
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Validate slug format
export function isValidSlug(slug) {
  if (typeof slug !== 'string') return false;
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

// Sanitize tags array
export function sanitizeTags(tags, maxTags = 10) {
  if (!Array.isArray(tags)) return [];
  
  return tags
    .slice(0, maxTags)
    .map(tag => {
      if (typeof tag !== 'string') return null;
      return tag.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    })
    .filter(tag => tag && tag.length > 0 && tag.length <= 50);
}

// Rate limiting helper (simple in-memory, use Redis in production)
const rateLimitMap = new Map();

export function checkRateLimit(identifier, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = identifier;
  
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  const record = rateLimitMap.get(key);
  
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Clean up old rate limit records
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean every minute

