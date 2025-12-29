'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Card from '../ui/Card';
import toast from 'react-hot-toast';
import { services } from '@/data/services';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  serviceName: z.string().min(1, 'Service name is required'),
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientEmail: z.string().email('Invalid email address'),
  clientPhone: z.string().optional(),
  company: z.string().optional(),
  bookingDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  timezone: z.string().default('UTC'),
  duration: z.number().min(30).max(240).default(60),
  message: z.string().optional(),
});

export default function ServiceBookingForm({ onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: 60,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
  });

  const selectedServiceId = watch('serviceId');
  const selectedService = services.find(s => s.id === selectedServiceId);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM',
  ];

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Booking request submitted successfully! We\'ll confirm shortly.');
        if (onSuccess) onSuccess(result.booking);
        // Reset form
        setValue('serviceId', '');
        setValue('clientName', '');
        setValue('clientEmail', '');
        setValue('clientPhone', '');
        setValue('company', '');
        setValue('bookingDate', '');
        setValue('preferredTime', '');
        setValue('message', '');
      } else {
        toast.error(result.error || 'Failed to submit booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleServiceChange = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setValue('serviceId', serviceId);
      setValue('serviceName', service.title);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3 months in advance
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Book a Service</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Service <span className="text-error">*</span>
          </label>
          <select
            {...register('serviceId')}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Choose a service...</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="mt-1 text-sm text-error">{errors.serviceId.message}</p>
          )}
        </div>

        {/* Client Information */}
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            {...register('clientName')}
            error={errors.clientName?.message}
            required
          />
          <Input
            label="Email"
            type="email"
            {...register('clientEmail')}
            error={errors.clientEmail?.message}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Phone (Optional)"
            type="tel"
            {...register('clientPhone')}
            error={errors.clientPhone?.message}
          />
          <Input
            label="Company (Optional)"
            {...register('company')}
            error={errors.company?.message}
          />
        </div>

        {/* Booking Date and Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Preferred Date <span className="text-error">*</span>
            </label>
            <input
              type="date"
              {...register('bookingDate')}
              min={today}
              max={maxDateStr}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.bookingDate && (
              <p className="mt-1 text-sm text-error">{errors.bookingDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Preferred Time <span className="text-error">*</span>
            </label>
            <select
              {...register('preferredTime')}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select time...</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.preferredTime && (
              <p className="mt-1 text-sm text-error">{errors.preferredTime.message}</p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Duration (minutes)
          </label>
          <select
            {...register('duration', { valueAsNumber: true })}
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </select>
        </div>

        {/* Message */}
        <Textarea
          label="Additional Message (Optional)"
          {...register('message')}
          error={errors.message?.message}
          rows={4}
          placeholder="Tell us about your project or any specific requirements..."
        />

        <input type="hidden" {...register('serviceName')} />
        <input type="hidden" {...register('timezone')} />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Book Service'}
        </Button>
      </form>
    </Card>
  );
}

