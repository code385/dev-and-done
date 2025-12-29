'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminFoundersPage() {
  const router = useRouter();
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (!data.success) {
        router.push('/admin/login');
        return;
      }

      fetchFounders();
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/admin/login');
    }
  };

  const fetchFounders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/founders');
      const data = await response.json();

      if (data.success) {
        setFounders(data.founders);
      } else {
        toast.error('Failed to load founders');
      }
    } catch (error) {
      console.error('Error fetching founders:', error);
      toast.error('Failed to load founders');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/founders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Founder created successfully!');
        setShowForm(false);
        setFormData({ name: '', email: '', password: '' });
        fetchFounders();
      } else {
        toast.error(data.error || 'Failed to create founder');
      }
    } catch (error) {
      console.error('Error creating founder:', error);
      toast.error('Failed to create founder');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Founder Management</h1>
            <p className="text-muted-foreground">Manage co-founder accounts</p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ name: '', email: '', password: '' });
            }}
          >
            {showForm ? 'Cancel' : 'Add New Founder'}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Founder</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Founder'}
              </Button>
            </form>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {founders.length === 0 ? (
              <Card>
                <p className="text-center text-muted-foreground py-8">
                  No founders found.
                </p>
              </Card>
            ) : (
              founders.map((founder, index) => (
                <motion.div
                  key={founder._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{founder.name}</h3>
                        <p className="text-muted-foreground">{founder.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Role: {founder.role} • Status: {founder.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

