import { NextResponse } from 'next/server';
import * as TestimonialModel from '@/lib/mongodb/models/Testimonial';
import { requireAuth } from '@/lib/auth/verify';

// GET /api/testimonials/[id] - Get single testimonial (public)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const testimonial = await TestimonialModel.getTestimonialById(id);

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Only return approved testimonials for public access
    if (!testimonial.isApproved) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      testimonial,
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT /api/testimonials/[id] - Update testimonial (admin only)
export async function PUT(request, { params }) {
  try {
    await requireAuth();

    const { id } = await params;
    const body = await request.json();

    // Validation
    if (body.rating && (body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const result = await TestimonialModel.updateTestimonial(id, body);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial (admin only)
export async function DELETE(request, { params }) {
  try {
    await requireAuth();

    const { id } = await params;
    const result = await TestimonialModel.deleteTestimonial(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

