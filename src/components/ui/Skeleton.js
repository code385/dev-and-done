'use client';

export default function Skeleton({ className = '', variant = 'default' }) {
  const baseClasses = 'animate-pulse bg-muted rounded';
  
  const variants = {
    default: '',
    text: 'h-4',
    heading: 'h-6',
    title: 'h-8',
    avatar: 'rounded-full',
    card: 'h-48',
    image: 'aspect-video',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
}
