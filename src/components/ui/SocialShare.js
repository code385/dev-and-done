'use client';

import { useState } from 'react';
import { trackContentShare } from '@/lib/analytics/track';
import toast from 'react-hot-toast';

/**
 * SocialShare Component
 * Provides social sharing buttons for Facebook, Twitter, LinkedIn, WhatsApp, and Copy Link
 * 
 * @param {Object} props
 * @param {string} props.url - The URL to share
 * @param {string} props.title - The title of the content
 * @param {string} props.description - The description/excerpt of the content
 * @param {string} props.contentType - Type of content (blog, book, work)
 * @param {string} props.contentId - ID of the content being shared
 * @param {string} props.image - Optional image URL for OG tags
 * @param {string} props.variant - Display variant: 'horizontal' | 'vertical' | 'compact'
 * @param {string} props.size - Button size: 'sm' | 'md' | 'lg'
 */
export default function SocialShare({
  url,
  title,
  description = '',
  contentType = 'content',
  contentId = '',
  image = '',
  variant = 'horizontal',
  size = 'md',
}) {
  const [copied, setCopied] = useState(false);

  // Ensure we have a full URL
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check this out!';
  const shareText = description || shareTitle;

  // Get base URL for absolute URLs
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const fullUrl = shareUrl.startsWith('http') ? shareUrl : `${baseUrl}${shareUrl}`;

  const handleShare = async (platform) => {
    let shareLink = '';
    const encodedUrl = encodeURIComponent(fullUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedText = encodeURIComponent(shareText);

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(fullUrl);
          setCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
          // Track the share
          trackContentShare('copy', contentType, contentId, fullUrl);
          // Also track via share API
          fetch('/api/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              platform: 'copy',
              contentType,
              contentId,
              url: fullUrl,
            }),
          }).catch(() => {}); // Silently fail if tracking fails
          return;
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = fullUrl;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
            trackContentShare('copy', contentType, contentId, fullUrl);
            // Also track via share API
            fetch('/api/share', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                platform: 'copy',
                contentType,
                contentId,
                url: fullUrl,
              }),
            }).catch(() => {}); // Silently fail if tracking fails
          } catch (fallbackErr) {
            toast.error('Failed to copy link');
          }
          document.body.removeChild(textArea);
          return;
        }
      default:
        return;
    }

    // Open share window
    const width = 600;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      shareLink,
      'share',
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0`
    );

    // Track the share
    trackContentShare(platform, contentType, contentId, fullUrl);
    // Also track via share API for detailed statistics
    fetch('/api/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform,
        contentType,
        contentId,
        url: fullUrl,
      }),
    }).catch(() => {}); // Silently fail if tracking fails
  };

  const buttonClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const containerClasses = {
    horizontal: 'flex items-center gap-2',
    vertical: 'flex flex-col items-center gap-2',
    compact: 'flex items-center gap-1',
  };

  const socialButtons = [
    {
      platform: 'facebook',
      label: 'Share on Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      platform: 'twitter',
      label: 'Share on Twitter',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'hover:bg-sky-500 hover:text-white',
    },
    {
      platform: 'linkedin',
      label: 'Share on LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'hover:bg-blue-700 hover:text-white',
    },
    {
      platform: 'whatsapp',
      label: 'Share on WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      color: 'hover:bg-green-500 hover:text-white',
    },
    {
      platform: 'copy',
      label: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'hover:bg-gray-600 hover:text-white',
    },
  ];

  return (
    <div className={containerClasses[variant]}>
      {socialButtons.map(({ platform, label, icon, color }) => (
        <button
          key={platform}
          onClick={() => handleShare(platform)}
          aria-label={label}
          className={`
            ${buttonClasses[size]}
            flex items-center justify-center
            rounded-full
            border border-border
            bg-background
            text-foreground
            transition-all
            duration-200
            ${color}
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            focus:ring-offset-2
          `}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

