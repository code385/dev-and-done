'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [founder, setFounder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if authenticated by trying to access a protected endpoint
      const response = await fetch('/api/auth/me');
      const data = await response.json();

      if (data.success) {
        setFounder(data.founder);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <Section className="pt-24 pb-16">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {founder?.name || 'Founder'}!
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card hover className="h-full">
              <Link href="/admin/books">
                <div className="text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-bold mb-2">Book Management</h3>
                  <p className="text-muted-foreground text-sm">
                    Upload and manage books in the Founder's Library
                  </p>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card hover className="h-full">
              <Link href="/admin/bookings">
                <div className="text-center">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-xl font-bold mb-2">Service Bookings</h3>
                  <p className="text-muted-foreground text-sm">
                    View and manage service bookings
                  </p>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card hover className="h-full">
              <Link href="/admin/blogs">
                <div className="text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-bold mb-2">Blog Management</h3>
                  <p className="text-muted-foreground text-sm">
                    Create and manage blog posts
                  </p>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card hover className="h-full">
              <Link href="/admin/founders">
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-xl font-bold mb-2">Founders</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage founder accounts
                  </p>
                </div>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

