'use client';

import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Link from 'next/link';

export default function BookCard({ book }) {
  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < Math.floor(book.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
      ★
    </span>
  ));

  return (
    <Card hover className="h-full flex flex-col">
      {book.coverImage && (
        <div className="mb-4 aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <div className="mb-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {book.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{book.title}</h3>
        
        <p className="text-sm text-muted-foreground mb-2">By {book.author}</p>
        
        <p className="text-sm text-foreground mb-4 line-clamp-3 flex-1">
          {book.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {ratingStars}
          </div>
          <span className="text-sm text-muted-foreground">
            {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings'} 
            {book.reviewCount > 0 && ` (${book.reviewCount} reviews)`}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>{book.views || 0} views</span>
          {book.featured && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">Featured</span>
          )}
        </div>
        
        <Link href={`/books/${book._id}`} className="mt-auto">
          <Button variant="primary" className="w-full">
            Read Book
          </Button>
        </Link>
      </div>
    </Card>
  );
}

