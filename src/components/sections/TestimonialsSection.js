'use client';

import { useState, useEffect } from 'react';
import Section from '../ui/Section';
import TestimonialCard from '../ui/TestimonialCard';
import VideoTestimonial from '../ui/VideoTestimonial';
import { motion } from 'framer-motion';

export default function TestimonialsSection({ serviceType, featured, limit = 6 }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, [serviceType, featured, limit]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (serviceType) params.append('serviceType', serviceType);
      if (featured) params.append('featured', 'true');
      params.append('limit', limit.toString());

      const response = await fetch(`/api/testimonials?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.testimonials || []);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Section id="testimonials" className="bg-muted/50">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </Section>
    );
  }

  if (error || testimonials.length === 0) {
    return null;
  }

  // Separate video and regular testimonials
  const videoTestimonials = testimonials.filter(t => t.videoUrl);
  const regularTestimonials = testimonials.filter(t => !t.videoUrl);

  return (
    <Section id="testimonials" className="bg-muted/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our clients have to say about working with us.
        </p>
      </motion.div>

      {/* Video Testimonials */}
      {videoTestimonials.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-center">Video Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTestimonials.map((testimonial, index) => (
              <VideoTestimonial
                key={testimonial._id.toString()}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Testimonials */}
      {regularTestimonials.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularTestimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial._id.toString()}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      )}
    </Section>
  );
}

