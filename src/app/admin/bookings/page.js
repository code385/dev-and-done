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

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [filter, setFilter] = useState({ status: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (bookings.length === 0) {
      fetchBookings();
    }
  }, [filter.status]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (!data.success) {
        router.push('/admin/login');
      } else {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/admin/login');
    }
  };

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (filter.status) params.append('status', filter.status);
      if (filter.search) params.append('search', filter.search);

      const response = await fetch(`/api/bookings?${params}`);
      
      // Check if response is OK and is JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        toast.error(`Failed to fetch bookings: ${response.status}`);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid response type:', contentType, text.substring(0, 200));
        toast.error('Invalid response from server');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
        setPagination(data.pagination || { page, limit: 20, total: 0, pages: 0 });
      } else {
        toast.error(data.error || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status, additionalData = {}) => {
    setUpdating({ ...updating, [bookingId]: true });
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...additionalData }),
      });

      // Check if response is OK and is JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error:', response.status, errorText);
        toast.error(`Failed to update booking: ${response.status}`);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Invalid response type:', contentType, text.substring(0, 200));
        toast.error('Invalid response from server');
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Booking updated successfully');
        fetchBookings(pagination.page);
      } else {
        toast.error(data.error || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking. Please try again.');
    } finally {
      setUpdating({ ...updating, [bookingId]: false });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
      completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
      rescheduled: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString, time) => {
    const date = new Date(dateString);
    return `${formatDate(dateString)} at ${time}`;
  };

  return (
    <Section className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Service Bookings</h1>
            <p className="text-muted-foreground">Manage all service booking requests</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status Filter</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-4 py-2 bg-muted border border-border rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search by name, email, or service..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && fetchBookings(1)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => fetchBookings(1)} variant="primary" className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <p className="text-center text-muted-foreground py-8">No bookings found.</p>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{booking.serviceName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Booking ID: {booking._id.toString().slice(-8)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Client</p>
                            <p className="font-medium">{booking.clientName}</p>
                            <p className="text-sm text-muted-foreground">{booking.clientEmail}</p>
                            {booking.clientPhone && (
                              <p className="text-sm text-muted-foreground">{booking.clientPhone}</p>
                            )}
                            {booking.company && (
                              <p className="text-sm text-muted-foreground">{booking.company}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Booking Details</p>
                            <p className="font-medium">{formatDateTime(booking.bookingDate, booking.preferredTime)}</p>
                            <p className="text-sm text-muted-foreground">
                              Duration: {booking.duration} minutes
                            </p>
                            {booking.timezone && (
                              <p className="text-sm text-muted-foreground">Timezone: {booking.timezone}</p>
                            )}
                          </div>
                        </div>

                        {booking.message && (
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-1">Message</p>
                            <p className="text-sm bg-muted p-3 rounded-lg">{booking.message}</p>
                          </div>
                        )}

                        {booking.meetingLink && (
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-1">Meeting Link</p>
                            <a
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm"
                            >
                              {booking.meetingLink}
                            </a>
                          </div>
                        )}

                        {booking.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-1">Admin Notes</p>
                            <p className="text-sm bg-muted p-3 rounded-lg">{booking.notes}</p>
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(booking.createdAt).toLocaleString()}
                          {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                            <> | Updated: {new Date(booking.updatedAt).toLocaleString()}</>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 lg:w-64">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              variant="primary"
                              onClick={() => {
                                const meetingLink = prompt('Enter meeting link (optional):');
                                updateBookingStatus(booking._id, 'confirmed', {
                                  meetingLink: meetingLink || undefined,
                                });
                              }}
                              disabled={updating[booking._id]}
                              className="w-full"
                            >
                              {updating[booking._id] ? 'Updating...' : 'Confirm Booking'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const reason = prompt('Cancellation reason (optional):');
                                updateBookingStatus(booking._id, 'cancelled', {
                                  cancellationReason: reason || undefined,
                                });
                              }}
                              disabled={updating[booking._id]}
                              className="w-full"
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="primary"
                            onClick={() => updateBookingStatus(booking._id, 'completed')}
                            disabled={updating[booking._id]}
                            className="w-full"
                          >
                            {updating[booking._id] ? 'Updating...' : 'Mark as Completed'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const notes = prompt('Add admin notes:', booking.notes || '');
                            if (notes !== null) {
                              updateBookingStatus(booking._id, booking.status, { notes });
                            }
                          }}
                          disabled={updating[booking._id]}
                          className="w-full"
                        >
                          {booking.notes ? 'Edit Notes' : 'Add Notes'}
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              const meetingLink = prompt('Update meeting link:', booking.meetingLink || '');
                              if (meetingLink !== null) {
                                updateBookingStatus(booking._id, 'confirmed', {
                                  meetingLink: meetingLink || undefined,
                                });
                              }
                            }}
                            disabled={updating[booking._id]}
                            className="w-full"
                          >
                            {booking.meetingLink ? 'Update Meeting Link' : 'Add Meeting Link'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => fetchBookings(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchBookings(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Section>
  );
}

