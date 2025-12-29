import { NextResponse } from 'next/server';
import * as ServiceBookingModel from '@/lib/mongodb/models/ServiceBooking';
import { sendContactEmail, sendConfirmationEmail } from '@/lib/emailjs/send';

// GET /api/bookings - Get bookings (filtered by email if provided)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const filter = {};
    if (email) {
      filter.clientEmail = email.toLowerCase();
    }
    if (status) {
      filter.status = status;
    }

    const result = await ServiceBookingModel.getServiceBookings(filter, {
      page,
      limit,
      sort: { bookingDate: 1 },
    });

    return NextResponse.json({
      success: true,
      bookings: result.bookings,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
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
      await sendConfirmationEmail({
        name: clientName,
        email: clientEmail,
        message: `Your booking for ${serviceName} on ${bookingDate} at ${preferredTime} has been received. We'll confirm shortly!`,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the booking if email fails
    }

    // Send notification to admin
    try {
      await sendContactEmail({
        name: clientName,
        email: clientEmail,
        company: company || 'N/A',
        message: `New service booking:\n\nService: ${serviceName}\nDate: ${bookingDate}\nTime: ${preferredTime}\nClient: ${clientName}\nEmail: ${clientEmail}\nPhone: ${clientPhone || 'N/A'}\n\nMessage: ${message || 'No message'}`,
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

