'use client';

import { motion } from 'framer-motion';

export default function ChatMessage({ message, isUser = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3
          ${isUser 
            ? 'bg-primary text-background' 
            : 'bg-muted text-foreground border border-border'
          }
        `}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap">{message}</p>
      </div>
    </motion.div>
  );
}

