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

const categories = [
  'general',
  'web-development',
  'mobile-development',
  'ai-solutions',
  'ui-ux-engineering',
  'maintenance-scaling',
  'pricing',
  'process',
];

export default function AdminFAQsPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    order: 0,
    isPublished: false,
  });

  useEffect(() => {
    checkAuth();
    fetchFAQs();
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

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/faqs?limit=100&includeUnpublished=true');
      const data = await response.json();

      if (data.success) {
        setFaqs(data.faqs || []);
      } else {
        toast.error(data.error || 'Failed to load FAQs');
        setFaqs([]);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingFAQ
        ? `/api/faqs/${editingFAQ._id}`
        : '/api/faqs';
      const method = editingFAQ ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingFAQ ? 'FAQ updated!' : 'FAQ created!');
        setShowForm(false);
        setEditingFAQ(null);
        resetForm();
        fetchFAQs();
      } else {
        toast.error(data.error || 'Failed to save FAQ');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Failed to save FAQ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'general',
      order: faq.order || 0,
      isPublished: faq.isPublished || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/faqs/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('FAQ deleted!');
        fetchFAQs();
      } else {
        toast.error(data.error || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      order: 0,
      isPublished: false,
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
            <h1 className="text-4xl font-bold mb-2">FAQ Management</h1>
            <p className="text-muted-foreground">Manage frequently asked questions</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setEditingFAQ(null);
              setShowForm(!showForm);
            }}
          >
            {showForm ? 'Cancel' : '+ Add FAQ'}
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
                  {editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Question *</label>
                      <Input
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        required
                        placeholder="Enter the question"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Answer *</label>
                      <Textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        required
                        rows={6}
                        placeholder="Enter the answer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Order</label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        placeholder="Display order"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span>Published</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <Spinner /> : editingFAQ ? 'Update' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingFAQ(null);
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

        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq._id.toString()} hover>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {faq.category.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      faq.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {faq.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Order: {faq.order} | Views: {faq.views || 0} | Helpful: {faq.helpful || 0}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="text-primary hover:text-primary-dark"
                    aria-label="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(faq._id.toString())}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {faqs.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No FAQs yet. Create your first one!</p>
          </div>
        )}
      </div>
    </Section>
  );
}
