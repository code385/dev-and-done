'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Tag({ tag, href, onClick, className = '' }) {
  const content = (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors ${className}`}
    >
      {typeof tag === 'string' ? tag : tag.name}
    </motion.span>
  );

  if (onClick) {
    return (
      <button onClick={() => onClick(tag)} className="cursor-pointer">
        {content}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}

