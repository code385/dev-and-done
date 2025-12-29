'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { trackEvent } from '@/lib/analytics/track';
import { AnalyticsEvents } from '@/lib/analytics/events';
import Input from './Input';
import Button from './Button';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
});

export default function NewsletterSignup({ className = '' }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        trackEvent(AnalyticsEvents.NEWSLETTER_SUBSCRIBE, { email: data.email });
        toast.success('Successfully subscribed to our newsletter!');
        reset();
      } else {
        toast.error(result.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Enter your email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          disabled={isSubmitting}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}

