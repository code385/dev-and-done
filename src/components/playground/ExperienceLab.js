'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { demoRegistry, getDemosByCategory } from './demos/core/DemoRegistry';
import PreviewCanvas from './PreviewCanvas';
import StaticScaffold from './StaticScaffold';

/**
 * Experience Lab - Main Component
 * Two-panel layout: Demo Selector (left) + Live Preview (right)
 * Responsive: Stacks vertically on mobile
 */
export default function ExperienceLab() {
  const [selectedDemos, setSelectedDemos] = useState([]);
  const [previewDemos, setPreviewDemos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Get categories
  const categories = ['backgrounds', 'hover', 'typography'];
  
  // Get filtered demos
  const allDemos = Object.entries(demoRegistry).map(([id, config]) => ({
    id,
    ...config,
  }));

  const filteredDemos = selectedCategory
    ? getDemosByCategory(selectedCategory)
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

  // Create preview
  const handleCreatePreview = () => {
    if (selectedDemos.length === 0) {
      alert('Please select at least one demo to create a preview');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setPreviewDemos([...selectedDemos]);
      setIsGenerating(false);
    }, 100);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[400px] sm:h-[500px] lg:h-[calc(100vh-12rem)] gap-3 sm:gap-4 lg:gap-6">
      {/* Left Panel - Demo Selector (Full width on mobile, 35% on desktop) */}
      <div className="w-full lg:w-[35%] lg:flex-shrink-0">
        <Card className="h-full flex flex-col shadow-lg">
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-4 lg:px-6 pt-4 lg:pt-6 pb-4 border-b border-border">
              <motion.h3 
                className="text-lg lg:text-xl font-bold mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Interactive Demos
              </motion.h3>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Select demos to apply to the preview
              </p>
            </div>

            {/* Search */}
            <div className="px-4 lg:px-6 pt-4 pb-3">
              <input
                type="text"
                placeholder="Search demos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 lg:px-4 py-2 lg:py-2.5 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm lg:text-base"
              />
            </div>

            {/* Selected Demos Counter & Action */}
            {selectedDemos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 lg:mx-6 mb-3 lg:mb-4 p-3 lg:p-4 bg-primary/10 rounded-lg border border-primary/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs lg:text-sm font-semibold">
                    {selectedDemos.length} selected
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-xs lg:text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Clear
                  </button>
                </div>
                <motion.button
                  onClick={handleCreatePreview}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-4 lg:px-6 py-2.5 lg:py-3 bg-primary text-background rounded-lg font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl transition-shadow"
                >
                  ✨ Create Live Preview
                </motion.button>
              </motion.div>
            )}

            {/* Category Filters */}
            <div className="px-4 lg:px-6 mb-3 lg:mb-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-primary text-background shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all capitalize ${
                    selectedCategory === category
                      ? 'bg-primary text-background shadow-md'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Demo Grid */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-4 lg:pb-6 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3">
                {filteredDemos.map((demo) => (
                  <motion.button
                    key={demo.id}
                    onClick={() => toggleDemo(demo.id)}
                    className={`relative p-3 lg:p-4 rounded-lg border-2 transition-all text-left group w-full ${
                      selectedDemos.includes(demo.id)
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border bg-muted/50 hover:border-primary/50 hover:bg-muted/70'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between gap-2 w-full">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="text-xs lg:text-sm font-semibold mb-1 break-words leading-tight">
                          {demo.name}
                        </div>
                        <div className="text-[10px] lg:text-xs text-muted-foreground capitalize mt-0.5">
                          {demo.category}
                        </div>
                      </div>
                      {selectedDemos.includes(demo.id) && (
                        <div className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-[10px] lg:text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
              {filteredDemos.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No demos found</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Right Panel - Live Preview (Full width on mobile, 65% on desktop) */}
      <div className="flex-1 min-w-0 h-[300px] sm:h-[350px] lg:h-auto">
        <Card className="h-full flex flex-col shadow-lg">
          <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg lg:text-xl font-bold">Live Preview</h3>
              {previewDemos.length > 0 && (
                <span className="text-xs lg:text-sm text-muted-foreground bg-muted px-2 lg:px-3 py-1 rounded-full">
                  {previewDemos.length} demo{previewDemos.length !== 1 ? 's' : ''} applied
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 lg:w-12 lg:h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-xs lg:text-sm text-muted-foreground">Applying demos...</p>
                </div>
              </div>
            ) : previewDemos.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="text-4xl lg:text-6xl mb-4">🎨</div>
                  <h3 className="text-lg lg:text-xl font-bold mb-2">No Preview Generated</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Select demos and click "Create Live Preview"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto scrollbar-thin bg-background">
                <PreviewCanvas selectedDemoIds={previewDemos}>
                  <StaticScaffold />
                </PreviewCanvas>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
