// Enhanced input sanitization

export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (except safe image types)
    .replace(/data:(?!image\/png|image\/jpeg|image\/gif|image\/webp)/gi, '')
    // Trim whitespace
    .trim()
    // Limit length
    .slice(0, 10000);
}

export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  
  // Basic email sanitization
  const sanitized = email
    .toLowerCase()
    .trim()
    .slice(0, 254); // Email max length
  
  // Validate format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

export function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

