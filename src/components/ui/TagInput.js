'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Tag from './Tag';

export default function TagInput({ value = [], onChange, placeholder = 'Add tags...' }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`/api/tags?limit=5`);
      const data = await response.json();

      if (data.success) {
        const filtered = data.tags
          .filter(tag => 
            tag.name.toLowerCase().includes(query.toLowerCase()) &&
            !value.some(v => (typeof v === 'string' ? v : v.name) === tag.name)
          )
          .slice(0, 5);
        setSuggestions(filtered);
      }
    } catch (error) {
      console.error('Error fetching tag suggestions:', error);
    }
  };

  const handleAddTag = (tagName) => {
    const normalized = tagName.toLowerCase().trim();
    if (normalized && !value.some(v => (typeof v === 'string' ? v : v.name) === normalized)) {
      onChange([...value, normalized]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter(v => (typeof v === 'string' ? v : v.name) !== (typeof tagToRemove === 'string' ? tagToRemove : tagToRemove.name)));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1]);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border border-border rounded-lg bg-muted min-h-[42px]">
        {value.map((tag, index) => (
          <div key={index} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
            <span>{typeof tag === 'string' ? tag : tag.name}</span>
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-primary-dark"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {suggestions.map((tag) => (
            <button
              key={tag._id?.toString() || tag.name}
              onClick={() => handleAddTag(tag.name)}
              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

