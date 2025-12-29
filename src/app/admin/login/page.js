'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section className="pt-24 pb-16 min-h-screen flex items-center">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
              <p className="text-muted-foreground">Sign in to access the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}

