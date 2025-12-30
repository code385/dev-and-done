'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { trackFormStart, trackFormSubmit } from '@/lib/analytics/track';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
// Email sending is now handled server-side

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  honeypot: z.string().max(0, 'Bot detected'), // Honeypot field
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    trackFormStart('contact');
  }, []);

  const onSubmit = async (data) => {
    // Check honeypot
    if (data.honeypot) {
      return; // Bot detected, silently fail
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Track successful submission
        trackFormSubmit('contact', true);
        
        // Emails are now sent server-side via the API route
        toast.success('Thank you! We\'ll be in touch soon. Check your email for confirmation.');
        reset();
      } else {
        trackFormSubmit('contact', false);
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        {...register('honeypot')}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <Input
        label="Name *"
        {...register('name')}
        error={errors.name?.message}
        disabled={isSubmitting}
      />

      <Input
        label="Email *"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        disabled={isSubmitting}
      />

      <Input
        label="Company (Optional)"
        {...register('company')}
        disabled={isSubmitting}
      />

      <Textarea
        label="Message *"
        rows={6}
        {...register('message')}
        error={errors.message?.message}
        disabled={isSubmitting}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  );
}

