import { NextResponse } from 'next/server';
import * as ServiceBookingModel from '@/lib/mongodb/models/ServiceBooking';
import { sendBookingConfirmationEmail } from '@/lib/email/service';

// GET /api/bookings/[id] - Get a single booking
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const booking = await ServiceBookingModel.getServiceBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    // Always return JSON, even on error
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch booking' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking status (admin only)
export async function PUT(request, { params }) {
  try {
    // Require authentication for admin operations
    try {
      const { requireAuth } = await import('@/lib/auth/verify');
      await requireAuth();
    } catch (authError) {
      // Always return JSON, even on auth error
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, meetingLink, notes } = body;

    const booking = await ServiceBookingModel.getServiceBookingById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Update booking
    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'confirmed') {
        updateData.confirmedAt = new Date();
      } else if (status === 'cancelled') {
        updateData.cancelledAt = new Date();
        updateData.cancellationReason = body.cancellationReason || '';
      }
    }
    if (meetingLink !== undefined) updateData.meetingLink = meetingLink;
    if (notes !== undefined) updateData.notes = notes;

    await ServiceBookingModel.updateServiceBooking(id, updateData);

    // Send confirmation email if status changed to confirmed
    if (status === 'confirmed') {
      try {
        await sendBookingConfirmationEmail({
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          serviceName: booking.serviceName,
          bookingDate: booking.bookingDate,
          preferredTime: booking.preferredTime,
          duration: booking.duration,
          timezone: booking.timezone || 'UTC',
          status: 'confirmed',
          meetingLink: meetingLink || booking.meetingLink,
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    const updatedBooking = await ServiceBookingModel.getServiceBookingById(id);

    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    // Always return JSON, even on error
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to update booking' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/[id] - Cancel a booking
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Cancelled by user';

    await ServiceBookingModel.updateServiceBooking(id, {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancellationReason: reason,
    });

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    // Always return JSON, even on error
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to cancel booking' 
      },
      { status: 500 }
    );
  }
}

