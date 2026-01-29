'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EventTracker({ onEventTypeChange }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics');
      const data = await response.json();

      if (data.success && data.data.eventCounts) {
        setEvents(data.data.eventCounts);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeClick = (type) => {
    const newType = selectedType === type ? '' : type;
    setSelectedType(newType);
    if (onEventTypeChange) {
      onEventTypeChange(newType);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading events...
      </div>
    );
  }

  const totalEvents = events.reduce((sum, event) => sum + event.count, 0);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Event Types</h3>
        <p className="text-sm text-muted-foreground">
          Total events: <span className="font-semibold">{totalEvents}</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.map((event, index) => {
          const percentage = totalEvents > 0 ? Math.round((event.count / totalEvents) * 100) : 0;
          
          return (
            <motion.button
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleTypeClick(event._id)}
              className={`
                p-4 rounded-lg border transition-all text-left
                ${selectedType === event._id
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-muted hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{event._id}</span>
                <span className="text-xs text-muted-foreground">{percentage}%</span>
              </div>
              <div className="text-2xl font-bold">{event.count}</div>
              <div className="mt-2 h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}


