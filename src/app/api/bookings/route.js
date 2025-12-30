import { NextResponse } from 'next/server';
import * as ServiceBookingModel from '@/lib/mongodb/models/ServiceBooking';
import { sendServiceBookingEmail, sendBookingConfirmationEmail } from '@/lib/email/service';

// GET /api/bookings - Get bookings (filtered by email if provided, admin can see all)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter = {};
    
    // If email is provided, filter by email (for user view)
    if (email) {
      filter.clientEmail = email.toLowerCase();
    }
    
    // Status filter
    if (status) {
      filter.status = status;
    }
    
    // Search filter (for admin - searches name, email, service)
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { clientName: searchRegex },
        { clientEmail: searchRegex },
        { serviceName: searchRegex },
      ];
    }

    const result = await ServiceBookingModel.getServiceBookings(filter, {
      page,
      limit,
      sort: { createdAt: -1 }, // Most recent first
    });

    return NextResponse.json({
      success: true,
      bookings: result.bookings || [],
      pagination: result.pagination || { page, limit, total: 0, pages: 0 },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Always return JSON, even on error
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch bookings',
        bookings: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 }
      },
      { status: 500 }
    );
  }
}

// POST /api/bookings - Create a new service booking
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      serviceId,
      serviceName,
      clientName,
      clientEmail,
      clientPhone,
      company,
      bookingDate,
      preferredTime,
      timezone,
      duration,
      message,
    } = body;

    // Validation
    if (!serviceId || !serviceName || !clientName || !clientEmail || !bookingDate || !preferredTime) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Check if booking date is in the past
    const bookingDateTime = new Date(bookingDate);
    if (bookingDateTime < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Booking date cannot be in the past' },
        { status: 400 }
      );
    }

    // Check for conflicting bookings (same time slot)
    const conflictingBooking = await ServiceBookingModel.checkConflictingBooking(
      bookingDate,
      preferredTime
    );

    if (conflictingBooking) {
      return NextResponse.json(
        { success: false, error: 'This time slot is already booked. Please choose another time.' },
        { status: 400 }
      );
    }

    // Create booking
    const result = await ServiceBookingModel.createServiceBooking({
      serviceId,
      serviceName,
      clientName,
      clientEmail,
      clientPhone: clientPhone || '',
      company: company || '',
      bookingDate: bookingDateTime,
      preferredTime,
      timezone: timezone || 'UTC',
      duration: duration || 60,
      message: message || '',
      status: 'pending',
    });

    // Send confirmation email to client
    try {
      await sendBookingConfirmationEmail({
        clientName,
        clientEmail,
        serviceName,
        bookingDate,
        preferredTime,
        duration,
        timezone: timezone || 'UTC',
        status: 'pending',
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    // Send notification to admin
    try {
      await sendServiceBookingEmail({
        clientName,
        clientEmail,
        clientPhone,
        company,
        serviceName,
        bookingDate,
        preferredTime,
        duration,
        timezone: timezone || 'UTC',
        message,
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
    }

    return NextResponse.json(
      { success: true, booking: result.booking },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

