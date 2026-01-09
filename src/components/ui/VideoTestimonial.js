'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import Image from 'next/image';
import { Play, X } from 'lucide-react';

export default function VideoTestimonial({ testimonial, index = 0 }) {
  const { name, role, company, testimonial: text, rating, image, videoUrl } = testimonial;
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  if (!videoUrl) {
    return null;
  }

  // Extract YouTube embed URL from iframe HTML if needed
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // If it's already a clean YouTube embed URL, return it
    if (url.startsWith('https://www.youtube.com/embed/') || url.startsWith('https://youtube.com/embed/')) {
      return url;
    }
    
    // If it's a YouTube watch URL, convert to embed URL
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (watchMatch) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    // If it contains iframe HTML, extract the src URL
    const iframeMatch = url.match(/src=["']([^"']+)["']/);
    if (iframeMatch) {
      const extractedUrl = iframeMatch[1];
      // If extracted URL is already an embed URL, return it
      if (extractedUrl.includes('youtube.com/embed/')) {
        return extractedUrl;
      }
      // If it's a watch URL, convert it
      const watchMatch2 = extractedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (watchMatch2) {
        return `https://www.youtube.com/embed/${watchMatch2[1]}`;
      }
      return extractedUrl;
    }
    
    // Return as-is if no pattern matches
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <Card hover className="h-full cursor-pointer" onClick={() => setIsVideoOpen(true)}>
          <div className="flex flex-col h-full">
            {/* Video Thumbnail */}
            <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Play className="w-16 h-16 text-primary" fill="currentColor" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Rating */}
            {rating && (
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            )}

            {/* Testimonial Text */}
            <p className="text-muted-foreground mb-6 flex-grow italic">
              "{text}"
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              {image ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-semibold text-lg">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{name}</h4>
                <p className="text-sm text-muted-foreground truncate">
                  {role && company ? `${role} at ${company}` : role || company || 'Client'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Video Modal */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsVideoOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-primary transition-colors"
              aria-label="Close video"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Testimonial from ${name}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Invalid video URL</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

