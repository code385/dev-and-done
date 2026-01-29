'use client';

import { useState, useEffect, useRef } from 'react';
import Tag from './Tag';
import { motion, AnimatePresence } from 'framer-motion';

export default function TagInput({ 
  value = [], 
  onChange, 
  label = 'Tags',
  placeholder = 'Type to search or create tags...',
  className = '' 
}) {
  const [tags, setTags] = useState(value);
  const [availableTags, setAvailableTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setTags(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tags?limit=100');
      const data = await response.json();

      if (data.success) {
        setAvailableTags(data.tags || []);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = availableTags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.some((selectedTag) => {
        const selectedId = typeof selectedTag === 'string' ? selectedTag : selectedTag._id?.toString();
        const tagId = tag._id?.toString();
        return selectedId === tagId || selectedTag === tag.slug || selectedTag === tag.name;
      })
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleAddTag = (tag) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    setInputValue('');
    setShowSuggestions(false);
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => {
      if (typeof tag === 'string') {
        return tag !== tagToRemove;
      }
      const tagId = tag._id?.toString();
      const removeId = typeof tagToRemove === 'string' ? tagToRemove : tagToRemove._id?.toString();
      return tagId !== removeId && tag.slug !== tagToRemove && tag.name !== tagToRemove;
    });
    setTags(newTags);
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      // Check if tag exists
      const existingTag = availableTags.find(
        (tag) => tag.name.toLowerCase() === inputValue.toLowerCase().trim()
      );
      
      if (existingTag) {
        handleAddTag(existingTag);
      } else {
        // Create new tag (just add the name, API will handle creation)
        handleAddTag(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      handleRemoveTag(tags[tags.length - 1]);
    }
  };

  const handleCreateTag = async (tagName) => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tagName }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchTags(); // Refresh available tags
        handleAddTag(data.tag);
      }
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={placeholder}
          className="
            w-full px-4 py-3 
            bg-muted border border-border 
            rounded-lg 
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
          "
        />
        
        <AnimatePresence>
          {showSuggestions && (filteredSuggestions.length > 0 || inputValue.trim()) && (
            <motion.div
              ref={suggestionsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="
                absolute z-50 w-full mt-1 
                bg-card border border-border 
                rounded-lg shadow-lg 
                max-h-60 overflow-y-auto
              "
            >
              {filteredSuggestions.length > 0 ? (
                <ul className="py-1">
                  {filteredSuggestions.slice(0, 10).map((tag) => (
                    <li key={tag._id?.toString() || tag.slug}>
                      <button
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="
                          w-full text-left px-4 py-2 
                          hover:bg-muted 
                          transition-colors
                          text-sm
                        "
                      >
                        {tag.name}
                        {tag.count > 0 && (
                          <span className="text-muted-foreground ml-2">
                            ({tag.count})
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                inputValue.trim() && (
                  <div className="p-4">
                    <button
                      type="button"
                      onClick={() => handleCreateTag(inputValue.trim())}
                      className="
                        w-full text-left text-sm 
                        text-primary hover:text-primary/80
                      "
                    >
                      Create tag "{inputValue.trim()}"
                    </button>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          <AnimatePresence>
            {tags.map((tag, index) => {
              const tagName = typeof tag === 'string' ? tag : tag.name || tag.slug;
              const tagId = typeof tag === 'string' ? tag : tag._id?.toString();
              
              return (
                <motion.div
                  key={tagId || index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative"
                >
                  <Tag
                    tag={tag}
                    className="pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="
                      absolute right-2 top-1/2 -translate-y-1/2
                      text-muted-foreground hover:text-foreground
                      text-sm font-bold
                      transition-colors
                    "
                  >
                    ×
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      
      <p className="mt-2 text-xs text-muted-foreground">
        Press Enter to add a tag. Click × to remove.
      </p>
    </div>
  );
}
