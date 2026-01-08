'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

const serviceTypes = [
  'general',
  'web-development',
  'mobile-development',
  'ai-solutions',
  'ui-ux-engineering',
  'maintenance-scaling',
];

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    testimonial: '',
    rating: 5,
    serviceType: 'general',
    image: '',
    videoUrl: '',
    isApproved: false,
    featured: false,
  });

  useEffect(() => {
    checkAuth();
    fetchTestimonials();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (!data.success) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/admin/login');
    }
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/testimonials?limit=100');
      const data = await response.json();

      if (data.success) {
        setTestimonials(data.testimonials || []);
      } else {
        toast.error(data.error || 'Failed to load testimonials');
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingTestimonial
        ? `/api/testimonials/${editingTestimonial._id}`
        : '/api/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingTestimonial ? 'Testimonial updated!' : 'Testimonial created!');
        setShowForm(false);
        setEditingTestimonial(null);
        resetForm();
        fetchTestimonials();
      } else {
        toast.error(data.error || 'Failed to save testimonial');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name || '',
      role: testimonial.role || '',
      company: testimonial.company || '',
      testimonial: testimonial.testimonial || '',
      rating: testimonial.rating || 5,
      serviceType: testimonial.serviceType || 'general',
      image: testimonial.image || '',
      videoUrl: testimonial.videoUrl || '',
      isApproved: testimonial.isApproved || false,
      featured: testimonial.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Testimonial deleted!');
        fetchTestimonials();
      } else {
        toast.error(data.error || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      testimonial: '',
      rating: 5,
      serviceType: 'general',
      image: '',
      videoUrl: '',
      isApproved: false,
      featured: false,
    });
  };

  if (loading) {
    return (
      <Section className="pt-24 pb-16">
        <div className="text-center py-12">
          <Spinner />
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Testimonials Management</h1>
            <p className="text-muted-foreground">Manage client testimonials</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingTestimonial(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancel' : '+ Add Testimonial'}
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card>
                <h2 className="text-2xl font-bold mb-6">
                  {editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Client name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Role</label>
                      <Input
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g., CEO, CTO"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Type</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        {serviceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating (1-5)</label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Image URL</label>
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Video URL</label>
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="YouTube/Vimeo embed URL"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Testimonial *</label>
                      <Textarea
                        value={formData.testimonial}
                        onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                        required
                        rows={5}
                        placeholder="Client testimonial text..."
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isApproved}
                          onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span>Approved</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span>Featured</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <Spinner /> : editingTestimonial ? 'Update' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingTestimonial(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id.toString()} hover>
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role && testimonial.company
                        ? `${testimonial.role} at ${testimonial.company}`
                        : testimonial.role || testimonial.company || 'Client'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-primary hover:text-primary-dark"
                      aria-label="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id.toString())}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic flex-grow mb-4 line-clamp-3">
                  "{testimonial.testimonial}"
                </p>
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <span className={`text-xs px-2 py-1 rounded ${testimonial.isApproved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {testimonial.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  {testimonial.featured && (
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      Featured
                    </span>
                  )}
                  {testimonial.videoUrl && (
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-500">
                      Video
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {testimonials.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No testimonials yet. Create your first one!</p>
          </div>
        )}
      </div>
    </Section>
  );
}

