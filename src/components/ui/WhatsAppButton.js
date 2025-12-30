'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // WhatsApp number - you can set this via environment variable
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1234567890'; // Replace with your WhatsApp number
  const whatsappMessage = encodeURIComponent("Hello! I'm interested in your services. Can we discuss my project?");

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`;

  // Hide button on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== 'down' && scrollY < 10) {
        setIsVisible(true);
      } else if (direction === 'down' && scrollY > 100) {
        setIsVisible(false);
      } else if (direction === 'up') {
        setIsVisible(true);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50"
        >
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-card border border-border rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 max-w-xs sm:max-w-sm ml-0"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Chat on WhatsApp</h3>
                    <p className="text-xs text-muted-foreground">We typically reply instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors mb-2"
              >
                Start Conversation
              </a>
              <button
                onClick={() => setIsExpanded(false)}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Maybe later
              </button>
            </motion.div>
          ) : null}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 relative group"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
            
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-foreground text-background text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap">
                Chat with us
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
              </div>
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

