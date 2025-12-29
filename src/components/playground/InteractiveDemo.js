'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { demoCategories, allDemos } from '@/data/demoCatalog';

export default function InteractiveDemo({ selectedDemos, setSelectedDemos, onCreatePreview }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter demos based on search
  const filteredDemos = selectedCategory
    ? demoCategories[selectedCategory]?.demos.filter(demo =>
        demo.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    : allDemos.filter(demo =>
        demo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Toggle demo selection
  const toggleDemo = (demoId) => {
    setSelectedDemos(prev => {
      if (prev.includes(demoId)) {
        return prev.filter(id => id !== demoId);
      } else {
        return [...prev, demoId];
      }
    });
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedDemos([]);
  };

  // Handle create preview button
  const handleCreatePreview = () => {
    if (selectedDemos.length === 0) {
      alert('Please select at least one demo to create a preview');
      return;
    }
    if (onCreatePreview) {
      console.log('Creating preview with demos:', selectedDemos);
      onCreatePreview(selectedDemos);
    } else {
      console.error('onCreatePreview function not provided');
      alert('Error: Preview function not available');
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <motion.h3 
          className="text-xl font-semibold mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Interactive Demos
        </motion.h3>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search demos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Selected Demos Counter & Actions */}
        {selectedDemos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-primary/10 rounded-lg border border-primary/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">
                {selectedDemos.length} demo{selectedDemos.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
            <motion.button
              onClick={handleCreatePreview}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-primary text-background rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow"
            >
              ✨ Create Live Preview
            </motion.button>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === null ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All ({allDemos.length})
          </Button>
          {Object.entries(demoCategories).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              {category.name} ({category.demos.length})
            </Button>
          ))}
        </div>

        {/* Demo Grid */}
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <AnimatePresence mode="wait">
              {filteredDemos.map((demo) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedDemos.includes(demo.id) ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => toggleDemo(demo.id)}
                    className="w-full flex flex-col items-center gap-1 h-auto py-3 relative"
                  >
                    <span className="text-2xl">{demo.icon}</span>
                    <span className="text-xs text-center leading-tight">{demo.name}</span>
                    {selectedDemos.includes(demo.id) && (
                      <motion.div
                        layoutId={`activeDemo-${demo.id}`}
                        className="absolute inset-0 bg-primary/20 rounded-lg"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    {selectedDemos.includes(demo.id) && (
                      <motion.div
                        className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {filteredDemos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No demos found matching "{searchQuery}"
          </div>
        )}
      </div>
    </Card>
  );
}
