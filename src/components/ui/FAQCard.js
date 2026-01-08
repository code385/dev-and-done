'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ThumbsUp } from 'lucide-react';

export default function FAQCard({ faq, index = 0, onMarkHelpful }) {
  const [isOpen, setIsOpen] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const handleMarkHelpful = async () => {
    if (helpfulClicked) return;
    
    try {
      await fetch(`/api/faqs/${faq._id}/helpful`, { method: 'POST' });
      setHelpfulClicked(true);
      if (onMarkHelpful) onMarkHelpful();
    } catch (error) {
      console.error('Error marking FAQ as helpful:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="border border-border rounded-lg overflow-hidden bg-card"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-foreground pr-4 flex-1">{faq.question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 border-t border-border">
              <div className="prose prose-sm max-w-none text-muted-foreground mb-4">
                <p className="whitespace-pre-line">{faq.answer}</p>
              </div>
              <button
                onClick={handleMarkHelpful}
                disabled={helpfulClicked}
                className={`flex items-center gap-2 text-sm ${
                  helpfulClicked
                    ? 'text-green-500'
                    : 'text-muted-foreground hover:text-primary'
                } transition-colors`}
              >
                <ThumbsUp className={`w-4 h-4 ${helpfulClicked ? 'fill-current' : ''}`} />
                <span>{helpfulClicked ? 'Thank you!' : 'Was this helpful?'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
