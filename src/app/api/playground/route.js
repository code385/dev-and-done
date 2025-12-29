import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting store
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 10;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const limit = rateLimitMap.get(ip);
  if (now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (limit.count >= maxRequests) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { text } = await request.json();

    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input text' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        output: `${text} - This is a demo. Full AI integration available with API key.`,
        isDemo: true,
      });
    }

    try {
      // List available models
      let availableModels = [];
      try {
        const listUrl = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
        const listResponse = await fetch(listUrl);
        if (listResponse.ok) {
          const listData = await listResponse.json();
          availableModels = (listData.models || [])
            .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));
        }
      } catch (err) {
        // Silently fail - will use fallback model names
      }

      // Use available models if found, otherwise try common model names
      const modelNames = availableModels.length > 0 
        ? availableModels 
        : ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash-latest', 'gemini-1.5-pro-latest'];
      let lastError = null;
      
      for (const modelName of modelNames) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
          const requestBody = {
            contents: [{ role: 'user', parts: [{ text: text.trim() }] }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          };
          
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            lastError = new Error(`API error: ${response.status} - ${errorText}`);
            continue; // Try next model
          }
          
          const data = await response.json();
          const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!outputText) {
            lastError = new Error('No text in response');
            continue;
          }
          
          return NextResponse.json({
            output: outputText,
            isDemo: false,
          });
        } catch (err) {
          lastError = err;
          continue;
        }
      }
      
      // If all REST API attempts failed, try SDK as fallback
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(text.trim());
      const outputText = result.response.text();
      
      return NextResponse.json({
        output: outputText,
        isDemo: false,
      });
    } catch (error) {
      console.error('Playground AI error:', error);
      return NextResponse.json({
        output: `Error processing request: ${error.message}. Please try again.`,
        isDemo: false,
        error: true,
      });
    }
  } catch (error) {
    console.error('Playground API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

