'use client';

import { useState } from 'react';
import Button from '../ui/Button';

export default function ChatInput({ onSend, disabled = false }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        aria-label="Chat input"
      />
      <Button type="submit" variant="primary" disabled={disabled || !message.trim()}>
        Send
      </Button>
    </form>
  );
}

