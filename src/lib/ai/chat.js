// AI Chat logic - Google AI Studio (Gemini API) integration

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateChatResponse(messages, apiKey) {
  if (!apiKey) {
    return {
      message: "I'm here to help! Please add your Google AI Studio API key to enable full AI chat functionality. For now, I can answer basic questions about DevAndDone's services.",
      requiresApiKey: true,
    };
  }

  try {
    // Get the last user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    // Convert messages to Gemini format for REST API
    const contents = [];
    let foundFirstUser = false;
    
    // Build conversation contents (skip the last user message as it will be sent separately)
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      
      // Skip assistant messages until we find the first user message
      if (msg.role === 'assistant' && !foundFirstUser) {
        continue;
      }
      
      if (msg.role === 'user') {
        foundFirstUser = true;
        contents.push({ role: 'user', parts: [{ text: msg.content }] });
      } else if (msg.role === 'assistant' && foundFirstUser) {
        contents.push({ role: 'model', parts: [{ text: msg.content }] });
      }
    }

    // First, try to list available models to find the correct one
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
          contents: [...contents, { role: 'user', parts: [{ text: lastMessage.content }] }],
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!text) {
          lastError = new Error('No text in response');
          continue;
        }
        
        return {
          message: text,
          requiresApiKey: false,
        };
      } catch (err) {
        lastError = err;
        continue;
      }
    }
    
    // If all REST API attempts failed, try SDK as fallback
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Fallback to SDK if REST API failed
    const chatHistory = contents.length > 0 ? contents : undefined;
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return {
      message: text,
      requiresApiKey: false,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Handle specific error cases
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('401')) {
      return {
        message: "Invalid API key. Please check your Google AI Studio API key configuration.",
        requiresApiKey: true,
      };
    }
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return {
        message: "Rate limit exceeded. Please try again in a moment.",
        requiresApiKey: false,
      };
    }

    // Fallback response
    return {
      message: "I apologize, but I'm experiencing technical difficulties. Please try again or contact us directly at info@devanddone.com for assistance.",
      requiresApiKey: false,
    };
  }
}

export function getInitialMessage() {
  return {
    role: 'assistant',
    content: "Hello! I'm your AI consultant from DevAndDone. I can help you understand our services, estimate project scope, or answer questions about web development, mobile apps, and AI solutions. What would you like to know?",
  };
}

