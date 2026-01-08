'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from '@/i18n/routing';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ variant = 'default', className = '', onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=5`);
        const data = await response.json();

        if (data.success) {
          setSuggestions(data.results.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (onSearch) {
      onSearch(item);
    } else {
      if (item.type === 'blog') {
        router.push(`/blogs/${item.slug}`);
      } else if (item.type === 'book') {
        router.push(`/books/${item._id}`);
      } else if (item.type === 'service') {
        router.push(`/services/${item.slug}`);
      } else if (item.type === 'work') {
        router.push(`/work/${item.slug}`);
      }
    }
    setShowSuggestions(false);
    setQuery('');
  };

  const variants = {
    default: 'w-full max-w-md',
    compact: 'w-64',
    full: 'w-full',
  };

  return (
    <div ref={containerRef} className={`relative ${variants[variant]} ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={variant === 'compact' ? "Search..." : "Search blogs, books, services..."}
          className="w-full pl-10 pr-10 py-2.5 bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-lg"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </form>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          >
            <div className="p-2">
              {suggestions.map((item, index) => (
                <button
                  key={`${item.type}-${item._id || item.id || index}`}
                  onClick={() => handleSuggestionClick(item)}
                  className="w-full text-left px-4 py-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {item.coverImage && (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {item.excerpt || item.description}
                      </p>
                      <span className="text-xs text-primary mt-1 inline-block">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full text-center px-4 py-2 text-primary hover:bg-muted rounded-lg transition-colors mt-2 border-t border-border pt-2"
              >
                View all results
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

