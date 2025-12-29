'use client';

import { useState, useEffect } from 'react';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [viewingBookings, setViewingBookings] = useState(false);

  const fetchBookings = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bookings?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
        setViewingBookings(true);
      } else {
        toast.error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by user' }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } else {
        toast.error(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      confirmed: 'bg-green-500/10 text-green-500',
      completed: 'bg-blue-500/10 text-blue-500',
      cancelled: 'bg-red-500/10 text-red-500',
      rescheduled: 'bg-purple-500/10 text-purple-500',
    };
    return colors[status] || colors.pending;
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            My Bookings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            View and manage your service bookings
          </motion.p>
        </div>

        {!viewingBookings ? (
          <Card>
            <h2 className="text-2xl font-bold mb-4">Enter Your Email</h2>
            <p className="text-muted-foreground mb-6">
              Enter the email address you used to make your booking to view your bookings.
            </p>
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchBookings()}
                className="flex-1"
              />
              <Button onClick={fetchBookings} variant="primary">
                View Bookings
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="mb-6 flex gap-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchBookings()}
                className="flex-1"
              />
              <Button onClick={fetchBookings} variant="outline">
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <p className="text-center text-muted-foreground py-8">
                  No bookings found for this email address.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold">{booking.serviceName}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p>
                              <strong className="text-foreground">Date:</strong>{' '}
                              {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                            <p>
                              <strong className="text-foreground">Time:</strong> {booking.preferredTime}
                            </p>
                            <p>
                              <strong className="text-foreground">Duration:</strong> {booking.duration} minutes
                            </p>
                            {booking.meetingLink && (
                              <p>
                                <strong className="text-foreground">Meeting Link:</strong>{' '}
                                <a
                                  href={booking.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  Join Meeting
                                </a>
                              </p>
                            )}
                            {booking.message && (
                              <p>
                                <strong className="text-foreground">Message:</strong> {booking.message}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {booking.status === 'pending' && (
                          <Button
                            variant="outline"
                            onClick={() => cancelBooking(booking._id)}
                            className="md:ml-4"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Section>
  );
}

