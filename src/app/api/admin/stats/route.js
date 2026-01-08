import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/verify';
import clientPromise from '@/lib/mongodb/connect';
import * as BookModel from '@/lib/mongodb/models/Book';
import * as BlogModel from '@/lib/mongodb/models/Blog';
import * as BookingModel from '@/lib/mongodb/models/ServiceBooking';
import * as TestimonialModel from '@/lib/mongodb/models/Testimonial';
import * as FAQModel from '@/lib/mongodb/models/FAQ';

const DB_NAME = 'devanddone';

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    await requireAuth();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Get counts
    const [
      totalBookings,
      totalBooks,
      totalBlogs,
      totalTestimonials,
      totalFAQs,
      recentBookings,
      recentContacts,
    ] = await Promise.all([
      db.collection('servicebookings').countDocuments(),
      db.collection('books').countDocuments(),
      db.collection('blogs').countDocuments({ isPublished: true }),
      db.collection('testimonials').countDocuments({ isApproved: true }),
      db.collection('faqs').countDocuments({ isPublished: true }),
      db.collection('servicebookings')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      db.collection('contacts')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    // Get booking status breakdown
    const bookingStatuses = await db.collection('servicebookings')
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    // Get bookings over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingsOverTime = await db.collection('servicebookings')
      .aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ])
      .toArray();

    // Get content views (if analytics collection exists)
    let contentViews = { blogs: 0, books: 0 };
    try {
      const viewsResult = await db.collection('analytics')
        .aggregate([
          {
            $match: {
              type: { $in: ['BLOG_VIEW', 'BOOK_VIEW'] },
            },
          },
          {
            $group: {
              _id: '$type',
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      viewsResult.forEach((item) => {
        if (item._id === 'BLOG_VIEW') contentViews.blogs = item.count;
        if (item._id === 'BOOK_VIEW') contentViews.books = item.count;
      });
    } catch (error) {
      // Analytics collection might not exist
      console.log('Analytics collection not found');
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalBookings,
        totalBooks,
        totalBlogs,
        totalTestimonials,
        totalFAQs,
        contentViews,
      },
      bookingStatuses: bookingStatuses.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      bookingsOverTime: bookingsOverTime.map(item => ({
        date: item._id,
        count: item.count,
      })),
      recentActivity: [
        ...recentBookings.map(booking => ({
          type: 'booking',
          title: `New booking: ${booking.serviceType}`,
          date: booking.createdAt,
          id: booking._id.toString(),
        })),
        ...recentContacts.map(contact => ({
          type: 'contact',
          title: `New contact: ${contact.name}`,
          date: contact.createdAt,
          id: contact._id.toString(),
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
    });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

