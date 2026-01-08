'use client';

import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <p className="text-muted-foreground text-center py-8">No recent activity</p>
      </Card>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'contact':
        return '📧';
      case 'book':
        return '📚';
      case 'blog':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <Card>
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
          >
            <span className="text-2xl">{getIcon(activity.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{activity.title}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

