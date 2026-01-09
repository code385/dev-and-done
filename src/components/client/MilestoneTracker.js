'use client';

import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function MilestoneTracker({ milestones = [] }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-muted-foreground" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'pending':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  if (milestones.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No milestones yet</h3>
        <p className="text-muted-foreground">
          Milestones will appear here once they're created for this project.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone) => {
        const isOverdue = milestone.dueDate && 
          new Date(milestone.dueDate) < new Date() && 
          milestone.status !== 'completed';

        return (
          <div
            key={milestone.id || milestone._id?.toString()}
            className={`bg-card border rounded-xl p-5 transition-all ${
              isOverdue ? 'border-red-500/50 bg-red-500/5' : 'border-border'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  {getStatusIcon(milestone.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground mb-1">
                    {milestone.title}
                  </h4>
                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {milestone.description}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(milestone.status)}`}
              >
                {getStatusLabel(milestone.status)}
              </span>
            </div>

            {milestone.dueDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  Due: {format(new Date(milestone.dueDate), 'MMM d, yyyy')}
                  {isOverdue && ' (Overdue)'}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

