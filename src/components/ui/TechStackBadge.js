'use client';

export default function TechStackBadge({ tech, className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        text-xs font-medium
        bg-primary/10 text-primary border border-primary/20
        ${className}
      `}
    >
      {tech}
    </span>
  );
}

