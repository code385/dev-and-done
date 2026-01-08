'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatsWidget from '@/components/admin/StatsWidget';
import ActivityFeed from '@/components/admin/ActivityFeed';
import { BookingsChart, BookingStatusChart } from '@/components/admin/Charts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [founder, setFounder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [bookingsOverTime, setBookingsOverTime] = useState([]);
  const [bookingStatuses, setBookingStatuses] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setBookingsOverTime(data.bookingsOverTime || []);
        setBookingStatuses(data.bookingStatuses || {});
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

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

        {/* Stats Widgets */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsWidget
              title="Total Bookings"
              value={stats.totalBookings || 0}
              icon="📅"
            />
            <StatsWidget
              title="Published Books"
              value={stats.totalBooks || 0}
              icon="📚"
            />
            <StatsWidget
              title="Published Blogs"
              value={stats.totalBlogs || 0}
              icon="📝"
            />
            <StatsWidget
              title="Testimonials"
              value={stats.totalTestimonials || 0}
              icon="💬"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {bookingsOverTime.length > 0 && (
            <BookingsChart data={bookingsOverTime} />
          )}
          {Object.keys(bookingStatuses).length > 0 && (
            <BookingStatusChart data={bookingStatuses} />
          )}
        </div>

        {/* Activity Feed and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ActivityFeed activities={recentActivity} />
          </div>
          <Card>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/admin/books" className="block">
                <Button variant="outline" className="w-full justify-start">
                  📚 Add New Book
                </Button>
              </Link>
              <Link href="/admin/blogs" className="block">
                <Button variant="outline" className="w-full justify-start">
                  📝 Create Blog Post
                </Button>
              </Link>
              <Link href="/admin/testimonials" className="block">
                <Button variant="outline" className="w-full justify-start">
                  💬 Add Testimonial
                </Button>
              </Link>
              <Link href="/admin/faqs" className="block">
                <Button variant="outline" className="w-full justify-start">
                  ❓ Add FAQ
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Management Cards */}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card hover className="h-full">
              <Link href="/admin/testimonials">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-xl font-bold mb-2">Testimonials</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage client testimonials
                  </p>
                </div>
              </Link>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card hover className="h-full">
              <Link href="/admin/faqs">
                <div className="text-center">
                  <div className="text-4xl mb-4">❓</div>
                  <h3 className="text-xl font-bold mb-2">FAQs</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage frequently asked questions
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

