import { NextResponse } from 'next/server';
import * as ServiceBookingModel from '@/lib/mongodb/models/ServiceBooking';
import { sendConfirmationEmail } from '@/lib/emailjs/send';

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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT /api/bookings/[id] - Update booking status (admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, meetingLink, notes } = body;

    // TODO: Add authentication check for admin

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
        const bookingDate = new Date(booking.bookingDate);
        await sendConfirmationEmail({
          name: booking.clientName,
          email: booking.clientEmail,
          message: `Your booking for ${booking.serviceName} on ${bookingDate.toLocaleDateString()} at ${booking.preferredTime} has been confirmed!${meetingLink ? `\n\nMeeting Link: ${meetingLink}` : ''}`,
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
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
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
    return NextResponse.json(
      { success: false, error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

