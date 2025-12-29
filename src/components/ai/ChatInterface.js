'use client';

import { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { getInitialMessage } from '@/lib/ai/chat';

// Generate or retrieve session ID
function getSessionId() {
  if (typeof window === 'undefined') return null;
  
  let sessionId = sessionStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
}

export default function ChatInterface({ onLeadCapture }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => getSessionId());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([getInitialMessage()]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userMessage) => {
    // Add user message
    const userMsg = { role: 'user', content: userMessage };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          sessionId: sessionId,
        }),
      });

      const data = await response.json();
      
      // Add assistant response
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message },
      ]);

      // Check if we should capture lead info
      if (data.requiresLeadInfo && onLeadCapture) {
        onLeadCapture();
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again or contact us directly.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.content}
            isUser={msg.role === 'user'}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-border">
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}

