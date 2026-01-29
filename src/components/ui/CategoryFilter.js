'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CategoryFilter({ onCategoryChange, className = '' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?limit=100');
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }
    
    router.push(`?${params.toString()}`);
    
    if (onCategoryChange) {
      onCategoryChange(categorySlug);
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-sm text-muted-foreground">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-foreground mb-2">
        Filter by Category
      </label>
      <select
        value={selectedCategory}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="
          w-full px-4 py-3 
          bg-muted border border-border 
          rounded-lg 
          text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          transition-all duration-200
          cursor-pointer
        "
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category._id?.toString() || category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      
      {/* Category pills for quick selection */}
      <div className="flex flex-wrap gap-2 mt-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryChange('')}
          className={`
            px-3 py-1 rounded-full text-sm font-medium transition-colors
            ${selectedCategory === '' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }
          `}
        >
          All
        </motion.button>
        {categories.slice(0, 6).map((category) => (
          <motion.button
            key={category._id?.toString() || category.slug}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryChange(category.slug)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
            style={selectedCategory === category.slug && category.color ? {
              backgroundColor: category.color,
              color: '#fff'
            } : {}}
          >
            {category.name}
          </motion.button>
        ))}
      </div>
    </div>
  );
}


