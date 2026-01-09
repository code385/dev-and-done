'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function ProjectCard({ project }) {
  const statusColors = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    completed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'on-hold': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  };

  const statusLabels = {
    active: 'Active',
    completed: 'Completed',
    'on-hold': 'On Hold',
  };

  return (
    <Link
      href={`/client/projects/${project._id}`}
      className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 block"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[project.status] || statusColors.active}`}
        >
          {statusLabels[project.status] || 'Active'}
        </span>
      </div>

      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {project.description || 'No description available'}
      </p>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {project.startDate
              ? format(new Date(project.startDate), 'MMM d, yyyy')
              : 'No start date'}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

